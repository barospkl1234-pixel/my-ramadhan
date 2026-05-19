import localforage from 'localforage';

// ─── KONFIGURASI DATABASE LOKAL (INDEXEDDB) ───
localforage.config({
  name: 'MyRamadhanApp',
  storeName: 'ramadhan_data',
});

export const StorageService = {
  // =====================================================================
  // 1. PROFIL & PREFERENSI
  // =====================================================================
  async getProfile() {
    return (
      (await localforage.getItem('user_profile')) || {
        name: 'Hamba Allah',
        location_city: 'Jakarta',
        app_theme: 'light',
      }
    );
  },

  async saveProfile(updateData) {
    const currentProfile = await this.getProfile();
    const newProfile = { ...currentProfile, ...updateData };
    await localforage.setItem('user_profile', newProfile);
    return newProfile;
  },

  // =====================================================================
  // 2. DAILY TRACKER (Ibadah Harian)
  // =====================================================================
  async getDailyTracker(date) {
    const trackers = (await localforage.getItem('trackers')) || {};
    return trackers[date] || null;
  },

  async saveDailyTracker(date, trackerData) {
    const trackers = (await localforage.getItem('trackers')) || {};
    trackers[date] = { ...trackers[date], ...trackerData, date };
    await localforage.setItem('trackers', trackers);
    return trackers[date];
  },

  // =====================================================================
  // 3. JURNAL REFLEKSI
  // =====================================================================
  async getJournals() {
    return (await localforage.getItem('journals')) || [];
  },

  async saveJournal(journalEntry) {
    const journals = await this.getJournals();

    // Jika entry baru
    if (!journalEntry.id) {
      journalEntry.id = Date.now().toString();
      journalEntry.created_at = new Date().toISOString();
      journals.unshift(journalEntry); // Taruh di paling atas
    } else {
      // Update entry lama
      const index = journals.findIndex((j) => j.id === journalEntry.id);
      if (index > -1) {
        journals[index] = { ...journals[index], ...journalEntry };
      }
    }
    await localforage.setItem('journals', journals);
    return journalEntry;
  },

  async deleteJournal(id) {
    const journals = await this.getJournals();
    const filteredJournals = journals.filter((j) => j.id !== id);
    await localforage.setItem('journals', filteredJournals);
    return true;
  },

  // =====================================================================
  // 4. HAID TRACKER
  // =====================================================================
  async getHaidData() {
    return (
      (await localforage.getItem('haid_logs')) || { logs: [], settings: {} }
    );
  },

  async saveHaidData(haidData) {
    await localforage.setItem('haid_logs', haidData);
    return haidData;
  },

  // =====================================================================
  // 5. BOOKMARK & PROGRESS BACAAN (Qur'an, Doa, Fiqih, dll)
  // =====================================================================
  async getUserMeta(columnKey) {
    const meta = (await localforage.getItem('user_meta')) || {};
    return meta[columnKey] || null;
  },

  async saveUserMeta(columnKey, value) {
    const meta = (await localforage.getItem('user_meta')) || {};
    meta[columnKey] = value;
    await localforage.setItem('user_meta', meta);
    return value;
  },

  // =====================================================================
  // 6. MESIN SINKRONISASI P2P (WEBRTC) & BACKUP
  // =====================================================================

  async getAllSyncData() {
    return {
      profile: await localforage.getItem('user_profile'),
      trackers: await localforage.getItem('ramadhan_tracker'),
      journals: await localforage.getItem('journal_entries'),
      haid_logs: await localforage.getItem('haid_logs'),
      user_meta: await localforage.getItem('user_meta'),
      last_sync: new Date().toISOString(),
    };
  },

  async importSyncData(syncData) {
    if (!syncData) throw new Error('Data sinkronisasi kosong');

    if (syncData.profile)
      await localforage.setItem('user_profile', syncData.profile);
    if (syncData.trackers)
      await localforage.setItem('ramadhan_tracker', syncData.trackers);
    if (syncData.journals)
      await localforage.setItem('journal_entries', syncData.journals);
    if (syncData.haid_logs)
      await localforage.setItem('haid_logs', syncData.haid_logs);
    if (syncData.user_meta)
      await localforage.setItem('user_meta', syncData.user_meta);

    return true;
  },

  // =====================================================================
  // 7. FUNGSI RESET / DANGER ZONE
  // =====================================================================
  async clearAllData() {
    await localforage.removeItem('ramadhan_tracker');
    await localforage.removeItem('journal_entries');
    await localforage.removeItem('haid_logs');
    await localforage.removeItem('user_meta');
    return true;
  },
};
