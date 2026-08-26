import { useState, useEffect, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Plus,
  Trash,
  User,
  Drop,
  WarningCircle,
  Heartbeat,
  Pill,
  Stethoscope,
  Phone,
  Check,
} from '@phosphor-icons/react';
import type { UserProfile, ActiveMedication } from '../types/user';

export interface ProfileEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile?: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'];

export function ProfileEditorDrawer({
  isOpen,
  onClose,
  initialProfile,
  onSave,
}: ProfileEditorDrawerProps) {
  const [mounted, setMounted] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [age, setAge] = useState<number | undefined>(undefined);
  const [bloodType, setBloodType] = useState<string>('');
  
  // Dynamic lists
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');

  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');

  const [activeMeds, setActiveMeds] = useState<ActiveMedication[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');

  // Doctor & Emergency
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('');
  const [doctorInstitution, setDoctorInstitution] = useState('');

  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state when opening with initial data
  useEffect(() => {
    if (isOpen) {
      setName(initialProfile?.name || '');
      setDni(initialProfile?.dni || '');
      setAge(initialProfile?.age);
      setBloodType(initialProfile?.bloodType || '');
      setAllergies(initialProfile?.allergies || []);
      setConditions(initialProfile?.conditions || []);
      setActiveMeds(initialProfile?.activeMeds || []);
      
      setDoctorName(initialProfile?.primaryDoctor?.name || '');
      setDoctorSpecialty(initialProfile?.primaryDoctor?.specialty || '');
      setDoctorInstitution(initialProfile?.primaryDoctor?.institution || '');

      setEmergencyName(initialProfile?.emergencyContact?.name || '');
      setEmergencyRelation(initialProfile?.emergencyContact?.relation || '');
      setEmergencyPhone(initialProfile?.emergencyContact?.phone || '');
    }
  }, [isOpen, initialProfile]);

  if (!mounted) return null;

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleAddCondition = () => {
    if (newCondition.trim() && !conditions.includes(newCondition.trim())) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleAddMed = () => {
    if (newMedName.trim()) {
      setActiveMeds([
        ...activeMeds,
        {
          name: newMedName.trim(),
          freq: newMedFreq.trim() || 'Según indicación médica',
        },
      ]);
      setNewMedName('');
      setNewMedFreq('');
    }
  };

  const handleRemoveMed = (index: number) => {
    setActiveMeds(activeMeds.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedProfile: UserProfile = {
      name: name.trim(),
      dni: dni.trim() || undefined,
      age: age ? Number(age) : undefined,
      bloodType: bloodType || undefined,
      allergies,
      conditions,
      activeMeds,
      primaryDoctor: doctorName.trim()
        ? {
            name: doctorName.trim(),
            specialty: doctorSpecialty.trim() || 'Médico General',
            institution: doctorInstitution.trim() || 'Centro de Salud',
          }
        : undefined,
      emergencyContact: emergencyName.trim()
        ? {
            name: emergencyName.trim(),
            relation: emergencyRelation.trim() || 'Familiar',
            phone: emergencyPhone.trim() || '',
          }
        : undefined,
    };

    onSave(updatedProfile);
    onClose();
  };

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none overflow-hidden">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs pointer-events-auto"
          />

          {/* Drawer Container */}
          <div className="w-full max-w-md mx-auto pointer-events-auto z-50 flex flex-col justify-end">
            <motion.div
              key="profile-drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full bg-surface rounded-t-3xl max-h-[90vh] flex flex-col shadow-[0_-8px_32px_rgba(26,46,43,0.18)] border-t border-border-subtle overflow-hidden"
            >
              {/* Grab Handle */}
              <div className="w-12 h-1.5 bg-border-subtle rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />

              {/* Header */}
              <div className="flex-shrink-0 px-5 pt-1 pb-3 border-b border-border-subtle/70 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text-primary tracking-tight">
                    Gestionar Ficha Médica
                  </h2>
                  <p className="text-[12px] text-text-secondary">
                    Configurá tu perfil e información de emergencia
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-text-secondary hover:text-text-primary active:scale-90 transition-transform cursor-pointer"
                >
                  <X weight="bold" size={16} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                
                {/* 1. Datos Personales */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-accent-teal">
                    <User size={16} weight="bold" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                      Datos del Paciente
                    </span>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-text-secondary mb-1">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Valentina Herrera"
                      className="w-full bg-surface-subtle border border-border-subtle rounded-xl py-2.5 px-3.5 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[12px] font-medium text-text-secondary mb-1">
                        DNI / Documento
                      </label>
                      <input
                        type="text"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        placeholder="Ej: 38.412.990"
                        className="w-full bg-surface-subtle border border-border-subtle rounded-xl py-2.5 px-3.5 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium text-text-secondary mb-1">
                        Edad
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={age ?? ''}
                        onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Ej: 34"
                        className="w-full bg-surface-subtle border border-border-subtle rounded-xl py-2.5 px-3.5 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Grupo Sanguíneo */}
                <div className="space-y-2 pt-2 border-t border-border-subtle/60">
                  <div className="flex items-center gap-1.5 text-rose-700">
                    <Drop size={16} weight="fill" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                      Grupo Sanguíneo
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {BLOOD_TYPES.map((type) => {
                      const isSelected = bloodType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setBloodType(isSelected ? '' : type)}
                          className={`
                            px-3 py-1.5 rounded-xl font-mono text-[12px] font-bold border transition-all cursor-pointer active:scale-95
                            ${
                              isSelected
                                ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                                : 'bg-surface-subtle text-text-secondary border-border-subtle hover:text-text-primary'
                            }
                          `}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Alergias Críticas */}
                <div className="space-y-2.5 pt-2 border-t border-border-subtle/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-rose-700">
                      <WarningCircle size={16} weight="fill" />
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                        Alergias Críticas (SOS)
                      </span>
                    </div>
                    <span className="text-[10px] text-text-secondary font-mono">
                      {allergies.length} añadidas
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy())}
                      placeholder="Ej: Penicilina, Sulfas..."
                      className="flex-1 bg-surface-subtle border border-border-subtle rounded-xl py-2 px-3 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddAllergy}
                      className="px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Plus size={14} weight="bold" />
                      <span>Agregar</span>
                    </button>
                  </div>

                  {allergies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="bg-rose-50 text-rose-800 border border-rose-200 rounded-xl px-2.5 py-1 text-[11px] font-mono font-semibold flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>{allergy}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAllergy(idx)}
                            className="text-rose-400 hover:text-rose-700 cursor-pointer"
                          >
                            <X size={12} weight="bold" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Condiciones Médicas */}
                <div className="space-y-2.5 pt-2 border-t border-border-subtle/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-accent-sage">
                      <Heartbeat size={16} weight="bold" />
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                        Condiciones Médicas Activas
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCondition())}
                      placeholder="Ej: Hipertensión, Hipotiroidismo..."
                      className="flex-1 bg-surface-subtle border border-border-subtle rounded-xl py-2 px-3 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal"
                    />
                    <button
                      type="button"
                      onClick={handleAddCondition}
                      className="px-3.5 py-2 bg-accent-mint text-accent-teal border border-accent-teal/20 rounded-xl text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Plus size={14} weight="bold" />
                      <span>Agregar</span>
                    </button>
                  </div>

                  {conditions.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {conditions.map((condition, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-surface-subtle border border-border-subtle text-[12px] text-text-primary"
                        >
                          <span className="font-medium">{condition}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCondition(idx)}
                            className="text-text-secondary hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash size={13} weight="bold" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Medicación Activa */}
                <div className="space-y-2.5 pt-2 border-t border-border-subtle/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#8B6914]">
                      <Pill size={16} weight="bold" />
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                        Medicación en Curso
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      placeholder="Nombre del fármaco (ej: Enalapril 10mg)"
                      className="w-full bg-surface-subtle border border-border-subtle rounded-xl py-2 px-3 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMedFreq}
                        onChange={(e) => setNewMedFreq(e.target.value)}
                        placeholder="Frecuencia (ej: 1 comp. cada 12h)"
                        className="flex-1 bg-surface-subtle border border-border-subtle rounded-xl py-2 px-3 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddMed}
                        className="px-3.5 py-2 bg-[#FFF3E0] text-[#8B6914] border border-amber-300/80 rounded-xl text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                      >
                        <Plus size={14} weight="bold" />
                        <span>Añadir</span>
                      </button>
                    </div>
                  </div>

                  {activeMeds.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {activeMeds.map((med, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#FFFBF2] border border-amber-200 text-[12px]"
                        >
                          <div>
                            <p className="font-bold text-text-primary">{med.name}</p>
                            <p className="font-mono text-[11px] text-[#8B6914]">{med.freq}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMed(idx)}
                            className="text-text-secondary hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash size={13} weight="bold" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Contacto de Emergencia */}
                <div className="space-y-3 pt-2 border-t border-border-subtle/60">
                  <div className="flex items-center gap-1.5 text-rose-700">
                    <Phone size={16} weight="bold" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                      Contacto de Emergencia
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[12px] font-medium text-text-secondary mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="Ej: Marcos Herrera"
                        className="w-full bg-surface-subtle border border-border-subtle rounded-xl py-2 px-3 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-text-secondary mb-1">
                        Parentesco
                      </label>
                      <input
                        type="text"
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        placeholder="Ej: Pareja, Madre..."
                        className="w-full bg-surface-subtle border border-border-subtle rounded-xl py-2 px-3 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-text-secondary mb-1">
                      Teléfono de Emergencia
                    </label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="Ej: +54 341 555-0142"
                      className="w-full bg-surface-subtle border border-border-subtle rounded-xl py-2 px-3 text-[13px] font-mono text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal"
                    />
                  </div>
                </div>

                {/* 7. Médico de Cabecera */}
                <div className="space-y-3 pt-2 border-t border-border-subtle/60">
                  <div className="flex items-center gap-1.5 text-accent-teal">
                    <Stethoscope size={16} weight="bold" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                      Médico de Cabecera
                    </span>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-text-secondary mb-1">
                      Nombre del Profesional
                    </label>
                    <input
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="Ej: Dr. Pablo Estévez"
                      className="w-full bg-surface-subtle border border-border-subtle rounded-xl py-2 px-3 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[12px] font-medium text-text-secondary mb-1">
                        Especialidad
                      </label>
                      <input
                        type="text"
                        value={doctorSpecialty}
                        onChange={(e) => setDoctorSpecialty(e.target.value)}
                        placeholder="Ej: Medicina Interna"
                        className="w-full bg-surface-subtle border border-border-subtle rounded-xl py-2 px-3 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-text-secondary mb-1">
                        Institución
                      </label>
                      <input
                        type="text"
                        value={doctorInstitution}
                        onChange={(e) => setDoctorInstitution(e.target.value)}
                        placeholder="Ej: Hospital Italiano"
                        className="w-full bg-surface-subtle border border-border-subtle rounded-xl py-2 px-3 text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Save Button inside Form */}
                <div className="pt-4 pb-4">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-accent-teal text-white rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm active:scale-97 transition-all cursor-pointer hover:bg-accent-teal/95"
                  >
                    <Check size={18} weight="bold" />
                    <span>Guardar Ficha Médica</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
