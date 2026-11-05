# Design Specification> **Source:** `E:\Trabajos\scan\opendesign\referencias\login-referencia-v2-2026-10-30.png`> **Model:** qwen3.7-plus> **Image size:** 1440×1024px> **Extracted colors:** 12 dominant colors> **OCR:** disabled---## 1. Visual Theme & Atmosphere
- **Aesthetic Style:** Warm Minimalist / Neo-Swiss. It combines the bold, condensed typography of Swiss design with a warm, retro-modern color palette (cream and deep plum).
- **Mood/Atmosphere:** The design feels professional yet inviting. The split background creates a duality between a "day mode" (welcoming, clean) and a "night mode" (focused, data-driven) atmosphere. The glowing orb adds a subtle touch of modern tech/AI aesthetic.
- **Visual Identity Markers:** The distinct "AURA" logo with the small coral square, the extreme contrast between the condensed display font and the clean sans-serif body text, and the specific coral/plum color pairing.

## 2. Color Palette & Roles

| Role | Hex | Usage |
| :--- | :--- | :--- |
| **Background (Light)** | `#FFF9F2` | Left side background (Cream/Off-white) |
| **Background (Dark)** | `#2B1D3A` | Right side background (Deep Plum) |
| **Surface** | `#FFFFFF` | Card backgrounds |
| **Primary / Accent** | `#FF6B51` | Main buttons (Sign In, Submit), active rating (5), toggle on state, logo dot |
| **Text Primary (Dark)** | `#1A1025` | Main headings, primary text on light bg |
| **Text Primary (Light)** | `#FFFFFF` | Text on dark buttons, dark bg elements |
| **Text Secondary** | `#6B7280` | "Forgot password?", footer text |
| **Border / Divider** | `#E5E7EB` | Input borders, dividers |
| **Warning / Badge** | `#D4A017` | "NEW" badge background |
| **Active State (Dark)** | `#1F1129` | "LIST" button background, "AURA INSIGHTS" icon |

- **Color Temperature:** Warm (Cream background) mixed with Cool/Deep (Plum background). The accent is warm (Coral).
- **Saturation:** Low saturation for backgrounds, high saturation for the primary accent (Coral).
- **60/30/10 Rule:**
    - **60%:** Backgrounds (Split between Cream `#FFF9F2` and Deep Plum `#2B1D3A`).
    - **30%:** Surface (White Cards `#FFFFFF`).
    - **10%:** Primary Accent (Coral `#FF6B51`) and Dark Text.

## 3. Typography Rules
- **Heading Font:** *Bebas Neue* or *Oswald* (Condensed Sans-Serif). Used for "WELCOME BACK".
    - Style: Bold/Black, Uppercase.
    - Letter-spacing: Tight (approx -1px to -2px).
- **Body/Label Font:** *Inter* or *DM Sans* (Geometric Sans-Serif). Used for "AURA", form labels, buttons.
    - Style: Medium/Semibold for labels, Regular for body.
    - Letter-spacing: Slight tracking for "AURA" and "AURA INSIGHTS" (approx 0.5px).
- **Type Scale:**
    - **H1 (Welcome Back):** ~64px (very large, dominant).
    - **H2 (Card Titles):** ~18px (Semibold).
    - **Body/Labels:** ~14-16px.
    - **Button Text:** ~14px (Semibold/Bold).
    - **Caption/Footer:** ~12px.
- **Line-height:** Headings ~1.0 (tight), Body ~1.5.

## 4. Component Stylings
- **Buttons:**
    - **Primary (Sign In):** Pill shape (fully rounded corners, ~50px radius), Coral background, Dark text, large padding (16px 32px).
    - **Primary (Submit):** Rounded rectangle (approx 6px radius), Coral background, White text.
    - **Secondary (Guest/SSO/Grid):** White background, thin border (`#1A1025` or grey), rounded corners (4-6px).
    - **Active/Toggle (List):** Dark background (`#1F1129`), White text.
- **Cards:** White background, rounded corners (~12-16px), subtle drop shadow (`box-shadow: 0 10px 30px rgba(0,0,0,0.05)`).
- **Rating Scale (1-5):** Square buttons with rounded corners (6px). Default is white with border. Active (5) is Coral with white text.
- **Toggle Switch:** Standard pill shape. White track with grey border when off (implied), Coral track when on. White thumb.
- **Badges:** "NEW" badge is a small rounded rectangle (4px radius), Mustard/Gold background, White text, small padding (4px 8px).

## 5. Layout Principles
- **Grid System:** The overall layout is a 50/50 split screen. Inside the cards, it's a single-column layout with centered alignment (Left card) or left-aligned content (Right card).
- **Container Width:** Cards are fixed width (approx 380-420px), centered within their respective background halves.
- **Alignment:**
    - Left Card: Center-aligned text and buttons.
    - Right Card: Left-aligned text, full-width buttons at the bottom.
- **Spacing:** Generous padding inside cards (approx 32-40px). Vertical rhythm is consistent (approx 24px between form groups).
- **Hierarchy:** "WELCOME BACK" is the strongest visual element due to size and contrast. The Coral buttons draw the eye next as Call-to-Actions.

## 6. Depth & Elevation
- **Shadows:**
    - Cards have a soft, diffuse shadow to lift them off the background. `box-shadow: 0 20px 40px -10px rgba(46, 30, 58, 0.1)`.
- **Glow:** There is a distinct radial gradient/glow effect in the top-left of the dark section (Coral/Red fading to transparent), adding depth and a "light source" feel.
- **Borders:** Thin, crisp borders (1px) used on secondary buttons and input fields. Color is light grey or dark purple depending on context.

## 7. Do's and Don'ts
- **DO** use the condensed font *only* for major display headings (like "WELCOME BACK") to create impact.
- **DO** use the Coral color (`#FF6B51`) exclusively for primary actions and active states to guide the user.
- **DO** maintain the split-background aesthetic if showing two states (e.g., Login vs. Dashboard).
- **DON'T** use pure black (`#000000`); use the deep plum (`#1A1025` or `#2B1D3A`) for a softer, richer contrast.
- **DON'T** mix border radii randomly; stick to either fully rounded (pill) for main CTAs or slightly rounded (4-6px) for secondary elements.

## 8. Responsive Behavior
- **Breakpoints:** The split screen likely collapses at a tablet breakpoint (~768px).
- **Adaptation:**
    - On mobile, the "Welcome Back" card would likely take up the full screen or be centered on a solid background.
    - The "Aura Insights" card would stack vertically.
    - The rating buttons (1-5) might shrink or stack if width is constrained, though they fit well in a row.

## 9. Agent Prompt Guide
Create a split-screen UI design featuring two distinct cards. The left side has a cream background (`#FFF9F2`) with a centered white card containing a massive, condensed sans-serif heading "WELCOME BACK" in deep plum, followed by a large coral pill-shaped "SIGN IN" button. The right side has a deep plum background (`#2B1D3A`) with a subtle coral glow in the top left, featuring a white card titled "AURA INSIGHTS". This card contains a 1-5 rating scale (with 5 highlighted in coral), a layout toggle (Grid/List), and a submit button. Use a clean geometric sans-serif for body text and high-contrast borders.
## ⚠️ Anti-Slop Check

**Score: 60/100 (Grade B)**

- 🔴 **gradient_purple_cyan**: Gradient purple→cyan (most common AI startup tell)
  - Matched: `purple`
- 🟡 **default_fonts**: Default Inter/Poppins without intentional pairing
  - Matched: `Inter`
- 🟡 **card_left_border**: Colored 3-4px left border card pattern (reliable AI tell)
  - Matched: `4px`