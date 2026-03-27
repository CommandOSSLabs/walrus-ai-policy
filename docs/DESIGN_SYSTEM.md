# Walrus Archive — Design System

**Version:** 1.0.0
**Date:** 2026-03-16
**Audience:** Designers (Figma), Frontend engineers

---

## 1. Design Philosophy

### 1.1 Three Governing Principles

**Permanent Record**
Every design decision reinforces that this is a trustworthy, immutable archive — not a social platform or a transient feed. Prefer established structural patterns over novel ones. Avoid decorative elements that cannot be justified by function.

**Trust Through Transparency**
Blockchain identifiers (Sui Object IDs, blob IDs, epoch numbers, transaction digests) are surfaced as first-class citizens — not hidden behind "View Details" links. Independent verification is always one action away, and that path is always legible.

**Zero Barrier to Read**
Anyone can browse, search, and download. Wallet-required actions (submission, editing, funding) are clearly distinguished from public browsing. The wallet connection state never blocks read access or disables the discovery interface.

### 1.2 Personality

| Attribute | Expression |
|---|---|
| Scholarly | Generous whitespace, clear typographic hierarchy, document-like content layouts |
| Precise | Monospace identifiers, exact metadata display, structured tables for file data |
| Open | Neutral tone, no gatekeeping signals, clear "no account needed" messaging |
| Resilient | Visible on-chain proof, fallback paths always shown, epoch expiry is information not alarm |

---

## 2. Color System

Tokens follow a **three-tier hierarchy**: Primitive → Semantic → Component.
Never use primitive tokens directly in components. Always map through semantic tokens.

### 2.1 Primitive Palette

#### Neutral — Blue-gray tint for screen refinement

| Token | Hex | Lightness |
|---|---|---|
| `neutral-0` | `#FFFFFF` | White |
| `neutral-50` | `#F8F9FC` | Page background |
| `neutral-100` | `#F1F3FA` | Surface fill |
| `neutral-150` | `#E8EBF5` | Subtle divider |
| `neutral-200` | `#DDE1EE` | Input border |
| `neutral-300` | `#C4CAE0` | Strong border |
| `neutral-400` | `#9AA3BF` | Placeholder |
| `neutral-500` | `#6B789A` | Tertiary text |
| `neutral-600` | `#4A5578` | Secondary text |
| `neutral-700` | `#2F3B5E` | Body text |
| `neutral-800` | `#1A2540` | Primary text |
| `neutral-900` | `#0D1526` | Display text |

#### Cerulean — Primary brand, interactive elements

| Token | Hex | Role |
|---|---|---|
| `cerulean-50` | `#EEF5FF` | |
| `cerulean-100` | `#DBE9FF` | |
| `cerulean-200` | `#B8D4FF` | |
| `cerulean-300` | `#7AB4FF` | |
| `cerulean-400` | `#3A8FE8` | |
| `cerulean-500` | `#1469C8` | Primary brand |
| `cerulean-600` | `#1254A3` | Interactive default |
| `cerulean-700` | `#104080` | Interactive hover |
| `cerulean-800` | `#0E2D5E` | Interactive active |
| `cerulean-900` | `#091C3D` | Dark variant |

#### Teal — On-chain verification, certified state

| Token | Hex | Role |
|---|---|---|
| `teal-50` | `#F0FDF9` | |
| `teal-100` | `#CCFBEF` | |
| `teal-200` | `#99F5DF` | |
| `teal-300` | `#5CE8CA` | |
| `teal-400` | `#2DD4B3` | |
| `teal-500` | `#14B893` | Certified/verified |
| `teal-600` | `#0D9476` | |
| `teal-700` | `#0A7060` | |
| `teal-800` | `#085B4D` | |
| `teal-900` | `#063D33` | |

#### Amber — Storage epochs, archival warnings

| Token | Hex | Role |
|---|---|---|
| `amber-50` | `#FFFBEB` | |
| `amber-100` | `#FEF3C7` | |
| `amber-200` | `#FDE68A` | |
| `amber-300` | `#FCD34D` | |
| `amber-400` | `#FBBF24` | |
| `amber-500` | `#F59E0B` | Storage warning |
| `amber-600` | `#D97706` | |
| `amber-700` | `#B45309` | |
| `amber-800` | `#92400E` | |
| `amber-900` | `#78350F` | |

#### Red — Error, critical expiry, destructive

| Token | Hex | Role |
|---|---|---|
| `red-50` | `#FEF2F2` | |
| `red-100` | `#FEE2E2` | |
| `red-200` | `#FECACA` | |
| `red-300` | `#FCA5A5` | |
| `red-400` | `#F87171` | |
| `red-500` | `#EF4444` | Error |
| `red-600` | `#DC2626` | Destructive action |
| `red-700` | `#B91C1C` | Destructive hover |
| `red-800` | `#991B1B` | |
| `red-900` | `#7F1D1D` | |

#### Green — Success, upload complete, tx confirmed

| Token | Hex | Role |
|---|---|---|
| `green-50` | `#F0FDF4` | |
| `green-100` | `#DCFCE7` | |
| `green-200` | `#BBF7D0` | |
| `green-300` | `#86EFAC` | |
| `green-400` | `#4ADE80` | |
| `green-500` | `#22C55E` | Success |
| `green-600` | `#16A34A` | |
| `green-700` | `#15803D` | |
| `green-800` | `#166534` | |
| `green-900` | `#14532D` | |

---

### 2.2 Semantic Tokens

These are the tokens used in components. They resolve to different primitive values per color mode.

#### Background

| Semantic Token | Light | Dark |
|---|---|---|
| `bg/page` | `neutral-50` `#F8F9FC` | `neutral-900` `#0D1526` |
| `bg/surface` | `neutral-0` `#FFFFFF` | `neutral-800` `#1A2540` |
| `bg/surface-raised` | `neutral-0` `#FFFFFF` + shadow | `neutral-750` `#202E4A` + shadow |
| `bg/surface-sunken` | `neutral-100` `#F1F3FA` | `neutral-850` `#131E32` |
| `bg/overlay` | `neutral-900` @ 60% | `neutral-900` @ 75% |
| `bg/inverse` | `neutral-900` `#0D1526` | `neutral-0` `#FFFFFF` |

#### Text

| Semantic Token | Light | Dark |
|---|---|---|
| `text/primary` | `neutral-900` `#0D1526` | `neutral-50` `#F8F9FC` |
| `text/secondary` | `neutral-600` `#4A5578` | `neutral-400` `#9AA3BF` |
| `text/tertiary` | `neutral-500` `#6B789A` | `neutral-500` `#6B789A` |
| `text/disabled` | `neutral-400` `#9AA3BF` | `neutral-600` `#4A5578` |
| `text/inverse` | `neutral-0` `#FFFFFF` | `neutral-900` `#0D1526` |
| `text/brand` | `cerulean-600` `#1254A3` | `cerulean-400` `#3A8FE8` |
| `text/link` | `cerulean-600` `#1254A3` | `cerulean-300` `#7AB4FF` |
| `text/link-hover` | `cerulean-700` `#104080` | `cerulean-200` `#B8D4FF` |
| `text/on-solid` | `neutral-0` `#FFFFFF` | `neutral-0` `#FFFFFF` |

#### Border

