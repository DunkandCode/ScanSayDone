# Design Specification> **Source:** `C:\\Users\\k_spi\\Downloads\\logosPng\\referencias.png`> **Model:** qwen3.7-plus> **Image size:** 1536×1024px> **Extracted colors:** 12 dominant colors> **OCR:** disabled---## 1. Visual Theme & Atmosphere
- **Aesthetic Style:** Corporate Identity / Brand Style Guide with a Functional Minimalist approach. It blends technical precision (grid lines, construction) with approachable branding.
- **Mood/Atmosphere:** The design conveys efficiency, clarity, and modernity. The "Scan-Say-Done" name implies a frictionless process, supported by the clean layout and bold, high-contrast typography. It feels professional yet friendly due to the rounded iconography and warm accent color.
- **Unique Visual Identity Markers:** The custom logomark combining a QR code scanner frame with a speech bubble. The distinct two-tone logo lockup (Dark Navy and Coral). The use of "Bebas Neue" for a tall, impactful brand name.

## 2. Color Palette & Roles
- **Color Temperature:** Warm accent (Coral) balanced against a cool/neutral dark (Navy/Black).
- **Saturation:** High saturation for the brand accent (Coral) to draw attention; low saturation/neutral for backgrounds and text.
- **60/30/10 Rule:** 60% White/Light Backgrounds, 30% Dark Navy/Black (Text and Logo parts), 10% Coral (Accent, Logo parts, Buttons).

| Role | Hex | Usage |
| :--- | :--- | :--- |
| **Primary Accent** | #FF6B55 | Logo icon, "SAY" text, primary buttons, QR corners, active states. |
| **Text Primary / Brand Dark** | #111827 | "SCAN" and "DONE" text, main headings, high-contrast icon version. |
| **Background** | #FFFFFF | Main canvas, card backgrounds, app screen background. |
| **Text Secondary** | #4B5563 | Subtitles, descriptions, "ESCANEA. OPINA. LISTO." |
| **Border / Divider** | #E5E7EB | Section dividers in the style guide layout. |
| **Success (App UI)** | #10B981 | Positive rating face (4th face), "Good" state. |
| **Warning (App UI)** | #F59E0B | Neutral/Mixed rating face (2nd face). |
| **Error (App UI)** | #EF4444 | Negative rating face (1st face). |
| **Surface (Mockup)** | #F3F4F6 | Table surface, window frame context. |

## 3. Typography Rules
- **Heading Font Family:** **Bebas Neue** (or similar tall condensed sans-serif like Oswald). Used for the main logo lockup.
    - Styles: Regular (used at large sizes for impact).
- **Body Font Family:** **Montserrat**. Used for taglines, UI text, and descriptions.
    - Styles: Regular (400), Medium (500), Bold (700).
- **Type Scale:**
    - **H1 (Logo):** ~64px (condensed, uppercase).
    - **H2 (Section Headers):** ~12px (uppercase, wide tracking, e.g., "VARIACIONES").
    - **H3 (Subheads):** ~16px (Bold, e.g., "BEBAS NEUE").
    - **Body:** ~14px (Regular, e.g., "Mejores experiencias...").
    - **Caption/Small:** ~10px (e.g., "Uso principal").
- **Line-height:** Headings ~1.1, Body ~1.5.
- **Letter-spacing:** Section headers have wide tracking (approx 1px-2px). Logo text is tight.

## 4. Component Stylings
- **Buttons:**
    - **Primary:** Background #FF6B55, Text White (#FFFFFF). Padding ~12px 24px. Border-radius ~8px (pill-like but slightly rectangular). Font: Montserrat Medium.
