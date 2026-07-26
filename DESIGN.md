---
version: alpha
name: betano-design-system
description: "An electrifying sportsbook and casino design system built around a high-voltage orange-red (#FF3D00) primary, deep navy canvas (#0E0F22), and a lightning-bolt brand language. The system balances playful energy with responsible clarity — display typography roars in MD Nichrome (or Anton substitute), body runs in Haffer (or Inter), and the surface ladder alternates between deep navy darks and warm ivory lights for true dark/light mode parity. The lightning bolt is both logo icon and graphic pattern engine: angular diagonals, high-contrast colour blocks, and surreal illustration by Ed McGowan define the visual landscape."

dark:
  primary: "#FF3D00"
  primary-hover: "#FF6B33"
  primary-pressed: "#CC3100"
  on-primary: "#FFFFFF"
  secondary: "#FF0279"
  secondary-hover: "#FF3596"
  green: "#0ECF5E"
  green-hover: "#28E671"
  canvas: "#0E0F22"
  surface-1: "#16182E"
  surface-2: "#1E2038"
  surface-3: "#262845"
  surface-4: "#2E3052"
  card: "#1A1C35"
  border: "#2A2C48"
  border-strong: "#3A3C5E"
  ink: "#FFFFFF"
  ink-muted: "#B3B3C6"
  ink-subtle: "#7A7A96"
  ink-tertiary: "#525270"
  overlay: "rgba(0, 0, 0, 0.65)"
  semantic-success: "#0ECF5E"
  semantic-warning: "#FFB800"
  semantic-error: "#FF3D3D"
  gradient-primary: "linear-gradient(135deg, #FF3D00, #FF0279)"
  gradient-surface: "linear-gradient(180deg, #16182E 0%, #0E0F22 100%)"

light:
  primary: "#FF3D00"
  primary-hover: "#E63600"
  primary-pressed: "#CC3100"
  on-primary: "#FFFFFF"
  secondary: "#FF0279"
  secondary-hover: "#D00264"
  green: "#0ECF5E"
  green-hover: "#0BB852"
  canvas: "#F5F0EB"
  surface-1: "#FFFFFF"
  surface-2: "#FAF8F6"
  surface-3: "#F0EDEA"
  surface-4: "#E8E4E0"
  card: "#FFFFFF"
  border: "#E0DCD6"
  border-strong: "#C8C4BE"
  ink: "#0E0F22"
  ink-muted: "#4A4A5E"
  ink-subtle: "#7A7A96"
  ink-tertiary: "#A0A0B0"
  overlay: "rgba(0, 0, 0, 0.35)"
  semantic-success: "#0ECF5E"
  semantic-warning: "#FFB800"
  semantic-error: "#FF3D3D"
  gradient-primary: "linear-gradient(135deg, #FF3D00, #FF0279)"
  gradient-surface: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F6 100%)"