| Semantic Token | Light | Dark |
|---|---|---|
| `border/subtle` | `neutral-150` `#E8EBF5` | `neutral-700` `#2F3B5E` |
| `border/default` | `neutral-200` `#DDE1EE` | `neutral-700` `#2F3B5E` |
| `border/strong` | `neutral-300` `#C4CAE0` | `neutral-600` `#4A5578` |
| `border/focus` | `cerulean-500` `#1469C8` | `cerulean-400` `#3A8FE8` |
| `border/error` | `red-500` `#EF4444` | `red-400` `#F87171` |
| `border/success` | `green-500` `#22C55E` | `green-400` `#4ADE80` |
| `border/warning` | `amber-500` `#F59E0B` | `amber-400` `#FBBF24` |
| `border/verified` | `teal-500` `#14B893` | `teal-400` `#2DD4B3` |

#### Interactive — Fill States

| Semantic Token | Light | Dark |
|---|---|---|
| `action/primary` | `cerulean-600` `#1254A3` | `cerulean-500` `#1469C8` |
| `action/primary-hover` | `cerulean-700` `#104080` | `cerulean-400` `#3A8FE8` |
| `action/primary-active` | `cerulean-800` `#0E2D5E` | `cerulean-300` `#7AB4FF` |
| `action/secondary` | `neutral-100` `#F1F3FA` | `neutral-700` `#2F3B5E` |
| `action/secondary-hover` | `neutral-150` `#E8EBF5` | `neutral-600` `#4A5578` |
| `action/destructive` | `red-600` `#DC2626` | `red-500` `#EF4444` |
| `action/destructive-hover` | `red-700` `#B91C1C` | `red-400` `#F87171` |
| `action/ghost-hover` | `cerulean-50` `#EEF5FF` | `cerulean-900` @ 40% |
| `action/disabled` | `neutral-150` `#E8EBF5` | `neutral-700` `#2F3B5E` |

#### Status Surfaces

| Semantic Token | Light | Dark |
|---|---|---|
| `status/success-surface` | `green-50` `#F0FDF4` | `green-900` @ 30% |
| `status/success-text` | `green-700` `#15803D` | `green-400` `#4ADE80` |
| `status/warning-surface` | `amber-50` `#FFFBEB` | `amber-900` @ 30% |
| `status/warning-text` | `amber-700` `#B45309` | `amber-400` `#FBBF24` |
| `status/error-surface` | `red-50` `#FEF2F2` | `red-900` @ 30% |
| `status/error-text` | `red-700` `#B91C1C` | `red-400` `#F87171` |
| `status/info-surface` | `cerulean-50` `#EEF5FF` | `cerulean-900` @ 30% |
| `status/info-text` | `cerulean-700` `#104080` | `cerulean-300` `#7AB4FF` |
| `status/verified-surface` | `teal-50` `#F0FDF9` | `teal-900` @ 30% |
| `status/verified-text` | `teal-700` `#0A7060` | `teal-400` `#2DD4B3` |
| `status/storage-warning` | `amber-500` `#F59E0B` | `amber-400` `#FBBF24` |
| `status/storage-critical` | `red-500` `#EF4444` | `red-400` `#F87171` |

---

### 2.3 Topic Taxonomy Color Mapping

Each policy topic gets a deterministic color. Used in badges and filter pills.

| Topic | Background | Text | Border |
|---|---|---|---|
| `ai_safety` | `#EEF5FF` | `#1254A3` | `#B8D4FF` |
| `ai_governance_frameworks` | `#F3F0FF` | `#5B21B6` | `#C4B5FD` |
| `labor_markets` | `#F0FDF9` | `#0A7060` | `#99F5DF` |
| `economic_policy` | `#FFFBEB` | `#B45309` | `#FDE68A` |
| `regulatory_proposals` | `#FEF2F2` | `#B91C1C` | `#FECACA` |
| `international_coordination` | `#F0F9FF` | `#0C4A6E` | `#BAE6FD` |
| `technical_standards` | `#F8F9FC` | `#2F3B5E` | `#C4CAE0` |
| `civil_society` | `#F0FDF4` | `#15803D` | `#BBF7D0` |
| `national_strategies` | `#FFF7ED` | `#9A3412` | `#FED7AA` |
| `risk_assessment` | `#FDF4FF` | `#7E22CE` | `#E9D5FF` |

---

## 3. Typography

### 3.1 Font Stack

```
--font-sans:  'Inter', 'Inter Variable', system-ui, -apple-system, sans-serif;
--font-mono:  'JetBrains Mono', 'JetBrains Mono Variable', 'Fira Code', monospace;
```

**Inter** — Used for all UI text, headings, labels, body copy.
Variable font weight range: 100–900.

**JetBrains Mono** — Used exclusively for blockchain identifiers, file paths, code, and numeric data where alignment matters (Sui Object IDs, blob IDs, addresses, epoch numbers, MIME types).

---

### 3.2 Type Scale

All values are in `px`. Line height is absolute, not ratio.

#### Display — For hero sections, empty state headings

| Token | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `display/2xl` | 72px | 800 | 80px | -0.05em |
| `display/xl` | 60px | 800 | 68px | -0.04em |
| `display/lg` | 48px | 700 | 56px | -0.04em |

#### Heading — Page and section headings

| Token | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `heading/xl` | 36px | 700 | 44px | -0.03em |
| `heading/lg` | 30px | 700 | 38px | -0.02em |
| `heading/md` | 24px | 600 | 32px | -0.02em |
| `heading/sm` | 20px | 600 | 28px | -0.01em |
| `heading/xs` | 18px | 600 | 26px | -0.01em |

#### Body — Readable prose, descriptions, metadata

| Token | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `body/xl` | 20px | 400 | 32px | 0em |
| `body/lg` | 18px | 400 | 28px | 0em |
| `body/md` | 16px | 400 | 26px | 0em |
| `body/sm` | 14px | 400 | 22px | 0.005em |

#### Label — UI labels, tabs, navigation items

| Token | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `label/xl` | 16px | 500 | 24px | 0em |
| `label/lg` | 14px | 500 | 20px | 0.01em |
| `label/md` | 13px | 500 | 18px | 0.01em |
| `label/sm` | 12px | 500 | 16px | 0.02em |
| `label/xs` | 11px | 600 | 14px | 0.06em — ALL CAPS only |

#### Mono — Identifiers, addresses, paths, code

| Token | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `mono/lg` | 15px | 400 | 24px | 0em |
| `mono/md` | 13px | 400 | 20px | 0.01em |
| `mono/sm` | 11px | 400 | 16px | 0.02em |

---

### 3.3 Semantic Type Roles

| Role | Token | Usage |
|---|---|---|
| Page title | `heading/xl` | `<h1>` on Browse, Detail pages |
| Section header | `heading/md` | Card sections, form sections |
| Artifact title | `heading/sm` or `heading/xs` | Artifact card, detail header |
| Body copy | `body/md` | Descriptions, About page |
| Metadata label | `label/sm` | "Institution", "Published", "Topics" |
| Metadata value | `body/sm` | Values next to labels |
| Object ID | `mono/md` | Sui Object ID, transaction digest |
| Blob ID | `mono/sm` | Per-file blob identifiers |
| Wallet address | `mono/md` | Connected wallet display |
| File path | `mono/sm` | File names in submission/detail |
| Tab label | `label/lg` | Navigation tabs |
| Button text | `label/lg` (sm btn: `label/md`) | Button variants |
| Badge/Tag | `label/sm` | Topic tags, MIME types, license |
| Caption | `label/xs` ALL CAPS | Section labels, group headers |
| Empty state heading | `heading/sm` | No results, not connected |

