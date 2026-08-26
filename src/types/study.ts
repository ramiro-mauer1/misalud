export type StudyType = 'laboratorio' | 'imagen' | 'receta';

export interface ClinicalStudy {
  id: string;
  type: StudyType;
  title: string;
  date: string;
  professional: string;
  institution: string;
  summary: string;
  details: string;
  fileBlob?: Blob;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  fileUrl?: string;
}
