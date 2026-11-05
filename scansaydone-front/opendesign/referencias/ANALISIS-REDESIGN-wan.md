# Design Specification> **Source:** `E:\\Trabajos\\scan\\opendesign\\featuresMD\\redesign.png`> **Model:** qwen3.7-plus> **Image size:** 936×1680px> **Extracted colors:** 12 dominant colors> **OCR:** disabled---## 1. Visual Theme & Atmosphere
- **Aesthetic Style:** Modern SaaS / Friendly Professional. It blends a "Dark Mode" hero section with a clean, light-mode body, utilizing a "Condensed Typography" style for headings to create impact.
- **Mood/Atmosphere:** The design feels efficient, trustworthy, and action-oriented. The dark hero creates a premium, focused entry point, while the warm cream and white sections below make the content feel accessible and easy to digest. It balances technical utility (QR codes, dashboards) with human-centric language.
- **Unique Visual Identity Markers:** The use of a highly condensed, bold sans-serif font for all major headings creates a distinct "poster-like" feel. The recurring motif of QR codes and the specific coral/orange accent color against deep purple establish a strong brand identity.

## 2. Color Palette & Roles

| Role | Hex | Usage |
| :--- | :--- | :--- |
| **Background (Light)** | `#ffffff` | Main content background, card backgrounds. |
| **Background (Warm)** | `#fef8f1` | Alternating section backgrounds (e.g., "Así Funciona", "Tus Cuatro Canales") to break up white space. |
| **Background (Dark)** | `#2f1e36` | Hero section, Footer, CTA banner at bottom. Provides high contrast. |
| **Primary / Accent** | `#ff5733` (Est.) | Primary buttons ("CREAR MI ENCUESTA"), icons, highlights, checkmarks. *Note: Not in pre-extracted list due to small area, but visually dominant.* |
| **Text Primary** | `#2f1e36` | Headings, main body text on light backgrounds. Matches the dark background color. |
| **Text Secondary** | `#937470` | Subtitles, descriptive text, muted labels. |
| **Border / Divider** | `#e0dfe0` | Card borders, input fields, dividers. |
| **Success** | `#2ecc71` (Est.) | Checkmarks, positive chart lines, WhatsApp icon. |
| **Surface** | `#fcf1ea` | Hover states or subtle card backgrounds. |

- **Color Temperature:** Warm neutral. The dark purple (`#2f1e36`) is warmer than a pure black, and the off-whites (`#fef8f1`) have a peach/cream undertone.
- **Saturation:** Low saturation for backgrounds and text; High saturation for the accent orange/red to draw attention.
- **60/30/10 Rule:**
    - **60%:** White and Warm Cream backgrounds (`#ffffff`, `#fef8f1`).
    - **30%:** Dark Purple (`#2f1e36`) for text and the Hero/Footer blocks.
    - **10%:** Coral/Orange (`#ff5733`) for buttons and key icons.

## 3. Typography Rules
- **Heading Font Family:** A condensed sans-serif, likely **Oswald** (Bold/Black) or **Bebas Neue**. It is tall, narrow, and impactful.
    - **Styles:** Uppercase for main headings, heavy weight (700-900).
- **Body Font Family:** A clean geometric sans-serif, likely **Inter**, **DM Sans**, or **Roboto**.
    - **Styles:** Regular (400) for body, Medium (500) for labels/subtitles.
- **Type Scale (Estimated):**
    - **H1 (Hero):** ~64px (Very large, tight tracking).
    - **H2 (Section Headers):** ~40-48px.
    - **H3 (Card Titles):** ~20-24px.
    - **Body:** ~16px.
    - **Caption/Small:** ~12-14px.
- **Line-Height Ratios:**
    - Headings: Tight, ~1.1 - 1.2 (to keep the block compact).
    - Body: Relaxed, ~1.5 - 1.6 (for readability).
- **Letter-Spacing:** Headings have slight negative tracking or normal tracking to fit the condensed width. Small labels (e.g., "SIMPLE Y RÁPIDO") have wide letter-spacing (uppercase tracking).

## 4. Component Stylings
- **Buttons:**
    - **Primary:** Solid Coral/Orange background, white text, rounded corners (approx 6-8px), padding ~12px 24px. Font weight bold. Includes an arrow icon.
    - **Secondary (Ghost):** Transparent background, white border (in dark sections) or dark border (in light sections), dark/white text.
    - **Small/Tag:** Pill-shaped, small padding.
- **Cards:**
    - **Background:** White (`#ffffff`).
    - **Border:** Very subtle light grey border or just a soft shadow.
    - **Border-Radius:** ~12px.
    - **Shadow:** Soft, diffuse drop shadow (`box-shadow: 0 4px 20px rgba(0,0,0,0.05)`).
    - **Padding:** Generous internal padding (~24-32px).