---

## 4. Spacing System

Base unit: **4px**. All spacing values are multiples of 4.

| Token | Value | Tailwind equiv |
|---|---|---|
| `space/1` | 4px | `p-1` |
| `space/2` | 8px | `p-2` |
| `space/3` | 12px | `p-3` |
| `space/4` | 16px | `p-4` |
| `space/5` | 20px | `p-5` |
| `space/6` | 24px | `p-6` |
| `space/7` | 28px | `p-7` |
| `space/8` | 32px | `p-8` |
| `space/10` | 40px | `p-10` |
| `space/12` | 48px | `p-12` |
| `space/14` | 56px | `p-14` |
| `space/16` | 64px | `p-16` |
| `space/20` | 80px | `p-20` |
| `space/24` | 96px | `p-24` |
| `space/32` | 128px | `p-32` |
| `space/40` | 160px | `p-40` |

### Component Spacing Reference

| Context | Value |
|---|---|
| Button padding (sm) | 8px 12px |
| Button padding (md) | 10px 16px |
| Button padding (lg) | 12px 20px |
| Input padding (md) | 10px 14px |
| Card padding | 24px |
| Card padding (compact) | 16px |
| Section gap (page) | 48px |
| Section gap (card) | 16px |
| Form field gap | 20px |
| Inline element gap | 8px |
| Badge/tag internal padding | 3px 8px |

---

## 5. Grid & Layout

### 5.1 Breakpoints

| Name | Min width | Device |
|---|---|---|
| `xs` | 0px | Mobile portrait |
| `sm` | 480px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Wide desktop |

### 5.2 Page Layout

| Property | Mobile (xs-sm) | Tablet (md) | Desktop (lg+) |
|---|---|---|---|
| Max content width | 100% | 100% | 1280px |
| Page horizontal padding | 16px | 32px | 96px |
| Page top padding | 24px | 40px | 64px |
| Column count | 4 | 8 | 12 |
| Column gutter | 16px | 24px | 24px |

### 5.3 Content Zones

```
┌─────────────────────────────────────────────────┐
│  Navbar  (full width, h=64px)                   │
├─────────────────────────────────────────────────┤
│  Page Header  (hero/title area, optional)        │
├──────────────────┬──────────────────────────────┤
│  Filter Sidebar  │  Main Content Area           │
│  (240px fixed)   │  (fluid, 1fr)                │
│  lg+ only        │                              │
│  xs-md: drawer   │                              │
├──────────────────┴──────────────────────────────┤
│  Footer  (full width)                           │
└─────────────────────────────────────────────────┘
```

**Sidebar widths:**
- Filter sidebar: 240px (fixed on `lg+`, slide-over drawer on `xs-md`)
- Detail sidebar (right): 320px (for on-chain panel on wide viewports)

**Content max widths (by context):**
- Browse artifact grid: 960px
- Artifact detail: 840px
- Submission form: 640px
- About page prose: 680px

### 5.4 Artifact Card Grid

| Breakpoint | Columns |
|---|---|
| xs–sm | 1 column |
| md | 2 columns |
| lg | 2–3 columns (depends on sidebar open state) |
| xl | 3 columns |

---

## 6. Elevation & Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow/none` | `none` | Flat elements |
| `shadow/xs` | `0 1px 2px rgba(13,21,38,0.05)` | Subtle lift, badges |
| `shadow/sm` | `0 1px 3px rgba(13,21,38,0.10), 0 1px 2px rgba(13,21,38,0.06)` | Cards default |
| `shadow/md` | `0 4px 6px -1px rgba(13,21,38,0.10), 0 2px 4px -1px rgba(13,21,38,0.06)` | Dropdowns, popovers |
| `shadow/lg` | `0 10px 15px -3px rgba(13,21,38,0.10), 0 4px 6px -2px rgba(13,21,38,0.05)` | Modals |
| `shadow/xl` | `0 20px 25px -5px rgba(13,21,38,0.10), 0 10px 10px -5px rgba(13,21,38,0.04)` | Floating panels |
| `shadow/focus` | `0 0 0 3px rgba(20,105,200,0.25)` | Focused interactive elements |
| `shadow/focus-error` | `0 0 0 3px rgba(239,68,68,0.25)` | Focused input in error state |
| `shadow/card-hover` | `0 8px 16px -4px rgba(13,21,38,0.12), 0 4px 6px -2px rgba(13,21,38,0.06)` | Cards on hover |

---

## 7. Border & Radius

### 7.1 Border Width

| Token | Value | Usage |
|---|---|---|
| `border/thin` | 1px | All component borders |
| `border/medium` | 2px | Focus rings, active indicators |
| `border/thick` | 4px | Left-accent bars, emphasis |

### 7.2 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius/none` | 0px | Data tables, flush elements |
| `radius/xs` | 2px | Badges, inline tags |
| `radius/sm` | 4px | Inputs, small buttons |
| `radius/md` | 6px | Default — buttons, popovers |
| `radius/lg` | 8px | Cards, panels |
| `radius/xl` | 12px | Modals, large panels |
| `radius/2xl` | 16px | Hero cards, feature blocks |
| `radius/full` | 9999px | Pills, toggle switches, avatars |

---

## 8. Motion & Animation

### 8.1 Duration

| Token | Value | Usage |
|---|---|---|
| `duration/instant` | 0ms | State changes where no transition needed |
| `duration/fast` | 100ms | Hover states, small state changes |
| `duration/normal` | 200ms | Most transitions (default) |
| `duration/slow` | 300ms | Modals entering, panel slides |
| `duration/slower` | 500ms | Page transitions, skeleton shimmer |

### 8.2 Easing

| Token | Value | Usage |
|---|---|---|
| `ease/linear` | `linear` | Progress bars, spinners |
| `ease/in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting |
| `ease/out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| `ease/in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | State transitions (default) |
| `ease/spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Success confirmations, popover appears |

### 8.3 Motion Patterns

**Micro-interactions:**
- Button press: `scale(0.97)` at `duration/fast` `ease/in-out`
- Card hover: shadow change + `translateY(-2px)` at `duration/normal` `ease/out`
- Badge hover: no transform, color only

**Appear/enter (modal, dropdown, toast):**
- Opacity `0→1` + `translateY(4px)→0` at `duration/slow` `ease/out`

**Skeleton shimmer:**
- Background gradient sweep, `duration/slower` `ease/linear`, loop

**Upload progress:**
- Linear progress bar fill, `ease/linear` (no easing — must feel proportional to actual bytes)

**Transaction pending spinner:**
- Rotation, `1.2s` `ease/linear`, infinite loop

**Confirmation checkmark:**
- SVG stroke draw-on, `duration/slow` `ease/spring`

**Respect `prefers-reduced-motion`:** Replace all transitions with instant cuts. Keep functional state changes (progress bar) but remove all decorative motion.

---

## 9. Iconography

### 9.1 Library

**Phosphor Icons** — Primary icon set (available as React components `@phosphor-icons/react`).
Reasoning: large set, consistent visual weight, includes specialized icons for documents, databases, blockchain concepts, and file types.