typography:
  display-xl:
    fontFamily: "MD Nichrome, Anton, Impact, sans-serif"
    fontSize: 72px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: -2.0px
    textTransform: uppercase
  display-lg:
    fontFamily: "MD Nichrome, Anton, Impact, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.00
    letterSpacing: -1.5px
    textTransform: uppercase
  display-md:
    fontFamily: "MD Nichrome, Anton, Impact, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -1.0px
    textTransform: uppercase
  headline:
    fontFamily: "Haffer, Inter, Plus Jakarta Sans, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.5px
  card-title:
    fontFamily: "Haffer, Inter, Plus Jakarta Sans, sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.3px
  subhead:
    fontFamily: "Haffer, Inter, Plus Jakarta Sans, sans-serif"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: -0.2px
  body-lg:
    fontFamily: "Haffer, Inter, Plus Jakarta Sans, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.1px
  body:
    fontFamily: "Haffer, Inter, Plus Jakarta Sans, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: "Haffer, Inter, Plus Jakarta Sans, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  caption:
    fontFamily: "Haffer, Inter, Plus Jakarta Sans, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0.2px
  button:
    fontFamily: "Haffer, Inter, Plus Jakarta Sans, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: 0.3px
    textTransform: uppercase
  eyebrow:
    fontFamily: "Haffer, Inter, Plus Jakarta Sans, sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.30
    letterSpacing: 1.0px
    textTransform: uppercase
  odds:
    fontFamily: "Haffer, Inter, Plus Jakarta Sans, sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.20
    letterSpacing: -0.5px
  stats-value:
    fontFamily: "Haffer, Inter, Plus Jakarta Sans, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.10
    letterSpacing: -1.0px

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{dark.primary}"
    textColor: "{dark.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 24px
    border: none
    hover: "{dark.primary-hover}"
    active: "{dark.primary-pressed}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{dark.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 24px
    border: "2px solid {dark.border}"
    hover: "2px solid {dark.primary}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{dark.ink-muted}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    border: none
    hover: "{dark.ink}"
  odds-card:
    backgroundColor: "{dark.surface-1}"
    textColor: "{dark.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 16px
    border: "1px solid {dark.border}"
    hover: "1px solid {dark.primary}"
  match-card:
    backgroundColor: "{dark.surface-1}"
    textColor: "{dark.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 20px
    border: "1px solid {dark.border}"
    hover: "1px solid {dark.border-strong}"
  prediction-card:
    backgroundColor: "{dark.surface-2}"
    textColor: "{dark.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
    border: "1px solid {dark.border}"
    accent-border: "2px solid {dark.primary}"
  stats-card:
    backgroundColor: "{dark.card}"
    textColor: "{dark.ink}"
    typography: "{typography.stats-value}"
    rounded: "{rounded.md}"
    padding: 16px
    border: "1px solid {dark.border}"
  text-input:
    backgroundColor: "{dark.surface-1}"
    textColor: "{dark.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    border: "1px solid {dark.border}"
    focus: "1px solid {dark.primary}"
  text-input-error:
    backgroundColor: "{dark.surface-1}"
    textColor: "{dark.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    border: "1px solid {dark.semantic-error}"
    focus: "1px solid {dark.semantic-error}"
  select-trigger:
    backgroundColor: "{dark.surface-1}"
    textColor: "{dark.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    border: "1px solid {dark.border}"
    focus: "1px solid {dark.primary}"
  select-dropdown:
    backgroundColor: "{dark.surface-2}"
    textColor: "{dark.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 4px
    border: "1px solid {dark.border}"
    item-padding: "8px 16px"
    item-hover: "{dark.surface-3}"
    item-selected: "{dark.primary} / 15"
  badge:
    backgroundColor: "{dark.primary}"
    textColor: "{dark.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-secondary:
    backgroundColor: "{dark.surface-3}"
    textColor: "{dark.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-success:
    backgroundColor: "{dark.semantic-success}"
    textColor: "{dark.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  tab-default:
    backgroundColor: "transparent"
    textColor: "{dark.ink-muted}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 20px
    border: "1px solid transparent"
  tab-active:
    backgroundColor: "{dark.primary}"
    textColor: "{dark.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 20px
    border: "1px solid {dark.primary}"
  progress-bar:
    backgroundColor: "{dark.surface-3}"
    fillColor: "{dark.primary}"
    rounded: "{rounded.pill}"
    height: 6px
  progress-bar-secondary:
    backgroundColor: "{dark.surface-3}"
    fillColor: "{dark.green}"
    rounded: "{rounded.pill}"
    height: 6px
  top-nav:
    backgroundColor: "{dark.canvas}"
    textColor: "{dark.ink}"
    typography: "{typography.body-sm}"
    height: 64px
    border: "1px solid {dark.border}"
  footer:
    backgroundColor: "{dark.canvas}"
    textColor: "{dark.ink-subtle}"
    typography: "{typography.caption}"
    padding: 48px 32px
    border-top: "1px solid {dark.border}"
  loading-skeleton:
    backgroundColor: "{dark.surface-2}"
    rounded: "{rounded.sm}"
    shimmer: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)"
  modal-overlay:
    backgroundColor: "{dark.overlay}"
  modal-card:
    backgroundColor: "{dark.surface-1}"
    textColor: "{dark.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 32px
    border: "1px solid {dark.border}"
---

## Overview

Betano's design system is built around **high voltage energy** — the orange-red `{dark.primary}` (#FF3D00) is a colour that demands attention, while the deep navy `{dark.canvas}` (#0E0F22) grounds the interface with weight and sophistication. The system is a full **dark/light mode** pair, where the dark mode uses deep navy surfaces and the light mode inverts to warm ivory tones — both anchored by the same electric orange-red accent.

The brand language is unmistakable: **lightning**. The logo's detachable "B" doubles as a bolt icon, and the graphic system extends into diagonal patterns, angular cuts, and high-contrast colour blocks. Custom illustrations by **Ed McGowan** inject surreal, playful character into the sportsbook and casino experience.

