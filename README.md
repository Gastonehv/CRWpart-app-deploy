# CRW party

Aplicación web móvil ultra atractiva para reservas y gestión de eventos, construida con Next.js, TailwindCSS, animaciones modernas y Supabase como backend.

## Instalación rápida

1. Clona el repo o copia los archivos.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env.local` en la raíz con tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=TU_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
   ```
4. Arranca en local:
   ```bash
   npm run dev
   ```
5. Accede en tu móvil a `http://localhost:3000` o `http://TU_IP_LOCAL:3000`.

## Personalización
- Cambia colores en `tailwind.config.js`.
- Edita animaciones en `/src/components/AnimatedBackground.js` y `/src/components/Animations.js`.
- Cambia el logo en `/public/logo.png` y los iconos en `/public/icon-192.png`, `/public/icon-512.png`.

## Funcionalidades
- Registro/login con feedback y validación.
- Dashboard móvil para ver y editar reservas/perfil.
- Modo día/noche automático o manual.
- Animaciones de fondo (canvas/GSAP), micro-interacciones y efectos wow.
- PWA: funciona offline y se instala en el móvil.

## Estructura
- `/src/components`: Componentes reutilizables.
- `/src/pages`: Páginas Next.js (bienvenida, login, dashboard, etc).
- `/src/lib`: Hooks y utilidades (ej: Supabase).
- `/public`: Imágenes, iconos, manifest.

## Despliegue

1. Configura variables en Vercel, Netlify o tu servidor favorito.
2. Sube el proyecto y ¡listo!

---

### ¿Dudas o quieres personalizar más?
Solo edita los componentes o los colores. El código es modular y fácil de mantener.
