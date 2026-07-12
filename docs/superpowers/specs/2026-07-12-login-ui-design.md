# Especificación de Diseño: Interfaz de Login Ultra-Minimalista de Alto Contraste

Este documento describe la especificación de diseño para la mejora de la interfaz de la página de inicio de sesión (`/d4sh-ctrl/login`).

## 1. Contexto y Objetivos

- **Objetivo:** Renovar la interfaz visual de la pantalla de login del panel de control de administración para alinearla con el sistema de diseño premium del portafolio.
- **Enfoque Visual:** Composición ultra-minimalista, asimétrica y de alto contraste (Opción C + Enfoque 3).
- **Consistencia:** Utilizar los tokens de color del tema `oklch`, respetando la regla de "sin clases `dark:`" y utilizando las variables de color del tema definidas en `src/styles/globals.css`.
- **Navegabilidad:** Añadir un enlace sutil y elegante de retorno al portafolio principal (`/`).

## 2. Especificación Visual y de Layout

### Estructura
- **Contenedor Principal:**
  - Ocupa todo el alto de pantalla (`min-h-screen`) y ancho completo.
  - Color de fondo: `bg-background` (oklch dinámico).
  - Posicionamiento: alineado arriba (`items-start`), centrado horizontalmente (`justify-center`).
  - Margen superior interno (offset asimétrico): `pt-24 md:pt-36`.
  
### Tarjeta de Formulario
- **Contenedor de la Tarjeta:**
  - Fondo: `bg-card` (oklch dinámico).
  - Borde: `border border-border/50`.
  - Bordes redondeados: `rounded-4xl` (coherente con las directrices de `DESIGN.md` para contenedores premium).
  - Estructura interna: `flex flex-col gap-6 p-8 w-full max-w-sm`. No se utilizarán márgenes forzados (`mb-x` o `space-y-x`), en su lugar se gestionará el espaciado con `gap-6`.

### Tipografía y Textos
- **Título principal:** `font-heading text-2xl font-bold tracking-tight text-foreground text-center`.
- **Campos de Entrada (Input):**
  - Componente `<Input />` original de `@/components/ui/input`.
  - Sin personalizaciones de color locales que rompan el tema.
- **Botón de Envío:**
  - Componente `<Button type="submit" />` original con `variant="default"` (que por defecto mapea a `bg-primary`, el carmesí premium).
  - Cargando / Estado inactivo: Spinner original (`size-4`).
- **Mensaje de Error:**
  - Color: `text-destructive`.
  - Tipografía: `text-sm text-center`.

### Enlace de Retorno
- Ubicado abajo del formulario en el flujo de la tarjeta.
- Alineado al centro (`flex justify-center`).
- Enlace `<Link href="/" />` con un icono `ArrowLeft` de tamaño `size-3.5` y texto "Volver al portafolio".
- Color del texto: `text-muted-foreground` que cambia a `text-primary` en hover.

## 3. Comportamiento y Animaciones

- **Animación de Entrada:**
  - La tarjeta completa utilizará un componente `<m.div>` de `framer-motion` para animar su carga.
  - Efecto: Fusión suave y ascenso físico (`initial={{ opacity: 0, y: 16, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}`).
  - Curva de animación: `EASE_PREMIUM` (`[0.16, 1, 0.3, 1]`) con una duración de `0.8` segundos (o resorte `SPRING_SOFT`).