### Core Values

- **Energy** — The orange-red pulse that drives every interaction. Nothing is flat or passive.
- **Clarity** — Sports betting demands fast, accurate decisions. Typography is bold, information is hierarchically clear, odds are prominent.
- **Playfulness** — Illustration and motion add personality without undermining trust. Betano takes fun seriously.
- **Responsibility** — Clean information design supports responsible play. The system never obscures or tricks.
- **Scale** — The identity works from a phone screen to a stadium LED board, from a jersey patch to a 50-metre billboard.

### Key Characteristics

- **Orange-red primary** (`{dark.primary}` #FF3D00) — the single chromatic detonator. Used on CTAs, odds highlights, selection states, and progress fills.
- **Hot pink secondary** (`{dark.secondary}` #FF0279) — complementary accent for gradients, secondary highlights, and casino-specific surfaces.
- **Deep navy canvas** (`{dark.canvas}` #0E0F22) in dark mode; warm ivory (`{light.canvas}` #F5F0EB) in light mode.
- **Lightning-bolt graphic language** — angular patterns, diagonal stripes, electric energy in motion and illustration.
- **Display type in MD Nichrome** — a compact, impactful uppercase face for hero moments and score displays.
- **Body type in Haffer** — a refined, geometric sans that balances the display face's aggression.
- **Odds and stats are typographic heroes** — they own the largest weight and size in the information hierarchy.
- **Gradient as accent layer** — the primary-to-secondary gradient (`{dark.gradient-primary}`) is used sparingly for loaders, hero sections, and brand moments.
- **Full dark/light parity** — both modes share the same structure, inverted with warm rather than cool tones for light mode.

---

## Colors

> Brand source: betano.com, Nomad Studio brand identity (2024 rebrand).

### Dark Mode Palette

The dark mode is the default and primary expression. The canvas is a deep navy-black, surfaces step up through progressively lighter navy tones, and text reads white-to-gray.

#### Brand & Accent

| Token | Hex | Usage |
|---|---|---|
| `{dark.primary}` | #FF3D00 | Primary CTAs, odds highlights, selection states, progress fills, brand mark |
| `{dark.primary-hover}` | #FF6B33 | Hovered primary buttons, hovered interactive elements |
| `{dark.primary-pressed}` | #CC3100 | Active/pressed primary buttons |
| `{dark.secondary}` | #FF0279 | Casino sections, secondary gradients, alternative highlights |
| `{dark.secondary-hover}` | #FF3596 | Hovered secondary accent elements |
| `{dark.green}` | #0ECF5E | Success states, positive odds movements, green statistics |
| `{dark.green-hover}` | #28E671 | Hovered success elements |

#### Surface

| Token | Hex | Usage |
|---|---|---|
| `{dark.canvas}` | #0E0F22 | Page background — deepest navy-black |
| `{dark.surface-1}` | #16182E | Cards, dropdowns, input backgrounds, modal content |
| `{dark.surface-2}` | #1E2038 | Elevated cards, hovered cards, featured panels |
| `{dark.surface-3}` | #262845 | Progress bar tracks, tertiary surfaces, disabled states |
| `{dark.surface-4}` | #2E3052 | Deepest lifted surface, active tab backgrounds |
| `{dark.card}` | #1A1C35 | Compact card surfaces (stat cards, mini cards) |
| `{dark.border}` | #2A2C48 | Default borders on cards and dividers |
| `{dark.border-strong}` | #3A3C5E | Stronger borders, active border states, hovered cards |

#### Text

| Token | Hex | Usage |
|---|---|---|
| `{dark.ink}` | #FFFFFF | Primary text, headlines, odds values |
| `{dark.ink-muted}` | #B3B3C6 | Secondary text, card body copy |
| `{dark.ink-subtle}` | #7A7A96 | Tertiary text, placeholders, disabled labels |
| `{dark.ink-tertiary}` | #525270 | Captions, meta information, footnotes |

#### Semantic

| Token | Hex | Usage |
|---|---|---|
| `{dark.semantic-success}` | #0ECF5E | Wins, positive movements, success badges |
| `{dark.semantic-warning}` | #FFB800 | Draws (football), pending states, caution indicators |
| `{dark.semantic-error}` | #FF3D3D | Losses, errors, negative movements, validation failures |

### Light Mode Palette

Light mode inverts the surface ladder to warm ivory tones while preserving the same orange-red primary. The text hierarchy inverts to deep navy.

#### Surface (Light)

| Token | Hex | Usage |
|---|---|---|
| `{light.canvas}` | #F5F0EB | Page background — warm ivory |
| `{light.surface-1}` | #FFFFFF | Cards, dropdowns, input backgrounds |
| `{light.surface-2}` | #FAF8F6 | Elevated cards, hovered cards |
| `{light.surface-3}` | #F0EDEA | Progress tracks, tertiary surfaces |
| `{light.surface-4}` | #E8E4E0 | Deepest lifted surface |
| `{light.border}` | #E0DCD6 | Default borders |
| `{light.border-strong}` | #C8C4BE | Stronger borders, active states |

#### Text (Light)

| Token | Hex | Usage |
|---|---|---|
| `{light.ink}` | #0E0F22 | Primary text, headlines |
| `{light.ink-muted}` | #4A4A5E | Secondary text |
| `{light.ink-subtle}` | #7A7A96 | Tertiary text, placeholders |
| `{light.ink-tertiary}` | #A0A0B0 | Captions, meta |

### Gradient

The **brand gradient** (`{dark.gradient-primary}` = `linear-gradient(135deg, #FF3D00, #FF0279)`) is a distinctive Betano asset. Usage is reserved for:
- Loading animations and skeleton shimmer overlays
- Hero section backgrounds in marketing contexts
- Brand logo lockups and splash screens
- Progress indicators and animated highlights

---

## Typography

### Font Family

- **MD Nichrome** (display) — A compact, impactful uppercase display face designed by Rutherford Craze (Mass Driver, 2020). Carries display-xl through display-md. Evokes stadium scoreboards, jersey lettering, and broadcast graphics.
  - *Free substitute:* **Anton** or **Bebas Neue** at weight 700.
- **Haffer** (body) — A refined geometric sans designed by Martin Vácha & Daniel Quisek (Displaay Type Foundry, 2021). Carries headline through caption, button labels, odds, and stats.
  - *Free substitute:* **Inter** or **Plus Jakarta Sans** at matching weights.

### Hierarchy

| Token | Size | Weight | Line Ht | Letter Spc | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 72px | 700 | 0.95 | -2.0px | Hero headlines, score displays, match-day hero |
| `{typography.display-lg}` | 56px | 700 | 1.00 | -1.5px | Section openers, competition titles |
| `{typography.display-md}` | 40px | 700 | 1.05 | -1.0px | Sub-section headlines, big odds displays |
| `{typography.headline}` | 28px | 700 | 1.15 | -0.5px | Card titles, modal headers, prediction titles |
| `{typography.card-title}` | 22px | 600 | 1.25 | -0.3px | Match card titles, section headings |
| `{typography.subhead}` | 20px | 500 | 1.35 | -0.2px | Lead body, intro paragraphs |
| `{typography.body-lg}` | 18px | 400 | 1.55 | -0.1px | Feature descriptions, extended copy |
| `{typography.body}` | 16px | 400 | 1.55 | 0 | Default body, match details, card content |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Compact data, team names, labels |
| `{typography.caption}` | 12px | 400 | 1.40 | 0.2px | Meta, timestamps, footer, small print |
| `{typography.button}` | 14px | 600 | 1.20 | 0.3px | All button labels — **uppercase** |
| `{typography.eyebrow}` | 13px | 600 | 1.30 | 1.0px | Section eyebrows — **uppercase** |
| `{typography.odds}` | 20px | 700 | 1.20 | -0.5px | Odds values, decimal prices |
| `{typography.stats-value}` | 32px | 700 | 1.10 | -1.0px | Large stats figures (goals, percentages) |

### Principles

- **Uppercase display is the default.** MD Nichrome lives in uppercase; headlines and card titles may also uppercase for impact.
- **Odds and stats are the loudest voice.** The `{typography.odds}` and `{typography.stats-value}` tokens ensure betting-relevant data dominates the visual hierarchy.
- **Button labels are uppercase with tracking.** The 0.3px letter-spacing gives buttons a premium, confident read.
- **Eyebrow sections use wide tracking** (+1.0px) to differentiate taxonomy from content.
- **Body and display are intentionally distinct.** The shift from uppercase MD Nichrome to sentence-case Haffer marks the transition from "excitement" to "information".

### Font Loading

- **MD Nichrome** / Anton: Load at weight 700 only (display usage is single-weight).
- **Haffer** / Inter: Load at weights 400, 500, 600, 700 for full hierarchy coverage.
- Preload display font for above-the-fold hero text to prevent layout shift.

---

## Layout

### Spacing System

- **Base unit**: 4px.
- **Tokens**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on match/prediction cards; `{spacing.xl}` 32px on modal cards.
- Button padding: 10px vertical · 24px horizontal — wider than typical for a confident tap target.
- Compact button padding: 8px vertical · 16px horizontal.

### Grid & Container

- Max content width: 1200px (1280px on marketing surfaces).
- Card grids: 3-up match cards at desktop, 2-up at tablet, 1-up at mobile.
- Odds comparison: side-by-side on desktop, stacked on mobile.
- Prediction cards: full-width or 2-up depending on context.

### Whitespace Philosophy

The dark canvas IS the breathing room. Sections separate by surface lift (surface-1 panels on canvas) rather than excessive gap. Within cards, `{spacing.md}` 16px between data rows, `{spacing.lg}` 24px between content blocks. Between sections: `{spacing.section}` 96px.

On light mode, the same principle applies — the warm ivory canvas provides a comfortable reading environment without needing heavy borders.

---

## Elevation & Depth

### Dark Mode

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | `{dark.canvas}` background | Page background, footer |
| 1 (surface lift) | `{dark.surface-1}` background, 1px `{dark.border}` | Default cards, input backgrounds, dropdowns |
| 2 (elevated) | `{dark.surface-2}` background, 1px `{dark.border-strong}` | Featured cards, hovered cards, dropdown items |
| 3 (raised) | `{dark.surface-3}` background, 1px `{dark.border-strong}` | Progress tracks, disabled states, tab bars |
| 4 (modal) | `{dark.surface-1}` + shadow `rgba(0,0,0,0.3)` 0 8px 32px | Modals, pickers, overlays |
| 5 (focus ring) | 2px `{dark.primary}` outline at 60% opacity | Focused inputs, focused buttons |

### Light Mode

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | `{light.canvas}` background | Page background, footer |
| 1 (surface lift) | `{light.surface-1}` background, 1px `{light.border}` | Default cards, input backgrounds |
| 2 (elevated) | `{light.surface-2}` background, 1px `{light.border-strong}` | Featured cards, hovered cards |
| 3 (raised) | `{light.surface-3}` background | Progress tracks, tertiary surfaces |
| 4 (modal) | `{light.surface-1}` + shadow `rgba(0,0,0,0.08)` 0 8px 32px | Modals, pickers |
| 5 (focus ring) | 2px `{light.primary}` outline at 60% opacity | Focused inputs, focused buttons |

Betano uses surface colour for depth, not drop shadows. Shadows are reserved exclusively for modal/overlay contexts. On dark mode, shadows are nearly invisible — the surface ladder does the work.

### Decorative Depth

- **Lightning-bolt graphic patterns** — Diagonal angular patterns derived from the logo's bolt serve as section backgrounds and hero treatments.
- **Gradient accent** — The brand gradient (`{dark.gradient-primary}`) appears in loading shimmers, progress bars, and highlight overlays.
- **Surreal illustration** — Commissioned Ed McGowan illustration suite brings depth through character-driven art, never through atmospheric gradients or photo stock.
- **Subtle surface transitions** — Cards may include a faint top-edge highlight (1px lighter than surface) for a "lit" effect on dark mode.

---

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Avatars (square), full-bleed panels |
| `{rounded.xs}` | 4px | Mini badges, inline indicators |
| `{rounded.sm}` | 6px | Small tags, progress bar containers |
| `{rounded.md}` | 8px | All buttons, form inputs, stat cards |
| `{rounded.lg}` | 12px | Match cards, prediction cards, modals |
| `{rounded.xl}` | 16px | Featured cards, hero panels, marketing sections |
| `{rounded.xxl}` | 24px | Oversized feature containers (rare) |
| `{rounded.pill}` | 9999px | Badges, tabs, toggle switches |
| `{rounded.full}` | 9999px | Avatar circles, team crest containers |

### Angular Language

Betano intentionally uses **sharp angles** alongside rounded corners to echo the lightning bolt:
- Diagonal cut-outs on hero panels and card headers
- Angular chevron patterns in decorative bands
- 45-degree corner accents on featured prediction cards
- The "B" logo itself features a sharp lightning-bolt cut in the letterform

Rounded corners (`{rounded.md}` 8px on buttons, `{rounded.lg}` 12px on cards) soften the UI for comfortable interaction, while the angular graphic language adds the "voltage".

---

## Components

### Buttons

**`button-primary`** — Orange-red CTA. The default action across all contexts.
- Background `{dark.primary}`, text `{dark.on-primary}`, type `{typography.button}` (uppercase 14px/600/0.3px), padding 10px 24px, rounded `{rounded.md}`.
- Hover: background `{dark.primary-hover}`.
- Active: background `{dark.primary-pressed}`.
- Loading state: replace text with a spinner, preserve width.

**`button-secondary`** — Bordered button for secondary actions.
- Transparent background, text `{dark.ink}`, 2px `{dark.border}` border, type `{typography.button}`, padding 10px 24px, rounded `{rounded.md}`.
- Hover: border `{dark.primary}`.

**`button-ghost`** — Text-only button for tertiary actions.
- Transparent background, text `{dark.ink-muted}`, type `{typography.button}`, padding 8px 16px, rounded `{rounded.md}`.
- Hover: text `{dark.ink}`.

### Cards

**`odds-card`** — Compact card displaying a single betting odd.
- Background `{dark.surface-1}`, text `{dark.ink}`, type `{typography.odds}`, rounded `{rounded.lg}`, padding 16px, 1px `{dark.border}`.
- Hover: 1px `{dark.primary}` border, subtle scale transform.
- Selected: background `{dark.primary}` at 15% opacity via overlay.

**`match-card`** — Full match fixture with team crests, date, and odds.
- Background `{dark.surface-1}`, text `{dark.ink}`, type `{typography.body}`, rounded `{rounded.xl}`, padding 20px, 1px `{dark.border}`.
- Team names: `{typography.body-sm}` at weight 600.
- Score/odds: `{typography.odds}` at weight 700.
- Hover: 1px `{dark.border-strong}`.

**`prediction-card`** — AI prediction result with confidence bar and analysis.
- Background `{dark.surface-2}`, text `{dark.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px, 1px `{dark.border}`.
- Left accent border: 2px `{dark.primary}` for visual anchoring.
- Confidence bar: `{component.progress-bar}` filled to confidence percentage.

**`stats-card`** — Single focused statistic (goals, possession, shots).
- Background `{dark.card}`, text `{dark.ink}`, type `{typography.stats-value}`, rounded `{rounded.md}`, padding 16px, 1px `{dark.border}`.
- Label beneath value: `{typography.caption}` in `{dark.ink-subtle}`.

### Inputs & Forms

**`text-input`** — Form field for search, filter, and data entry.
- Background `{dark.surface-1}`, text `{dark.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 10px 16px, 1px `{dark.border}`.
- Focus: 1px `{dark.primary}`, 2px `{dark.primary}` focus ring at 30% opacity.
- Placeholder: `{dark.ink-subtle}`.
- Disabled: `{dark.surface-3}` background, `{dark.ink-tertiary}` text, reduced opacity.

**`select-trigger`** — Dropdown trigger matching text-input styling.
- Same visual spec as text-input.
- Chevron icon in `{dark.ink-tertiary}`, rotates 180° on open.
- Open state: border `{dark.primary}`, dropdown appears below.

**`select-dropdown`** — Dropdown options panel.
- Background `{dark.surface-2}`, text `{dark.ink}`, type `{typography.body-sm}`, rounded `{rounded.md}`, padding 4px, 1px `{dark.border}`.
- Each item: padding 8px 16px, rounded `{rounded.sm}`.
- Item hover: `{dark.surface-3}` background.
- Item selected: `{dark.primary}` at 15% opacity background, `{dark.primary}` text.

### Badges & Tags

**`badge`** — Primary badge.
- Background `{dark.primary}`, text `{dark.on-primary}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 2px 10px.

**`badge-secondary`** — Neutral badge.
- Background `{dark.surface-3}`, text `{dark.ink-muted}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 2px 10px.

**`badge-success`** — Success badge for wins and green movements.
- Background `{dark.semantic-success}`, text `{dark.on-primary}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 2px 10px.

### Tabs

**`tab-default`** — Inactive tab.
- Transparent background, text `{dark.ink-muted}`, type `{typography.button}`, rounded `{rounded.pill}`, padding 8px 20px.

**`tab-active`** — Active/highlighted tab.
- Background `{dark.primary}`, text `{dark.on-primary}`, type `{typography.button}`, rounded `{rounded.pill}`, padding 8px 20px.
- The active tab "pills" into the primary colour — a signature Betano interaction.

### Progress

**`progress-bar`** — Primary progress/confidence indicator.
- Track: `{dark.surface-3}`, rounded `{rounded.pill}`, height 6px.
- Fill: `{dark.primary}`, rounded `{rounded.pill}`, transition width 300ms ease.

**`progress-bar-secondary`** — Green progress bar (positive metrics).
- Track: `{dark.surface-3}`, rounded `{rounded.pill}`, height 6px.
- Fill: `{dark.green}`, rounded `{rounded.pill}`.

### Navigation

**`top-nav`** — Sticky app bar.
- Background `{dark.canvas}`, text `{dark.ink}`, type `{typography.body-sm}`, height 64px, bottom border 1px `{dark.border}`.
- Brand logo left, nav links center, user menu right.
- Active link indicator: 2px `{dark.primary}` underline or pill highlight.

### Footer

**`footer`** — Information footer.
- Background `{dark.canvas}`, text `{dark.ink-subtle}`, type `{typography.caption}`, padding 48px 32px, top border 1px `{dark.border}`.

### Loading States

**`loading-skeleton`** — Shimmer placeholder card.
- Background `{dark.surface-2}`, rounded `{rounded.sm}`.
- Shimmer animation: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)` translating across skeleton.
- On light mode: shimmer `rgba(0,0,0,0.04)`.

### Modal

**`modal-overlay`** — Background scrim.
- Background `{dark.overlay}`.

**`modal-card`** — Modal content container.
- Background `{dark.surface-1}`, text `{dark.ink}`, type `{typography.body}`, rounded `{rounded.xl}`, padding 32px, 1px `{dark.border}`, shadow `0 8px 32px rgba(0,0,0,0.3)`.

---

## Dark/Light Mode System

### Activation

- **Default**: Dark mode (matches brand default and industry standard for sportsbook UIs).
- **Toggle**: Via `dark` class on `<html>` element. Light mode = class removed.
- **User preference**: Respect `prefers-color-scheme` media query for initial load, but allow manual override persisted to localStorage.

### Token Mapping

Every component has both `{dark.*}` and `{light.*}` tokens. The mapping works:

```css
/* Dark mode (default) */
:root {
  --color-canvas: #0E0F22;
  --color-surface-1: #16182E;
  --color-ink: #FFFFFF;
  /* ... */
}

/* Light mode */
:root.light,
html:not(.dark) {
  --color-canvas: #F5F0EB;
  --color-surface-1: #FFFFFF;
  --color-ink: #0E0F22;
  /* ... */
}
```

### Critical Differences

| Property | Dark | Light |
|---|---|---|
| Canvas | Deep navy #0E0F22 | Warm ivory #F5F0EB |
| Surface ladder | Cool navy tones | Warm ivory tones |
| Ink | White → gray scale | Deep navy → gray scale |
| Shadows | Near-invisible, minimal | Subtle, warm-toned |
| Shimmer | White-tinted | Dark-tinted |
| Borders | Blue-tinted gray | Warm beige |
| Accent | Orange-red (unchanged) | Orange-red (unchanged) |

The orange-red primary **does not change** between modes — it is the anchor that provides brand consistency across themes.

---

## Do's and Don'ts

### Do

- Use `{dark.primary}` (#FF3D00) as the single dominant accent for CTAs, selection, and odds highlights.
- Use the brand gradient (`{dark.gradient-primary}`) sparingly — loading states, hero moments, brand lockup.
- Let `{typography.odds}` and `{typography.stats-value}` be the loudest elements on any data card.
- Apply the lightning-bolt graphic language in decorative bands, patterns, and section transitions.
- Use `{rounded.pill}` for tabs and badges; `{rounded.md}` for buttons; `{rounded.lg}` for cards.
- Pair uppercase display (MD Nichrome/Anton) with sentence-case body (Haffer/Inter) for contrast.
- Surface depth through colour, not shadows — the navy-to-ivory surface ladder is the system's elevation language.
- Use Ed McGowan illustration for personality — surreal, character-driven, never stock photography.

### Don't

- Don't use `#000000` true black as canvas — always `{dark.canvas}` #0E0F22.
- Don't apply the primary orange-red as a full card background or section fill — use it as accent.
- Don't add a third chromatic accent beyond orange-red and hot pink.
- Don't use atmospheric gradients or generic stock photography.
- Don't pill-round CTAs or cards — `{rounded.md}` and `{rounded.lg}` are the maximum.
- Don't use drop shadows as primary depth mechanism on dark mode.
- Don't mix multiple illustration styles — the Ed McGowan suite is the single visual voice.
- Don't de-emphasise odds — they should always be the most prominent numerical element.
- Don't ship a dark-only or light-only interface — both modes are required.

---

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop | 1200px+ | 3-up card grid, side-by-side odds comparison |
| Tablet | 768–1199px | 2-up card grid, collapsed nav hamburger |
| Mobile | <768px | 1-up cards, stacked layout, bottom nav |

### Touch Targets

- All interactive elements ≥44px tap height on touch devices.
- Odds cards maintain ≥48px tap target for reliable betting selection.
- Bottom nav items have ≥56px tap area.

### Type Scaling

- `{typography.display-xl}` (72px) scales to 40px on mobile.
- `{typography.display-lg}` (56px) scales to 32px on mobile.
- `{typography.display-md}` (40px) scales to 28px on mobile.
- Body and body-sm remain unchanged across breakpoints.

### Card Collapsing

- **Match cards**: 3-up → 2-up at 1024px → 1-up at 768px.
- **Prediction cards**: 2-up → full-width at 768px.
- **Stats grid**: 4-up → 2-up → 1-up.
- **Top nav**: Links collapse to hamburger below 1024px; bottom nav bar appears below 768px.

---

## Illustration

### Style

The Betano illustration suite is commissioned from **Ed McGowan** and follows a surreal, character-driven style:

- **Bold outlines** — thick black or dark navy strokes define characters.
- **Flat colour** — limited palette matching brand colours (orange-red, hot pink, white, navy).
- **Surreal scenarios** — characters interact with oversized sports and casino elements (giant dice, floating footballs, card-suit landscapes).
- **Humor** — playful expressions and unexpected combinations (a horse in a jersey, a slot machine in a stadium).
- **No stock photography** — every visual is custom.

### Usage

- Marketing hero sections and landing pages.
- Empty states and error illustrations in the app.
- Loading screens and splash animations.
- Social media and promotional materials.

---

## Motion

### Principles

- **Fast** — Sports betting is real-time; animations complete in 150–300ms.
- **Purposeful** — Motion guides attention to odds changes, selection confirmation, and state transitions.
- **Electric** — Subtle lightning-bolt cues: quick diagonal wipes, fast fades, sharp ease curves.

### Key Animations

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Odds change | Scale pulse (1.0 → 1.15 → 1.0) + colour flash | 300ms | ease-out |
| Selection | Border colour transition + scale | 200ms | ease-out |
| Dropdown open | Fade + translateY(-4px → 0) | 200ms | ease-out |
| Page transition | Quick fade | 150ms | ease-in-out |
| Skeleton shimmer | TranslateX across skeleton | 1.5s | linear, infinite |
| Tab pill | Background colour + pill shape | 200ms | ease-out |
| Progress fill | Width transition | 300ms | ease-out |
| Modal enter | Fade + scale(0.95 → 1.0) | 250ms | ease-out |

### Loading Sequences

- **Initial app load**: Brand gradient sweep across screen → logo reveal with lightning-bolt flash → fade to content.
- **Data loading**: Skeleton cards with shimmer animation matching card layout.
- **Prediction generation**: Progress bar fill with pulsing glow at active edge.

---

## Known Gaps

- The brand gradient (`{dark.gradient-primary}`) usage in the product UI is speculative — the marketing identity applies it broadly; in-product applications need testing.
- Ed McGowan illustration suite is proprietary; the style guide documents its intended use but the actual assets are not included in this repository.
- MD Nichrome and Haffer are commercial typefaces; free substitutes (Anton, Inter) are documented but may not perfectly match the brand weight and spacing.
- Light mode contrast ratios need verification against WCAG 2.2 AA standards, particularly for `{light.ink-subtle}` on `{light.canvas}`.
- Stadium LED and broadcast-specific colour variants (for sponsor integrations) are not documented here — they exist in the brand's master asset file.
- The lightning-bolt pattern library (SVG repeating patterns, diagonal overlay masks) is referenced conceptually but not shipped as code assets.
