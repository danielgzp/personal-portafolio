# Personal Portfolio — UI/UX Design System Specification

This document defines the visual identity, typography, color scheme, design tokens, layouts, and micro-animations for Daniel's personal portfolio. All AI agents designing or modifying UI elements must strictly adhere to these specifications to guarantee consistency and a premium, modern aesthetic.

---

## 1. Visual Identity & Design Principles

*   **Modern Minimalist with Depth:** Sleek, clean interfaces with ample breathing room, high text contrast, and no unnecessary borders. We embrace layered depth through subtle glows and precise shadows rather than heavy borders.
*   **Dark Mode Native:** Dark mode is the primary visual showcase of the portfolio. The application defaults to dark mode. Light mode is supported but designed as a secondary, "sober and subtle" experience.
*   **Glow & Radial Accents:** Subtle glowing radial gradients (using color mixing and blur effects) to draw attention to interactive focal points, giving the UI a tactile, premium software feel.
*   **Dynamic but Professional Motion:** Micro-animations must feel organic, responsive, and tactile. Avoid exaggerated bounces or slow transitions. Use the established spring models and easing curves.
*   **Typography as UI:** Use font weights and tracking to establish hierarchy instead of relying solely on colors.

---

## 2. Typography System

The application relies on system-native or premium geometric sans-serif fonts to maintain a sleek software aesthetic.

*   **Font Family (`--font-sans`):** System Sans (`Inter`, `SF Pro Display`, or system defaults).
*   **Monospace (`--font-mono`):** `JetBrains Mono` or `Geist Mono` for code blocks, badges, and technical data.
*   **Hierarchy Rules:**
    *   **Headers:** Tight tracking (`tracking-tight`), bold weights (`font-semibold` to `font-bold`), and short line heights (`leading-none` or `leading-tight`).
    *   **Body:** Relaxed reading (`leading-relaxed`), medium contrast (`text-muted-foreground`), and normal weights.
    *   **Eyebrows / Labels:** Uppercase, wide tracking (`tracking-wider`), and small sizes (`text-xs`).

---

## 3. Core Color Scheme (OKLCH System)

The styling uses **Tailwind CSS v4** with variables defined in OKLCH space inside `src/styles/globals.css`. Colors use `oklch` to ensure perceptual uniformity across dark and light modes.

### Accent & Primary Hue
*   **Primary Accent:** `oklch(0.514 0.222 16.935)`
    *   *Visual equivalent:* A vivid Crimson/Deep Rose red.
    *   *Usage:* Interactive badges, active buttons, highlighted text, focus rings, hover indicators.

### Dark Mode Tokens (Default System State)
*   **Background:** `oklch(0.145 0 0)` (Pitch black/very dark slate)
*   **Foreground:** `oklch(0.985 0 0)` (Crisp off-white)
*   **Card / Popover:** `oklch(0.205 0 0)` (Elevated dark gray)
*   **Muted Foreground:** `oklch(0.708 0 0)` (Subtle text gray for secondary information)
*   **Borders:** `oklch(1 0 0 / 10%)` (Delicate semi-transparent divider to blend with backgrounds)
*   **Input fields:** `oklch(1 0 0 / 15%)`
*   **Ring:** `oklch(0.556 0 0)`

### Background Gradient Animation (Sober & Subtle Glows)
These RGB values are used for fluid animators like `BackgroundGradientAnimation`:
*   **Light Mode:** Neutral, elegant tones (Slate, Violet, Amber, Emerald washes).
*   **Dark Mode:** Deep, moody tones:
    *   `--bg-gradient-start`: `oklch(0.125 0 0)`
    *   `--bg-gradient-color-1`: `120, 20, 40` (Sober burgundy/crimson)
    *   `--bg-gradient-color-2`: `24, 24, 35` (Deep slate)
    *   `--bg-gradient-color-3`: `30, 20, 45` (Midnight violet)

---

## 4. Micro-Animations System

All transitions use specialized curves configured in `src/lib/animations.ts` to avoid robotic linear movements.

### Deceleration Curve
*   **`EASE_PREMIUM`:** `[0.16, 1, 0.3, 1]`
    *   *Feel:* Snappy start with a long, elegant deceleration tail. Used for layout transitions and section fades.