### 9.2 Sizes

| Token | Size | Context |
|---|---|---|
| `icon/xs` | 12px | Inline within badges, tight labels |
| `icon/sm` | 16px | Alongside body text (default inline) |
| `icon/md` | 20px | Button icons, list items |
| `icon/lg` | 24px | Navigation icons, toolbar |
| `icon/xl` | 32px | Section headers, empty state sub-icons |
| `icon/2xl` | 48px | Empty state primary icons |
| `icon/3xl` | 64px | Hero/feature icons |

### 9.3 Icon Weights

Use **Regular** weight for most UI. **Bold** weight for empty states and feature illustrations. **Light** weight sparingly, only in large display contexts.

### 9.4 Key Icon Mapping

| Concept | Icon | Notes |
|---|---|---|
| Artifact / Paper | `Article` or `FileText` | Browse listings |
| Upload | `UploadSimple` | Submission flow |
| On-chain verified | `ShieldCheck` | Certified blob state |
| Storage / Epochs | `HourglassMedium` | Epoch countdown |
| Storage warning | `Warning` | ≤8 epochs |
| Storage critical | `WarningCircle` | ≤4 epochs |
| Download | `DownloadSimple` | File download |
| Copy to clipboard | `CopySimple` | IDs, addresses |
| Wallet | `Wallet` | Wallet connect |
| Transaction | `ArrowsLeftRight` | Tx digest |
| Blockchain / On-chain | `Link` | Sui Object link |
| Revision / Version | `GitBranch` | Artifact versions |
| Files | `Files` | File count |
| Contributors | `UsersThree` | Co-contributor count |
| Search | `MagnifyingGlass` | Search bar |
| Filter | `Funnel` | Filter sidebar toggle |
| Add file | `FilePlus` | Upload zone |
| Remove | `Trash` | Remove file, revoke |
| Settings / Edit | `PencilSimple` | Edit metadata |
| Link / External | `ArrowSquareOut` | Open in explorer |
| Close / Clear | `X` | Dismiss, clear |
| Check / Done | `CheckCircle` | Success confirmation |
| Error | `XCircle` | Error state |
| Info | `Info` | Info tooltip |
| Expand / Collapse | `CaretDown` / `CaretUp` | Accordions |
| Sort | `ArrowsDownUp` | Sort controls |
| More | `DotsThree` | Overflow menu |
| WAL / Token | `Coins` | Token balance, cost |
| PDF | `FilePdf` | MIME type indicator |
| CSV | `FileText` | MIME type |
| Code | `FileCode` | `.py`, `.r` scripts |
| Archive / ZIP | `FileZip` | Zip files |
| Image | `Image` | PNG, JPEG |
| About / Help | `Question` | About page, tooltips |

---

## 10. Components

### 10.1 Button

**Anatomy:** `[icon-left?] label [icon-right?] [spinner?]`

#### Variants

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| `primary` | `action/primary` | `text/on-solid` | none | Main CTA — Submit, Publish |
| `secondary` | `action/secondary` | `text/primary` | `border/default` | Secondary actions |
| `ghost` | transparent | `text/brand` | none | Tertiary, inline actions |
| `outline` | transparent | `text/brand` | `border/focus` (cerulean) | Mid-emphasis |
| `destructive` | `action/destructive` | `text/on-solid` | none | Remove, Revoke |
| `wallet` | `cerulean-900` | `cerulean-100` | none | Wallet connect — distinct from other primaries |

#### Sizes

| Size | Height | Padding H | Font token | Radius | Icon size |
|---|---|---|---|---|---|
| `sm` | 32px | 12px | `label/md` 13px | `radius/sm` 4px | `icon/sm` 16px |
| `md` | 40px | 16px | `label/lg` 14px | `radius/md` 6px | `icon/md` 20px |
| `lg` | 48px | 20px | `label/xl` 16px | `radius/md` 6px | `icon/md` 20px |
| `xl` | 56px | 24px | 18px 600wt | `radius/lg` 8px | `icon/lg` 24px |

#### States

| State | Primary | Secondary | Ghost |
|---|---|---|---|
| Default | bg: `action/primary` | bg: `action/secondary` | bg: transparent |
| Hover | bg: `action/primary-hover` | bg: `action/secondary-hover` | bg: `action/ghost-hover` |
| Active | bg: `action/primary-active`, scale: 0.97 | bg: `neutral-200` | bg: `cerulean-100` |
| Focus | + `shadow/focus` ring | + `shadow/focus` ring | + `shadow/focus` ring |
| Disabled | bg: `action/disabled`, text: `text/disabled`, cursor: not-allowed | same pattern | opacity 40% |
| Loading | Show spinner (16px) left of label, width locked to prevent reflow |

**Icon-only button:** Equal width and height. Radius: `radius/md` for square, `radius/full` for circular. Tooltip required for accessibility.

---

### 10.2 Input

**Anatomy:** `[label] [helper text?] [input-wrapper [icon-left?] [value] [icon-right?] [clear?]] [error/hint text?]`

#### Base Specs

| Property | Value |
|---|---|
| Height | 40px (`md`), 36px (`sm`), 48px (`lg`) |
| Padding | 10px 14px |
| Border | 1px `border/default` |
| Border radius | `radius/sm` 4px |
| Background | `bg/surface` |
| Font | `body/md` — Inter 16px |

#### States

| State | Border | Shadow | Background |
|---|---|---|---|
| Default | `border/default` | none | `bg/surface` |
| Hover | `border/strong` | none | `bg/surface` |
| Focus | `border/focus` | `shadow/focus` | `bg/surface` |
| Filled | `border/default` | none | `bg/surface` |
| Error | `border/error` | `shadow/focus-error` | `bg/surface` |
| Disabled | `border/subtle` | none | `bg/surface-sunken`, cursor: not-allowed |
| Read-only | `border/subtle` | none | `bg/surface-sunken` |

#### Variants

**Text input** — Standard single-line
**Textarea** — Multi-line, min-height 96px, resizable vertically. Identical border/state rules.
**Search input** — Left: `MagnifyingGlass` icon 20px `text/tertiary`. Right: `X` clear button when non-empty.
**Select / Dropdown** — Right: `CaretDown` icon. Options list: `shadow/md`, `radius/lg`, max-height 240px with overflow-y scroll.
**File path input** — Font: `mono/md`. Background: `bg/surface-sunken`. Read-only.
**Address input** — Font: `mono/md`. Paste-to-validate pattern.

#### Label & Helper Text

- Label: `label/md` 13px 500wt, `text/secondary`, margin-bottom 6px
- Optional indicator: `label/sm` `text/tertiary` inline after label
- Helper text: `label/sm` 12px, `text/tertiary`, margin-top 4px
- Error text: `label/sm` 12px, `status/error-text`, margin-top 4px. Prepend `XCircle` 14px icon.
- Character count: `label/sm` `text/tertiary`, right-aligned, shown when max length set

---

### 10.3 Badge / Tag

**Anatomy:** `[icon?] label`
Internal padding: 3px 8px (`sm`), 4px 10px (`md`)
Font: `label/sm` — 12px 500wt
Radius: `radius/xs` 2px
Border: 1px solid

#### Semantic Variants

