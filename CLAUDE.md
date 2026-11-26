# MiSalud

PWA en Vite + React 19 + TypeScript + Tailwind 4. Sin backend: los datos viven en IndexedDB (`src/lib/db.ts`).

## Comandos

- `npm run dev`: servidor local.
- `npm run build`: chequeo de tipos + build. Tiene que pasar antes de cada commit.

## Reglas

- Son datos de salud: nada sale del dispositivo sin que el usuario lo pida. No agregar analytics ni llamadas a servicios externos sin decidirlo antes.
- Si se cambia el esquema de IndexedDB, subir `DB_VERSION` y migrar en `upgrade`; nunca borrar los datos del usuario.
- No commitear `tsconfig.tsbuildinfo`, `.env*` ni datos reales de pacientes; para pruebas usar `src/data/mock-studies.ts`.
- Verificar en un celular de 390px de ancho antes de dar por terminado un cambio de interfaz.
