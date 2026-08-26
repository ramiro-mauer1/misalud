import { useState } from 'react';
import { ProfileCard } from '../components/ProfileCard';
import { ProfileEditorDrawer } from '../components/ProfileEditorDrawer';
import {
  UserCircle,
  PencilSimple,
} from '@phosphor-icons/react';
import type { UserProfile } from '../types/user';
import type { ClinicalStudy } from '../types/study';

export interface ProfilePageProps {
  profile?: UserProfile;
  studies?: ClinicalStudy[];
  onSaveProfile?: (updatedProfile: UserProfile) => void;
}

export function ProfilePage({ profile, onSaveProfile }: ProfilePageProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleSave = (updated: UserProfile) => {
    if (onSaveProfile) {
      onSaveProfile(updated);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent select-none">
      {/* Top Clinical Header */}
      <header className="flex-shrink-0 px-4 pt-[max(env(safe-area-inset-top),14px)] pb-3 border-b border-border-subtle/60 bg-canvas/90 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-teal flex items-center justify-center text-white font-bold text-xs shadow-2xs">
              <UserCircle size={20} weight="bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-[15px] font-bold text-text-primary tracking-tight">
                  Ficha Médica
                </h1>
                <span className="text-[10px] font-mono bg-accent-mint text-accent-teal px-1.5 py-0.2 rounded-full font-bold">
                  {profile?.name ? 'Activa' : 'Sin configurar'}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Historial consolidado del paciente
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="h-8 px-3 rounded-full bg-surface border border-border-subtle flex items-center gap-1.5 text-accent-teal text-[12px] font-semibold active:scale-90 transition-transform shadow-2xs cursor-pointer"
            aria-label="Gestionar perfil"
          >
            <PencilSimple size={14} weight="bold" />
            <span>Editar</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-4 scroll-view">
        {/* Profile Card / Digital Medical Passport */}
        <ProfileCard
          profile={profile}
          onEdit={() => setIsEditorOpen(true)}
        />
      </div>

      {/* Profile Management Drawer */}
      <ProfileEditorDrawer
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialProfile={profile}
        onSave={handleSave}
      />
    </div>
  );
}