- **Cards (Table Tent):**
    - Background: White (#FFFFFF).
    - Shadow: Soft drop shadow (blur ~20px, opacity ~10%) to lift off the wooden table.
    - Border-radius: ~4px (sharp corners for print material).
- **Forms/Inputs (App):**
    - Border: 1px solid #E5E7EB.
    - Border-radius: ~8px.
    - Background: White.
    - Placeholder text: Gray (#9CA3AF).
- **Icons (Logomark):**
    - Style: Geometric, thick strokes.
    - Composition: A speech bubble centered inside four rounded corner brackets (resembling a QR scanner).
    - Color: Monochromatic (Coral or Dark Navy) or Duotone.
- **Rating Faces (App):**
    - Circular icons. Colors range from Red (Angry) to Green (Happy).

## 5. Layout Principles
- **Grid System:** The top half uses a rigid column grid (likely 4 or 12 columns) to separate specifications (Variations, Construction, Typography). The bottom half uses a 3-column grid for mockups.
- **Container Width:** Full-width layout for the style guide presentation.
- **Content Alignment:**
    - Top section: Left-aligned text blocks, centered logos within their grid cells.
    - Bottom section: Centered content within the mockup scenes.
- **Information Hierarchy:** The main logo lockup (top left) is the largest element, drawing the eye first. Then the eye moves right to variations, then down to the technical specs, and finally to the real-world applications (mockups).
- **Section Spacing:** Generous whitespace between grid sections. Thin gray lines act as dividers.

## 6. Depth & Elevation
- **Shadow System:**
    - **Level 1 (Subtle):** Used for the table tent card and phone mockup to separate them from the background photos. Blur radius ~15-20px, Y-offset ~10px.
    - **Level 2 (Flat):** The style guide top half is flat (0 elevation), relying on borders for separation.
- **Layering:** The phone screen is layered over a blurred background photo (bokeh effect) to simulate depth of field.
- **Border Usage:** 1px solid #E5E7EB lines separate the technical specification sections in the top half.

## 7. Do's and Don'ts
- **DO:** Maintain the specific aspect ratio of the logomark (speech bubble centered in scanner brackets).
- **DO:** Use Bebas Neue for the brand name "SCAN-SAY-DONE" to maintain the tall, condensed look.
- **DO:** Ensure high contrast between the Coral accent and the Dark Navy text.
- **DON'T:** Stretch or distort the logomark; use the construction grid guidelines.
- **DON'T:** Use the Coral color for body text (low readability); reserve it for accents and buttons.
- **DON'T:** Place the logo on busy backgrounds without a white container or sufficient contrast (as seen in the window decal application, white text is used on dark glass).

## 8. Responsive Behavior
- **Breakpoints:** The style guide layout suggests a desktop-first presentation (wide horizontal layout).
- **Mobile Adaptation:**
    - The "App / Pantalla de Encuesta" mockup explicitly shows the mobile UI.
    - The QR code application is inherently mobile-first (scan with phone).
    - In a responsive web version of this brand, the horizontal logo would stack to the vertical logo (shown in "Variaciones -> Vertical").
- **Component Adaptation:** The "Enviar" button spans full width or large width on mobile. The rating faces are arranged horizontally in a row.

## 9. Agent Prompt Guide
Create a brand style guide layout for a feedback service called "SCAN-SAY-DONE". Use a clean white background with a grid layout. The primary colors are a vibrant Coral (#FF6B55) and a deep Navy Black (#111827). The typography must use "Bebas Neue" for the main logo text (tall, condensed) and "Montserrat" for all body copy and UI elements. Include sections for logo variations (horizontal, vertical, icon), typography specs, and a "one ink" usage guide. Below the specs, generate three photorealistic mockups: a table tent card with a QR code on a wooden table, a hand holding a smartphone showing a survey app with 5 emoji faces and a coral "Enviar" button, and a storefront window decal at night. Ensure the logomark combines a speech bubble with QR scanner brackets.
## ⚠️ Anti-Slop Check

**Score: 80/100 (Grade A)**

- 🟡 **three_feature_cards**: Generic '3 feature cards' layout pattern
  - Matched: `3-column`
- 🟡 **card_left_border**: Colored 3-4px left border card pattern (reliable AI tell)
  - Matched: `4px`