- **Forms/Inputs:**
    - **Style:** Simple rectangular inputs with light grey borders.
    - **Focus:** Likely highlights with the primary color.
- **Navigation:**
    - **Layout:** Horizontal top bar. Logo left, links center, CTA right.
    - **Active State:** Not clearly visible, likely a bold weight or underline.
- **Icons:**
    - **Style:** Mix of filled and outlined.
    - **Containers:** Icons are often placed inside rounded squares (squircles) with a light background (e.g., light orange for the lightning bolt, light green for WhatsApp).
- **Badges/Tags:**
    - **Shape:** Pill/Rounded rectangle.
    - **Colors:** Yellow badge "3 preguntas" in the hero image.

## 5. Layout Principles
- **Grid System:** Standard 12-column grid.
- **Container Width:** Max-width centered, likely around 1140px or 1200px.
- **Content Alignment:**
    - Hero: Left-aligned text, right-aligned imagery.
    - Features (3 steps): Horizontal row, evenly spaced.
    - Channels (4 cards): 4-column grid.
    - Dashboard: Split layout (Text left, Image right).
- **Section Spacing:** Large vertical rhythm. Sections are separated by significant whitespace (padding-top/bottom ~80-100px).
- **Information Hierarchy:**
    1.  **Hero Headline:** "¿QUÉ DICEN TUS CLIENTES?" (Largest, highest contrast).
    2.  **Primary CTA:** "CREAR MI ENCUESTA" (Bright orange).
    3.  **Section Headers:** Condensed bold text.
    4.  **Card Content:** Icons and titles.

## 6. Depth & Elevation
- **Shadow System:**
    - **Level 1 (Cards):** Soft, low-opacity shadow to lift cards off the cream background.
    - **Level 2 (Hero Image/Phone):** Stronger shadow to separate the mockup from the dark background.
    - **Level 3 (Dropdowns/Modals):** Not explicitly shown but implied standard elevation.
- **Layering:** The hero section uses a background image with a dark overlay (gradient or solid color with opacity) to ensure text readability.
- **Border Usage:** Thin (1px) borders used for the "VER EJEMPLO" button and input fields. Cards rely more on shadow than borders.

## 7. Do's and Don'ts
- **DO:** Use the condensed font for all major headings to maintain the "poster" aesthetic.
- **DO:** Alternate background colors (White -> Cream -> White) to visually separate sections without heavy dividers.
- **DO:** Keep the primary CTA color (Coral/Orange) consistent and high-contrast against both dark and light backgrounds.
- **DON'T:** Use a standard wide sans-serif (like Arial) for headings; it will break the brand identity.
- **DON'T:** Clutter the cards with too much text; keep descriptions to 2-3 lines max.
- **DON'T:** Use pure black (`#000000`); use the deep purple (`#2f1e36`) for a softer, more branded dark tone.

## 8. Responsive Behavior
- **Breakpoints:**
    - **Desktop (>1024px):** Full grid (4 columns for channels, 3 for steps).
    - **Tablet (768px - 1024px):** Grid likely collapses to 2 columns. Hero text might center or stack.
    - **Mobile (<768px):** Single column layout.
- **Adaptation:**
    - **Hero:** The phone mockup and QR stand likely stack below the text.
    - **Navigation:** Hamburger menu likely replaces horizontal links.
    - **Cards:** "Tus Cuatro Canales" becomes a vertical stack or a 2x2 grid.
    - **Typography:** H1 size reduces significantly (e.g., from 64px to 36px).

## 9. Agent Prompt Guide
Create a landing page for a SaaS product called "Scan-Say-Done" focused on QR code feedback. Use a "Modern SaaS" aesthetic with a deep purple (`#2f1e36`) hero section and warm cream (`#fef8f1`) alternating content sections. Typography must use a heavy, condensed sans-serif (like Oswald) for uppercase headings and a clean geometric sans-serif (like Inter) for body text. The primary accent color is a vibrant coral-orange (`#ff5733`) used for buttons and icons. Layout should feature a 12-column grid with generous whitespace, rounded cards with soft shadows, and a split-screen hero showing a mobile app mockup and a QR code stand.
## ⚠️ Anti-Slop Check

**Score: 60/100 (Grade B)**

- 🔴 **gradient_purple_cyan**: Gradient purple→cyan (most common AI startup tell)
  - Matched: `purple`
- 🟡 **default_fonts**: Default Inter/Poppins without intentional pairing
  - Matched: `Inter`
- 🟡 **card_left_border**: Colored 3-4px left border card pattern (reliable AI tell)
  - Matched: `4px`