| Variant | Bg | Text | Border | Usage |
|---|---|---|---|---|
| `topic` | Per taxonomy map | Per taxonomy map | Per taxonomy map | Policy topic tags |
| `license` | `neutral-100` | `text/secondary` | `border/default` | SPDX license |
| `mime` | `neutral-50` | `text/tertiary` | `border/subtle` | PDF, CSV, ZIP, etc. |
| `certified` | `teal-50` | `teal-700` | `teal-200` | Blob certified on Walrus |
| `pending` | `amber-50` | `amber-700` | `amber-200` | Upload in progress |
| `storage-safe` | `neutral-50` | `text/tertiary` | `border/subtle` | Epoch count, >8 epochs |
| `storage-warn` | `amber-50` | `amber-700` | `amber-300` | 4–8 epochs remaining |
| `storage-critical` | `red-50` | `red-700` | `red-300` | <4 epochs — action needed |
| `revision` | `cerulean-50` | `cerulean-700` | `cerulean-200` | "Revision of [ID]" |
| `new` | `green-50` | `green-700` | `green-200` | Newly submitted |
| `neutral` | `neutral-100` | `text/secondary` | `border/default` | Generic |

**Removable tag:** Add `X` (12px) on right. Hover: bg darkens 1 step.
**Interactive/clickable tag:** Hover state + cursor pointer. Used in filter sidebar as active filter pills.

---

### 10.4 Artifact Card

The primary unit of the browse experience.

```
┌──────────────────────────────────────────────────┐  border: 1px border/default
│  [revision badge?]          [storage badge]      │  radius: radius/lg (8px)
│                                                  │  bg: bg/surface
│  Title                                           │  padding: 20px 24px
│  (heading/sm, text/primary, 2 lines max)         │
│                                                  │
│  Authors · Institution                           │  label/sm, text/secondary
│                                                  │
│  Description                                     │  body/sm, text/tertiary
│  (3 lines max, -webkit-line-clamp: 3)            │
│                                                  │
│  ──────────────────────────────────────────────  │  divider: border/subtle
│                                                  │
│  [topic] [topic] [topic]    [N files] [date]    │  bottom row, space-between
└──────────────────────────────────────────────────┘
```

#### States

| State | Change |
|---|---|
| Default | `shadow/sm` |
| Hover | `shadow/card-hover`, `translateY(-2px)`, border: `border/strong` |
| Focused | `shadow/focus` ring + hover styles |
| Loading | Skeleton placeholder (see Skeleton) |

**Commit indicator:** When `rootId` is set (this artifact is a commit, not a root), show a `GitBranch` icon + "Commit" badge in top-left of card.

**File count + Published date row:**
- Left: `Files` icon 14px + "N files" — `label/sm` `text/tertiary`
- Right: Published date — `label/sm` `text/tertiary`
- Between: institution name — `label/sm` `text/secondary`

---

### 10.5 Filter Sidebar

```
┌─────────────────────────┐  width: 240px
│  Filters                │  label/xs ALL CAPS, text/tertiary, letter-spacing 0.06em
│  [Clear all] →          │  ghost sm button, right-aligned
│                         │
│  Search                 │  label/sm, text/secondary, margin-bottom 8px
│  [🔍 Search artifacts ] │  Search input full-width
│                         │
│  Topic                  │  Section label (same as above)
│  □ AI Safety       (12) │  Checkbox row: label/md + count badge
│  □ Governance      (8)  │
│  □ Labor Markets   (5)  │
│  [Show 7 more ↓]        │  ghost sm button
│                         │
│  Institution            │
│  [Type to filter...  ]  │  Text input
│                         │
│  Date Range             │
│  From [          ]      │  Date input
│  To   [          ]      │  Date input
│                         │
│  Sort                   │
│  ● Newest first         │  Radio group
│  ○ Oldest first         │
│  ○ Publication date     │
└─────────────────────────┘
```

**Checkbox:** 16×16px, `radius/xs` 2px border. Checked: `action/primary` fill, white checkmark. Focus: `shadow/focus`.
**Active filter count:** When filters are active, show a dot badge on the Filter toggle button (mobile).
**Mobile:** Slide-over drawer from left, full height, 320px width. Overlay: `bg/overlay`.

---

### 10.6 Navigation Bar

**Height:** 64px
**Background:** `bg/surface` with `border/subtle` 1px bottom border
**Position:** sticky top
**Max width:** 1280px, centered, `space/24` horizontal padding

```
┌──────────────────────────────────────────────────────────────┐
│  [Archive logotype]   Browse   Submit   About     [Connect] │
└──────────────────────────────────────────────────────────────┘
```

- Logotype: Custom wordmark or `FileArchive` icon (32px) + "Archive" — `heading/xs` or `label/xl` 600wt
- Nav links: `label/lg` 14px 500wt, `text/secondary`. Active: `text/primary` + 2px bottom border `action/primary`
- Mobile: Hamburger icon (right). Slides in overlay nav drawer from right, full height, 280px

**Connect Wallet button:** Variant `wallet`, size `sm` (32px height).
**Connected wallet state:** Replace button with pill showing truncated address (`0x1234...5678` — `mono/sm`) + WAL balance + `ChevronDown`. Click opens dropdown: full address (copy), WAL balance, disconnect.

---

### 10.7 Storage Epoch Indicator

This is a critical, purpose-built component. It appears on Artifact Cards and the Detail page.

#### Visual States

**Safe (>8 epochs remaining)**
```
[HourglassHigh icon 14px, text/tertiary]  "~24 epochs · expires Jun 2027"
label/sm, text/tertiary — no background, inline
```

**Warning (4–8 epochs remaining)**
```
┌─────────────────────────────────────────┐  bg: amber-50, border: amber-200
│  ⚠  ~6 epochs · expires in ~12 weeks   │  Amber warning badge
│     Storage expiring soon              │  label/sm amber-700
└─────────────────────────────────────────┘
```

**Critical (<4 epochs remaining)**
```
┌─────────────────────────────────────────────┐  bg: red-50, border: red-200
│  ⚠  ~2 epochs · expires in ~4 weeks         │  Red alert badge
│     Extend storage to preserve              │  label/sm red-700
│     [Fund storage →]                         │  ghost sm button, red-600
└─────────────────────────────────────────────┘
```

**After extension (community funded)**
```
[CheckCircle 14px, teal-500]  "Extended by community · ~30 epochs remaining"
label/sm, teal-700
```

---

### 10.8 Wallet Connection States

**Not connected — inline CTA**
```
┌────────────────────────────────┐
│  🔒  Connect wallet to submit  │
│      No account needed to browse│
└────────────────────────────────┘
bg: cerulean-50, border: cerulean-100, radius: radius/lg
Body: body/sm text/secondary. Button: primary sm "Connect Wallet"
```

**Connecting**
```
[ ⟳ Connecting...  ]   — wallet button, loading state
```

**Connected**
```
[ 0x1a2b...9z8y  ↓ ]   — pill, mono/sm, bg: neutral-100, border: border/default
                         balance: label/sm text/tertiary "42.3 WAL"
```

**Insufficient WAL**
```
┌────────────────────────────────────────────────┐  bg: amber-50
│  ⚠  Insufficient WAL balance                  │  amber border
│     Estimated cost: 4.2 WAL · Balance: 1.1 WAL │
│     [Get WAL →]                                │  external link
└────────────────────────────────────────────────┘
```

