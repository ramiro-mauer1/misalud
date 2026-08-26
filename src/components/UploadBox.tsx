import { useRef, type ChangeEvent } from 'react';
import { Camera, FileArrowUp, FilePdf } from '@phosphor-icons/react';

export interface UploadBoxProps {
  onFileSelected: (file: File) => void;
}

export function UploadBox({ onFileSelected }: UploadBoxProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelected(file);
      e.target.value = '';
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelected(file);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hidden native file inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleCameraChange}
        className="hidden"
        accept="image/*"
        capture="environment"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf,image/*"
      />

      {/* Main Minimalist Double-Bezel Upload Card */}
      <div className="w-full bg-surface-subtle/80 p-1.5 rounded-3xl border border-border-subtle shadow-xs">
        <div className="bg-surface rounded-[calc(1.5rem-4px)] p-6 sm:p-8 flex flex-col items-center text-center border border-border-subtle/60">
          
          {/* Minimalist Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-accent-mint/60 border border-accent-teal/20 flex items-center justify-center text-accent-teal mb-4 shadow-inner">
            <FileArrowUp size={32} weight="bold" />
          </div>

          <h2 className="text-[17px] font-bold text-text-primary tracking-tight">
            Ingresar Estudio Médico
          </h2>
          
          <p className="text-[13px] text-text-secondary mt-1.5 max-w-[260px] leading-relaxed">
            Subí tu archivo o una foto de tus estudios
          </p>

          {/* Direct Action Buttons */}
          <div className="w-full mt-6 space-y-2.5">
            {/* Primary: Take Photo with Camera */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="w-full py-3.5 px-4 bg-accent-teal text-white rounded-2xl font-semibold text-[14px] flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.97] transition-all duration-150 cursor-pointer hover:bg-accent-teal/95"
            >
              <Camera size={19} weight="bold" />
              <span>Tomar Foto con la Cámara</span>
            </button>

            {/* Secondary: Upload File / Gallery */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 px-4 bg-surface-subtle border border-border-subtle text-text-primary rounded-2xl font-semibold text-[14px] flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all duration-150 cursor-pointer hover:bg-accent-mint/40"
            >
              <FilePdf size={19} weight="bold" className="text-accent-teal" />
              <span>Subir Archivo o PDF</span>
            </button>
          </div>

          {/* Formats Strip */}
          <div className="mt-6 pt-4 border-t border-border-subtle/60 w-full flex items-center justify-center gap-2 text-[11px] font-mono text-text-secondary">
            <span className="bg-canvas px-2 py-0.5 rounded-md border border-border-subtle">PDF</span>
            <span className="bg-canvas px-2 py-0.5 rounded-md border border-border-subtle">JPG</span>
            <span className="bg-canvas px-2 py-0.5 rounded-md border border-border-subtle">PNG</span>
            <span className="bg-canvas px-2 py-0.5 rounded-md border border-border-subtle">HEIC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
