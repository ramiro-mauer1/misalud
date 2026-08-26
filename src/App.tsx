import { useState, useEffect } from 'react';
import { HorizontalPager } from './components/HorizontalPager';
import { BottomDock } from './components/BottomDock';
import { VaultPage } from './pages/VaultPage';
import { IngestPage } from './pages/IngestPage';
import { ProfilePage } from './pages/ProfilePage';
import Velaris from '@/components/ui/velaris';
import {
  saveStudyDB,
  deleteStudyDB,
  saveProfileDB,
  migrateFromLocalStorage,
} from './lib/db';
import type { ClinicalStudy } from './types/study';
import type { UserProfile } from './types/user';

export default function App() {
  // Starts on Page 1 (IngestPage / Upload) as default
  const [activePage, setActivePage] = useState(1);

  // Real dynamic studies state from IndexedDB
  const [studies, setStudies] = useState<ClinicalStudy[]>([]);

  // User Profile state from IndexedDB
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined);

  // Initialize and migrate data from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;

    async function initDB() {
      try {
        const { studies: loadedStudies, profile: loadedProfile } = await migrateFromLocalStorage();
        if (isMounted) {
          setStudies(loadedStudies);
          setProfile(loadedProfile);
        }
      } catch (err) {
        console.error('Failed to initialize IndexedDB:', err);
      }
    }

    initDB();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStudyIngested = async (newStudy: ClinicalStudy) => {
    try {
      await saveStudyDB(newStudy);
      setStudies((prev) => [newStudy, ...prev]);
      
      // Smoothly transition to the Vault (page 0) to view the newly ingested study
      setTimeout(() => {
        setActivePage(0);
      }, 500);
    } catch (err) {
      console.error('Error saving study to IndexedDB:', err);
    }
  };

  const handleDeleteStudy = async (id: string) => {
    try {
      await deleteStudyDB(id);
      setStudies((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting study from IndexedDB:', err);
    }
  };

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    try {
      await saveProfileDB(updatedProfile);
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error saving profile to IndexedDB:', err);
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-neutral-900 flex items-center justify-center">
      {/* Mobile-first App Shell Container */}
      <main className="w-full max-w-md h-[100dvh] bg-canvas relative overflow-hidden shadow-2xl flex flex-col sm:border-x sm:border-border-subtle">
        
        {/* Living Clinical WebGL Ambient Background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-85">
          <Velaris
            bg="#EBF4F2"
            colors={["#A7DFD5", "#6BB5AA", "#409792", "#1E6C68"]}
            speed={1.0}
            grain={0.12}
            height="100%"
          />
        </div>

        {/* Swipable 60 FPS Horizontal Pager */}
        <div className="flex-1 w-full h-full relative overflow-hidden z-10">
          <HorizontalPager page={activePage} onPageChange={setActivePage}>
            <VaultPage
              studies={studies}
              profile={profile}
              onScanClick={() => setActivePage(1)}
              onDeleteStudy={handleDeleteStudy}
            />
            <IngestPage
              onStudyIngested={handleStudyIngested}
              recentStudies={studies}
            />
            <ProfilePage
              profile={profile}
              studies={studies}
              onSaveProfile={handleSaveProfile}
            />
          </HorizontalPager>
        </div>

        {/* Floating High-End Clinical Dock (Bottom Navigation) */}
        <BottomDock
          activePage={activePage}
          onPageSelect={setActivePage}
          studyCount={studies.length}
        />
      </main>
    </div>
  );
}