---

### 10.9 File Upload Dropzone

```
┌──────────────────────────────────────────────────┐  dashed border: 2px neutral-300
│                                                  │  radius: radius/xl (12px)
│         [UploadSimple icon, 40px]               │  bg: bg/surface-sunken
│         Drag files here                         │  padding: 48px
│         or                                      │
│         [Browse files]                          │  secondary sm button
│                                                  │
│  PDF, CSV, JSON, XLSX, ZIP, TXT, MD, PNG, JPEG  │  label/xs, text/tertiary
│  Max 100 MiB per file · Up to 50 files          │  label/xs, text/tertiary
└──────────────────────────────────────────────────┘
```

#### States

**Drag over:**
- Border: 2px `border/focus` (cerulean)
- Background: `cerulean-50`
- Icon: `cerulean-500`
- Text: `text/brand`

**Files added (non-empty):**
File list replaces the dropzone placeholder. Dropzone shrinks to compact add-more zone above the list.

**File row:**
```
[FileIcon 20px]  filename.pdf        [mime badge]  [2.4 MiB]  [Description input]  [Trash icon]
                 font: mono/sm                      label/sm
```

**Uploading state:**
```
[FileIcon 20px]  filename.pdf   ████████░░  68%   "Uploading..."
                                Progress bar, cerulean-500, radius/full, h-2 (8px)
```

**Upload complete:**
```
[FileIcon 20px]  filename.pdf   [ShieldCheck teal icon]  [CertifiedID: abc123...]  [Download]
```

**Error:**
```
[FileIcon 20px]  filename.pdf   [XCircle red icon]  "File too large (142 MiB)"
```

---

### 10.10 Submission Stepper

A linear, top-mounted progress indicator for the 4-step submission flow.

```
  ●─────────────────────────────────────────────────
 (1)           (2)             (3)           (4)
Metadata      Files        Cost Review      Submit

●  Active (current): cerulean-600 fill, white number, cerulean-600 connector
✓  Complete: green-500 fill, white checkmark, neutral-200 connector
○  Upcoming: neutral-200 fill, neutral-500 number, neutral-200 connector
✗  Error: red-500 fill, white X, neutral-200 connector
```

**Circle size:** 32px, `radius/full`
**Connector line:** 2px, height of 2px, horizontally spans between circles
**Step label:** `label/sm` below each circle, `text/secondary` (upcoming), `text/primary` (active), `text/tertiary` (complete)
**Mobile:** Compact — show only "Step 2 of 4: Files" as text with a linear progress bar

**Step 1: Metadata**
- Title (required), Description (required), Institution, Published Date, License (SPDX select), Authors (repeat section: name + optional ORCID + affiliation), Topics (multi-select chips), Tags (freeform)

**Step 2: Files**
- Dropzone component (full spec above)
- Per-file description field
- File count + total size summary bar at bottom

**Step 3: Cost Review**
```
┌────────────────────────────────────────────────┐
│  Submission Cost Estimate                      │
│                                                │
│  Total size          12.4 MiB                  │
│  Storage duration    52 epochs (~2 years)      │
│  Estimated WAL cost  ≈ 4.20 WAL               │
│  WAL / USD           ≈ $0.84 USD (informational)│
│                                                │
│  This is an estimate. The exact cost is        │
│  calculated at upload time.                    │
│                                                │
│  Your balance: 42.3 WAL  ✓                    │
└────────────────────────────────────────────────┘
```

**Step 4: Wallet Prompts**
Three sequential micro-states, each with:
- A numbered indicator (1 of 3, 2 of 3, 3 of 3)
- Description of what the prompt does
- A spinner while pending
- A green checkmark when confirmed

```
  [✓] 1. Register upload   — Confirmed
  [⟳] 2. Upload to Walrus  — Waiting for wallet...
  [ ] 3. Create on Sui     — Pending
```

**Confirmation Screen**
```
┌───────────────────────────────────────────────────┐
│           ✓  Artifact Published                   │  heading/md, green-700
│                                                   │
│  "Title of Artifact"                              │  heading/sm
│  Institution · Published Date                     │  body/sm text/secondary
│                                                   │
│  Sui Object ID                                    │  label/sm text/tertiary
│  [0x1a2b3c4d...  □ copy]                         │  mono/md + copy button
│                                                   │
│  Transaction                                      │  label/sm text/tertiary
│  [0xabcd1234...  □ copy  ↗ View on Suiscan]      │  mono/md + copy + link
│                                                   │
│  [View Artifact →]     [Submit Another]           │
└───────────────────────────────────────────────────┘
```

---

### 10.11 On-Chain Verification Panel

Appears in the Artifact Detail page sidebar. Collapsible on mobile.

