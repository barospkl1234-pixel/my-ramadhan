import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'Jakarta';
  const country = 'Indonesia';
  const monthsToFetch = [1, 2, 3, 4]; // Ambil beberapa bulan termasuk Ramadhan (9)

  try {
    // 1. Fetch data dari Aladhan untuk setiap bulan
    const results = await Promise.all(
      monthsToFetch.map((m) =>
        fetch(
          `https://api.aladhan.com/v1/calendarByCity/${dayjs().year()}/${m}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=20`
        )
      )
    );

    // 2. Cek response ok
    for (const res of results) {
      if (!res.ok) {
        throw new Error(`Aladhan API error: ${res.status} ${res.statusText}`);
      }
    }

    // 3. Parse semua response
    const allData = await Promise.all(results.map((r) => r.json()));
    const rawData = allData.flatMap((d) => d.data || []); // d.data bisa undefined

    // 4. Filter hanya bulan Ramadhan (9) dan validasi setiap item
    const schedule = [];

    for (const item of rawData) {
      try {
        // Validasi struktural
        if (!item?.date?.hijri?.month?.number) continue;
        if (item.date.hijri.month.number !== 9) continue;

        // Validasi tanggal gregorian
        const gregorianDate = item.date.gregorian?.date;
        if (!gregorianDate) continue;
        const itemDate = dayjs(gregorianDate, 'DD-MM-YYYY');
        if (!itemDate.isValid()) {
          console.warn(`Invalid date for item: ${gregorianDate}`);
          continue;
        }

        // Validasi timings
        const timings = item.timings;
        if (!timings) continue;

        // Ambil waktu, split untuk menghilangkan (WIB) dll
        const getTime = (key) => timings[key]?.split(' ')[0] || '';

        schedule.push({
          date: item.date.readable || gregorianDate,
          isoDate: itemDate.toISOString(),
          hijri: `${item.date.hijri.day || ''} ${item.date.hijri.month?.en || ''} ${item.date.hijri.year || ''}`,
          timings: {
            Imsak: getTime('Imsak'),
            Subuh: getTime('Fajr'),
            Dzuhur: getTime('Dhuhr'),
            Ashar: getTime('Asr'),
            Maghrib: getTime('Maghrib'),
            Isya: getTime('Isha'),
          },
        });
      } catch (err) {
        console.error('Error processing item:', err, item);
        // Skip item bermasalah, lanjutkan
      }
    }

    if (schedule.length === 0) {
      console.warn(`No Ramadhan schedule found for city: ${city}`);
    }

    return NextResponse.json(
      {
        location: city,
        year: dayjs().year(),
        schedule,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API /api/schedule error:', error);
    return NextResponse.json(
      { error: 'Gagal memuat jadwal sholat', details: error.message },
      { status: 500 }
    );
  }
}