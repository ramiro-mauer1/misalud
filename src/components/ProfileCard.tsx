import {
  WarningCircle,
  Heartbeat,
  Stethoscope,
  Phone,
  Drop,
  Pill,
  User,
  Plus,
  PencilSimple,
} from '@phosphor-icons/react';
import type { UserProfile } from '../types/user';

export interface ProfileCardProps {
  profile?: UserProfile;
  onEdit?: () => void;
}

export function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  const hasProfile = Boolean(profile && profile.name);

  if (!hasProfile || !profile) {
    return (
      <div className="bg-surface-subtle/70 p-1.5 rounded-3xl border border-border-subtle shadow-2xs">
        <div className="bg-surface rounded-[calc(1.5rem-4px)] p-6 flex flex-col items-center text-center border border-border-subtle/60">
          <div className="w-14 h-14 rounded-2xl bg-accent-mint/60 flex items-center justify-center text-accent-teal mb-3 shadow-inner">
            <User size={28} weight="bold" />
          </div>
          <h2 className="text-[15px] font-bold text-text-primary">
            Ficha Médica de Emergencia
          </h2>
          <p className="text-[12px] text-text-secondary mt-1 max-w-[240px] leading-relaxed">
            Completá tus datos clínicos para configurar alertas de alergias, grupo sanguíneo y contacto de emergencia.
          </p>
          <button
            type="button"
            onClick={onEdit}
            className="mt-4 px-4 py-2.5 bg-accent-teal text-white rounded-xl text-[13px] font-semibold flex items-center gap-1.5 active:scale-95 transition-transform shadow-2xs cursor-pointer"
          >
            <Plus size={16} weight="bold" />
            Configurar Ficha Médica
          </button>
        </div>
      </div>
    );
  }

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-4">
      {/* Digital Medical Passport Card (Double-Bezel Hardware) */}
      <div className="bg-surface-subtle/80 p-1.5 rounded-3xl border border-border-subtle shadow-xs">
        <div className="bg-surface rounded-[calc(1.5rem-4px)] p-4 relative overflow-hidden border border-border-subtle/60">
          
          {/* Header ID Band */}
          <div className="flex items-center justify-between border-b border-border-subtle/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-teal to-[#164E4B] flex items-center justify-center text-white font-bold text-base shadow-sm">
                {initials}
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-text-primary tracking-tight">
                  {profile.name}
                </h2>
                <p className="text-[11px] font-mono text-text-secondary">
                  {profile.dni ? `DNI ${profile.dni}` : 'Sin DNI registrado'}
                  {profile.age ? ` · ${profile.age} años` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {profile.bloodType && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-700 font-mono text-[11px] font-bold">
                  <Drop size={13} weight="fill" />
                  <span>{profile.bloodType}</span>
                </div>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="w-8 h-8 rounded-full bg-surface-subtle border border-border-subtle flex items-center justify-center text-accent-teal hover:text-accent-teal/80 active:scale-90 transition-transform cursor-pointer"
                  aria-label="Editar ficha"
                >
                  <PencilSimple size={15} weight="bold" />
                </button>
              )}
            </div>
          </div>

          {/* Allergies Highlight Section */}
          {profile.allergies.length > 0 && (
            <div className="mt-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-rose-700">
                  Alergias Críticas (Alerta Médica)
                </span>
                <span className="text-[10px] font-mono text-rose-600 font-semibold">
                  No administrar
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="bg-rose-50/90 text-rose-800 border border-rose-200/90 rounded-xl px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1 shadow-2xs font-mono"
                  >
                    <WarningCircle size={13} weight="fill" className="text-rose-600" />
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Active Diagnoses */}
          {profile.conditions.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-border-subtle/50">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-accent-sage">
                Condiciones Activas
              </span>
              <div className="mt-1.5 space-y-1">
                {profile.conditions.map((condition) => (
                  <div
                    key={condition}
                    className="flex items-center gap-2 p-2 rounded-xl bg-canvas border border-border-subtle/60 text-[12px] font-medium text-text-primary"
                  >
                    <Heartbeat size={15} weight="bold" className="text-accent-teal flex-shrink-0" />
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Prescriptions Strip */}
          {profile.activeMeds.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-border-subtle/50">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#8B6914]">
                Medicación en Curso
              </span>
              <div className="mt-1.5 space-y-1">
                {profile.activeMeds.map((med) => (
                  <div
                    key={med.name}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FFFBF2] border border-amber-200/80 text-[12px]"
                  >
                    <div className="flex items-center gap-2">
                      <Pill size={15} weight="bold" className="text-[#8B6914]" />
                      <span className="font-semibold text-text-primary">{med.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#8B6914]">{med.freq}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Doctor & Emergency Contacts */}
      <div className="grid grid-cols-1 gap-2.5">
        {profile.primaryDoctor && (
          <div className="bg-surface p-3.5 rounded-2xl border border-border-subtle shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-mint/70 flex items-center justify-center text-accent-teal flex-shrink-0">
                <Stethoscope size={20} weight="bold" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider font-bold text-accent-sage">
                  Médico de Cabecera
                </p>
                <p className="text-[13px] font-bold text-text-primary">
                  {profile.primaryDoctor.name}
                </p>
                <p className="text-[11px] text-text-secondary">
                  {profile.primaryDoctor.specialty} · {profile.primaryDoctor.institution}
                </p>
              </div>
            </div>
          </div>
        )}

        {profile.emergencyContact && (
          <div className="bg-surface p-3.5 rounded-2xl border border-border-subtle shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
                <Phone size={20} weight="bold" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider font-bold text-rose-700">
                  Contacto de Emergencia
                </p>
                <p className="text-[13px] font-bold text-text-primary">
                  {profile.emergencyContact.name}{' '}
                  <span className="font-normal text-text-secondary">
                    ({profile.emergencyContact.relation})
                  </span>
                </p>
                <p className="text-[11px] font-mono text-text-secondary">
                  {profile.emergencyContact.phone}
                </p>
              </div>
            </div>

            <a
              href={`tel:${profile.emergencyContact.phone.replace(/\s+/g, '')}`}
              className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-transform"
            >
              Llamar
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