```
┌──────────────────────────────────────────────────────┐
│  On-Chain Record                    [ShieldCheck ✓]  │  heading/xs, teal-700
├──────────────────────────────────────────────────────┤
│  Sui Object ID                                        │  label/xs ALL CAPS text/tertiary
│  [0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f  □ ↗]    │  mono/sm, truncated, copy + link
│                                                       │
│  Transaction                                          │
│  [0xabcd1234...  □ ↗]                               │  mono/sm, copy + link to Suiscan
│                                                       │
│  Created                2026-01-15  Epoch 240         │  label/sm text/secondary
│  Last updated           2026-02-01  Epoch 244         │
│                                                       │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─        │
│                                                       │
│  Verify independently [?]                             │  label/sm text/brand + info tooltip
│  ↕ How to verify without this app                    │  collapsible
│                                                       │
│  1. Read the Artifact on any Sui RPC node:            │  body/sm text/secondary
│     sui client object 0x1a2b3c...                    │  mono/sm bg/surface-sunken, p-8, radius/sm
│  2. Download files from any Walrus aggregator:        │
│     https://{aggregator}/v1/blobs/{blobId}            │  mono/sm
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

### 10.12 Citation Panel

Appears on Artifact Detail page below the file list.

```
┌──────────────────────────────────────────────────────┐
│  Cite this Artifact                                  │  heading/xs
├──────────────────────────────────────────────────────┤
│  [APA] [Chicago] [BibTeX]                            │  Tab group, label/sm
│                                                       │
│  ┌──────────────────────────────────────────────┐    │
│  │ Author, A. B., & Author, C. D. (2026).        │    │  bg/surface-sunken
│  │ Title of Artifact. Walrus Archive Archive. │    │  body/sm mono-font for BibTeX
│  │ https://aipolicyarchive.wal.app/0x1a2b...    │    │
│  └──────────────────────────────────────────────┘    │
│                                                       │
│  [□ Copy citation]                                   │  secondary sm button
│                                                       │
│  Persistent identifier                                │  label/xs ALL CAPS text/tertiary
│  [0x1a2b3c4d...  □ copy]                            │  mono/sm
└──────────────────────────────────────────────────────┘
```

---

### 10.13 File List Table

Appears on Artifact Detail page.

**Columns:**
`Name` · `Type` · `Size` · `Description` · `Blob ID` · `Download`

| Property | Value |
|---|---|
| Row height | 52px |
| Horizontal padding | 16px |
| Header: font | `label/xs` ALL CAPS `text/tertiary` |
| Row: font | `body/sm` `text/primary` |
| Blob ID: font | `mono/sm` `text/tertiary`, truncated 12 chars + copy icon |
| Alternating rows | `bg/surface` / `bg/surface-sunken` |
| Border | 1px `border/subtle` between rows |

**Mobile:** Collapse to stacked card layout per file. Name + size on top row, download button full-width below.

---

### 10.14 Toast Notification

**Position:** Bottom-right, 24px from edge
**Width:** 360px max
**Stack:** Up to 3 toasts, newest on top
**Appear:** Slide up + fade in from bottom-right
**Dismiss:** Slide right + fade out, or auto after 4s

```
┌─────────────────────────────────────────────┐  shadow/xl, radius/lg
│  [Icon]  Message text                   [X] │  padding: 14px 16px
│          Optional sub-message               │  body/sm
└─────────────────────────────────────────────┘
```

| Type | Icon | Icon color | Left border (4px) | Background |
|---|---|---|---|---|
| `success` | `CheckCircle` | `green-500` | `green-500` | `bg/surface` |
| `error` | `XCircle` | `red-500` | `red-500` | `bg/surface` |
| `warning` | `Warning` | `amber-500` | `amber-500` | `bg/surface` |
| `info` | `Info` | `cerulean-500` | `cerulean-500` | `bg/surface` |
| `tx-pending` | spinner | `cerulean-500` | `cerulean-300` | `bg/surface` |
| `tx-confirmed` | `CheckCircle` | `teal-500` | `teal-500` | `bg/surface` |

---

### 10.15 Modal

**Overlay:** `bg/overlay` (neutral-900 @ 60%), covers full viewport
**Panel:** `bg/surface`, `shadow/lg`, `radius/xl` 12px
**Max width:** 520px (`sm`), 640px (`md`), 800px (`lg`)
**Enter/exit:** `ease/out` `duration/slow`, `translateY(4px) opacity 0` → rest

**Header:** 20px 24px padding. Title: `heading/sm`. Close button: ghost `icon/lg` top-right.
**Body:** 0 24px 24px padding. `body/md`.
**Footer:** Borderless, right-aligned buttons, gap 12px.

---

### 10.16 Empty States

Three contexts:

**No results (Browse)**
```
[MagnifyingGlass icon, 48px, neutral-300]
No artifacts found
Matching your current filters
[Clear all filters]   secondary md button
```

**First submission (Submit confirmation inverse)**
Not applicable — success state covered in 10.10.

**Wallet not connected (Submission page)**
```
[Wallet icon, 64px, cerulean-200]
Connect your wallet to submit an artifact
You can browse and download without a wallet
[Connect Wallet]   primary md button
```

All empty states: centered, `space/24` vertical padding above and below, `heading/sm` title, `body/sm` `text/secondary` sub-message.

---

### 10.17 Skeleton Loaders

Used for Artifact Card and detail page while data is fetching.

**Skeleton block:** `bg/surface-sunken` background, animated shimmer (gradient sweep left→right, `duration/slower`, loop). `radius/sm` for text blocks, `radius/lg` for card containers.

**Artifact Card skeleton:**
- Title: 70% width block, 20px height
- Subtitle: 50% width, 14px height
- Description: 3 rows at 100%, 14px, gap 6px
- Tags: 3 small blocks, 24px height, varied widths
- Date: 30% width, 12px height

---

### 10.18 Tooltip

**Trigger:** Hover or focus on target element
**Delay:** 300ms show, 0ms hide
**Max width:** 240px
**Style:** `bg/inverse` background, `text/inverse` `label/sm` text, `radius/md` 6px, `shadow/md`, 8px padding 6px
**Arrow:** 6px, same bg color
**Position:** Prefer top-center; flip to bottom if insufficient space

---

### 10.19 Accordion / Expandable

Used for "How to verify independently" in the on-chain panel, and FAQ on About page.

**Trigger row:** 48px height, full-width clickable, `border/subtle` bottom border. Label: `label/xl` `text/primary`. Indicator: `CaretDown` 20px, rotates 180° when open.
**Content:** 16px 0 padding, `body/sm` `text/secondary`. Reveal: max-height animation, `duration/normal` `ease/out`.

---

## 11. Page Patterns

### 11.1 Browse Page

```
┌──────────────────────────────────────────────────────────────┐
│  Navbar                                                      │
├──────────────────────────────────────────────────────────────┤
│  Page Header                                                 │
│  AI Policy Research Archive          [Submit Artifact →]    │
│  N artifacts · Full-text search ────────────────────────     │
├────────────────┬─────────────────────────────────────────────┤
│  Filter        │  Sort: [Newest ▼]   [Grid/List toggle]      │
│  Sidebar       │  Active filters: [AI Safety ×] [×]         │
│  (240px)       │                                             │
│  Sticky        │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│                │  │  Card    │  │  Card    │  │  Card    │  │
│                │  └──────────┘  └──────────┘  └──────────┘  │
│                │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│                │  │  Card    │  │  Card    │  │  Card    │  │
│                │  └──────────┘  └──────────┘  └──────────┘  │
│                │                                             │
│                │  [← Previous]  Page 2 of 14  [Next →]      │
└────────────────┴─────────────────────────────────────────────┘
```

---

### 11.2 Artifact Detail Page

```
┌──────────────────────────────────────────────────────────────┐
│  Navbar                                                      │
├──────────────────────────────────────────────────────────────┤
│  ← Back to Browse                                            │  breadcrumb, label/sm
│                                                              │
│  [Revision badge?]  [Storage badge]                         │
│  Artifact Title                                              │  heading/xl
│  Authors list · Institution · Published date                 │  body/sm text/secondary
│                                                              │
│  [topic] [topic] [license]                                   │
├───────────────────────────────────┬──────────────────────────┤
│  Description                      │  On-Chain Record         │
│  body/md text/secondary           │  Panel (10.11)           │
│                                   │  (320px fixed right      │
│  ──────────────────────────────── │   lg+ only, below on md)  │
│                                   │                          │
│  Files  (N)                       │  Storage                 │
│  [file table (10.13)]             │  [Epoch Indicator]       │
│                                   │                          │
│  ──────────────────────────────── │  [Fund Storage ↓]        │
│                                   │  (Phase 3)               │
│  Cite this Artifact               │                          │
│  [Citation panel (10.12)]         │                          │
│                                   │                          │
│  Version History                  │                          │
│  [revision chain if applicable]   │                          │
└───────────────────────────────────┴──────────────────────────┘
```

---

### 11.3 Submission Page

```
┌──────────────────────────────────────────────────────────────┐
│  Navbar                                                      │
├──────────────────────────────────────────────────────────────┤
│  Submit an Artifact                                          │  heading/lg, centered
│  Preserve AI policy research on Walrus and Sui               │  body/md text/secondary, centered
│                                                              │
│  [Stepper: Metadata → Files → Cost → Submit]                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Form content for current step                         │  │  max-width: 640px, centered
│  │                                                        │  │  bg/surface, shadow/sm
│  │  [Back]                              [Continue →]      │  │  radius/xl, padding: 40px
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

### 11.4 About Page

Prose-heavy page. Max content width: 680px, centered.

Sections:
1. What is this archive — `heading/lg` + 2–3 paragraphs `body/lg`
2. How it works — 3-column feature cards with icons
3. How to verify independently — code block + prose steps
4. Technology stack — simple table
5. Data permanence guarantee — key callout box