### Spring Models (Tactile Feedback)
*   **`SPRING_INTERACTIVE`:** `stiffness: 300, damping: 20` (Hover effects, high response, zero oscillation).
*   **`SPRING_TAP`:** `stiffness: 500, damping: 26` (Press/click states. Ultra-fast, physical).
*   **`SPRING_SOFT`:** `stiffness: 280, damping: 22` (Intro animations, cards popping into view).
*   **`SPRING_BOUNCY`:** `stiffness: 400, damping: 10` (Playful components, use sparingly).

### Animation Orchestration
*   **Page Intro:** Staggered cadence. Child components wait `0.1s` and enter sequentially at `0.22s` intervals (`pageVariants`).
*   **Section Entry:** Elements rise smoothly (`y: 32` to `y: 0`) and fade in (`opacity: 0` to `opacity: 1`) over `1.1` seconds using `EASE_PREMIUM`.

---

## 5. Key Layout & Architecture

The application implements a split-viewport shell managed in `src/components/layout/panel-layout.tsx`.

*   **Desktop Split:** The screen is divided into two columns:
    *   **Left (40% width):** Profile Panel (bio, technologies, experience). Fixed or independently scrollable.
    *   **Right (60% width):** AI Chat Assistant Panel. The primary interactive surface.
*   **Mobile Parallax:** On mobile displays:
    *   The view becomes a stacked slide-over layout.
    *   Chat slides in from the right (`z-index: 20`).
    *   Profile scales down slightly to `0.96`, blurs (`2px`), and fades to `0.4` opacity as it recedes into the background (`z-index: 10`).
    *   Drawer sliding transition: `duration: 0.5`, ease: `[0.32, 0.72, 0, 1]`.

---

## 6. UI Components & Visual Accents

Use existing high-fidelity component primitives inside `src/components/ui/` instead of reinventing them.

### Background Grids & Gradients
*   **Grid Overlay:** A delicate visual mesh that sits on background containers:
    ```tsx
    <div className="absolute inset-0 z-0 h-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-50 dark:opacity-40" />
    ```
*   **Radial Glow Orbs:** Placed behind main elements to create visual depth, utilizing `color-mix` for seamless blending:
    ```tsx
    <div
      className="absolute -inset-3 -z-10 rounded-full blur-2xl"
      style={{
        background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 35%, transparent) 0%, transparent 70%)",
      }}
    />
    ```

### Custom Interactivity
*   **Underlined Titles:** Titles must use `UnderlinedTitle` for a custom accented underline accent.
*   **Swiper Carousel Pagination:** Bullet indicators morph from an inactive small dot (`8px` size, `0.3` opacity) into a wide capsule (`24px` width, `1.0` opacity) when active, using `var(--primary)`.
*   **Card Hover Scaling:** Wrap elements in card containers with premium transitions:
    ```tsx
    <div className="group relative rounded-xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    ```

---

## 7. Non-Negotiable Styling Checklist

1.  **Strict Dimension Utilities:** Always use `size-{n}` (e.g., `size-4`, `size-8`) from Tailwind v4. Do NOT write `h-4 w-4` or `h-8 w-8`.
2.  **Zero Hardcoded Colors:** Never write `bg-blue-500` or `text-gray-600`. Use semantic tailwind classes (`bg-background`, `text-primary`, `text-muted-foreground`, `border`) which map to custom CSS HSL/OKLCH tokens.
3.  **No `dark:` Overrides:** Let theme variables handle light/dark states naturally through OKLCH values in `globals.css`. Avoid cluttering classes with `dark:text-white` or similar, except for very specific opacity tweaks.
4.  **Flexbox gap instead of margins:** Use `flex flex-col gap-4` for lists and layout spacing. Do NOT use `space-y-4` or `mb-4`.
5.  **Mobile-First Design:** Base classes must target mobile first. Use `md:` or `lg:` modifiers to scale typography or layout for larger displays.
6.  **Shorthand Truncation:** Use the `truncate` utility instead of combining `overflow-hidden text-ellipsis whitespace-nowrap`.
7.  **Glassmorphism (When needed):** Use `bg-background/80 backdrop-blur-md border border-border/50` for sticky headers or floating panels to maintain depth without obscuring content.