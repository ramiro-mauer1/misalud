import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ClinicalStudy } from '../types/study';
import type { UserProfile } from '../types/user';

interface MiSaludDB extends DBSchema {
  studies: {
    key: string;
    value: ClinicalStudy;
    indexes: {
      'by-date': string;
      'by-type': string;
      'by-professional': string;
    };
  };
  profile: {
    key: string;
    value: UserProfile;
  };
}

const DB_NAME = 'misalud_db_v1';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MiSaludDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<MiSaludDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create Studies store with search indexes
        if (!db.objectStoreNames.contains('studies')) {
          const studyStore = db.createObjectStore('studies', { keyPath: 'id' });
          studyStore.createIndex('by-date', 'date');
          studyStore.createIndex('by-type', 'type');
          studyStore.createIndex('by-professional', 'professional');
        }

        // Create Profile store
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile');
        }
      },
    });
  }
  return dbPromise;
}

// ============================================================================
// Studies API (IndexedDB)
// ============================================================================

export async function getAllStudiesDB(): Promise<ClinicalStudy[]> {
  try {
    const db = await getDB();
    const studies = await db.getAll('studies');
    // Sort by date descending (newest first)
    return studies.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.error('Error reading studies from IndexedDB:', err);
    return [];
  }
}

export async function saveStudyDB(study: ClinicalStudy): Promise<void> {
  try {
    const db = await getDB();
    await db.put('studies', study);
  } catch (err) {
    console.error('Error saving study to IndexedDB:', err);
    throw err;
  }
}

export async function deleteStudyDB(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('studies', id);
  } catch (err) {
    console.error('Error deleting study from IndexedDB:', err);
    throw err;
  }
}

// ============================================================================
// Profile API (IndexedDB)
// ============================================================================

export async function getProfileDB(): Promise<UserProfile | undefined> {
  try {
    const db = await getDB();
    return await db.get('profile', 'current_user');
  } catch (err) {
    console.error('Error reading profile from IndexedDB:', err);
    return undefined;
  }
}

export async function saveProfileDB(profile: UserProfile): Promise<void> {
  try {
    const db = await getDB();
    await db.put('profile', profile, 'current_user');
  } catch (err) {
    console.error('Error saving profile to IndexedDB:', err);
    throw err;
  }
}

// ============================================================================
// Migration helper from legacy localStorage
// ============================================================================

export async function migrateFromLocalStorage(): Promise<{
  studies: ClinicalStudy[];
  profile?: UserProfile;
}> {
  try {
    const existingStudies = await getAllStudiesDB();
    const existingProfile = await getProfileDB();

    if (existingStudies.length > 0 || existingProfile) {
      return { studies: existingStudies, profile: existingProfile };
    }

    // Attempt import from localStorage if empty
    const legacyStudiesRaw = localStorage.getItem('misalud_studies_v1');
    const legacyProfileRaw = localStorage.getItem('misalud_profile_v1');

    let migratedStudies: ClinicalStudy[] = [];
    let migratedProfile: UserProfile | undefined = undefined;

    if (legacyStudiesRaw) {
      try {
        migratedStudies = JSON.parse(legacyStudiesRaw);
        for (const study of migratedStudies) {
          await saveStudyDB(study);
        }
      } catch {
        // ignore JSON errors
      }
    }

    if (legacyProfileRaw) {
      try {
        migratedProfile = JSON.parse(legacyProfileRaw);
        if (migratedProfile) {
          await saveProfileDB(migratedProfile);
        }
      } catch {
        // ignore JSON errors
      }
    }

    return {
      studies: migratedStudies.length > 0 ? migratedStudies : await getAllStudiesDB(),
      profile: migratedProfile || await getProfileDB(),
    };
  } catch (err) {
    console.error('Migration error:', err);
    return { studies: [] };
  }
}