---

## 12. Data Display Patterns

### 12.1 Metadata Label-Value Pair

```
Institution                           ←  label/xs ALL CAPS text/tertiary, margin-bottom 4px
Stanford HAI                          ←  body/sm text/primary (or mono/md for IDs)
```

**Stack layout:** Label above value, gap 4px.
**Inline layout:** Label left, value right, min-width on label 120px.
**Grid layout (detail page):** 2-column grid, each cell as stack layout.

### 12.2 Identifier Display

All Sui Object IDs, blob IDs, and wallet addresses follow a consistent pattern:

```
[mono/sm text]  [CopySimple icon 14px, text/tertiary, hover: text/secondary]  [ArrowSquareOut icon 14px, text/tertiary?]
```

- Full-length IDs: shown truncated (first 10 + `...` + last 6 chars) in most contexts
- Detail page on-chain panel: full ID shown in horizontal scroll container, no truncation
- Truncation tooltip: full value on hover

### 12.3 Address Display

Wallet addresses shown as:
`0x1a2b...9z8y` — `mono/sm`, `text/secondary`

### 12.4 Epoch Display

| Context | Format |
|---|---|
| Storage badge | `~24 epochs` |
| Detail page | `Epoch 244 · ~Jun 2027 · 24 epochs remaining` |
| Expiry warning | `Expires in ~6 epochs (~12 weeks)` |
| Critical | `Expires in ~2 epochs (~4 weeks) — Extend storage` |

---

## 13. Accessibility

### 13.1 Color Contrast Requirements

All text must meet WCAG 2.1 AA minimum. Body text must meet AAA.

| Pairing | Contrast | Passes |
|---|---|---|
| `neutral-900` on `neutral-0` | 18.7:1 | AAA |
| `neutral-900` on `neutral-50` | 16.8:1 | AAA |
| `neutral-700` on `neutral-50` | 9.2:1 | AAA |
| `neutral-600` on `neutral-0` | 6.5:1 | AA |
| `cerulean-600` on `neutral-0` | 5.1:1 | AA |
| `cerulean-700` on `neutral-50` | 6.8:1 | AA |
| White on `cerulean-600` | 5.1:1 | AA |
| White on `action/destructive` `red-600` | 5.6:1 | AA |
| `amber-700` on `amber-50` | 7.3:1 | AAA |
| `teal-700` on `teal-50` | 7.6:1 | AAA |

**Never use color alone** to communicate state. Always pair color with an icon or text label (e.g., storage expiry badge always has an icon + text, not just a color change).

### 13.2 Focus Management

- All interactive elements must have a visible focus indicator: `shadow/focus` ring
- Focus ring offset: 2px
- No `outline: none` without a custom replacement
- Tab order must follow visual reading order
- Skip-to-content link: first focusable element on every page

### 13.3 ARIA Patterns

| Component | ARIA |
|---|---|
| Submission stepper | `role="list"`, each step `role="listitem"`, current step `aria-current="step"` |
| Filter checkboxes | `role="group"` with `aria-labelledby` pointing to section header |
| File dropzone | `role="region"`, `aria-label="File upload area"`, input `type="file"` fallback |
| Toast | `role="alert"` (errors), `role="status"` (success/info), `aria-live="polite"` |
| Modal | `role="dialog"`, `aria-labelledby`, focus trap on open, return focus on close |
| Storage epoch warning | `aria-label="Storage expiring in 6 epochs (approximately 12 weeks)"` |
| Copy button | `aria-label="Copy Sui Object ID"`, change to `aria-label="Copied"` after click |
| Collapsible | `aria-expanded`, `aria-controls` pointing to content ID |

### 13.4 Keyboard Navigation

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Navigate interactive elements |
| `Enter` / `Space` | Activate buttons, checkboxes, trigger select |
| `Escape` | Close modal, dismiss toast, cancel file drag |
| `Arrow keys` | Navigate select options, radio groups |
| `Delete` / `Backspace` | Remove active filter chips (when focused) |

---

## 14. Figma Organization

### 14.1 File Structure

```
📁 Walrus Archive Design System
├── 📄 0 — Cover & Changelog
├── 📄 1 — Foundations
│   ├── Frame: Color Primitives
│   ├── Frame: Color Semantic Tokens (Light mode)
│   ├── Frame: Color Semantic Tokens (Dark mode)
│   ├── Frame: Typography Scale
│   ├── Frame: Spacing Scale
│   ├── Frame: Elevation & Shadows
│   └── Frame: Border Radius
├── 📄 2 — Icons
│   └── Icon inventory (all from Phosphor, grouped by category)
├── 📄 3 — Components
│   ├── Button (all variants × sizes × states)
│   ├── Input (all variants × states)
│   ├── Badge & Tag (all variants)
│   ├── Navigation Bar (connected / disconnected / mobile)
│   ├── Artifact Card (default, hover, loading, revision)
│   ├── Filter Sidebar (desktop / mobile drawer)
│   ├── Storage Epoch Indicator (all states)
│   ├── Wallet States (disconnected, connecting, connected, insufficient)
│   ├── File Upload Dropzone (all states)
│   ├── Submission Stepper (all step states)
│   ├── On-Chain Verification Panel
│   ├── Citation Panel
│   ├── File List Table
│   ├── Toast (all types)
│   ├── Modal
│   ├── Accordion
│   ├── Empty States
│   ├── Skeleton Loaders
│   └── Tooltip
├── 📄 4 — Page Templates
│   ├── Browse (desktop / mobile)
│   ├── Artifact Detail (desktop / mobile)
│   ├── Submit Flow (all 4 steps + confirmation)
│   └── About
└── 📄 5 — Patterns & Annotations
    ├── Metadata display patterns
    ├── Identifier display
    ├── Epoch display formats
    └── Responsive behavior notes
```

### 14.2 Figma Variables Setup

**Collections:**
1. **Primitives** — all raw color values (no modes)
2. **Semantic/Light** — all `bg/*`, `text/*`, `border/*`, `action/*`, `status/*` tokens pointing to Primitives
3. **Semantic/Dark** — same token names, different Primitive references
4. **Spacing** — `space/1` through `space/40`
5. **Radius** — all radius tokens
6. **Typography** — font-size, line-height, letter-spacing per scale token

**Modes:** Light and Dark on the Semantic collection. Toggle at frame level for instant theme preview.

### 14.3 Component Naming Convention

```
ComponentName / Variant / Size / State

Examples:
  Button / Primary / MD / Default
  Button / Primary / MD / Hover
  Badge / Topic / AI Safety
  Input / Text / MD / Error
  Card / Artifact / Default
  Card / Artifact / Hover
  Card / Artifact / Loading
```

### 14.4 Auto Layout Specifications

All components use Figma Auto Layout.

| Component | Direction | Alignment | Gap | Padding |
|---|---|---|---|---|
| Button (md) | Horizontal | Center | 8px | 10px 16px |
| Badge | Horizontal | Center | 4px | 3px 8px |
| Input | Vertical | Left | 6px | 0 (wrapper handles padding) |
| Card | Vertical | Left | 0 | 20px 24px |
| Navbar | Horizontal | Center | Auto (space-between) | 0 96px |
| Toast | Horizontal | Top | 12px | 14px 16px |
| Filter Sidebar | Vertical | Left | 24px | 24px |
