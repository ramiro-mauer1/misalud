export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface DoctorContact {
  name: string;
  specialty: string;
  institution: string;
}

export interface ActiveMedication {
  name: string;
  freq: string;
}

export interface UserProfile {
  name: string;
  dni?: string;
  age?: number;
  bloodType?: string;
  allergies: string[];
  conditions: string[];
  emergencyContact?: EmergencyContact;
  primaryDoctor?: DoctorContact;
  activeMeds: ActiveMedication[];
}
