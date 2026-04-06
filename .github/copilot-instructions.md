# Copilot Instructions

This is a frontend React-based repository for the Walrus Archive platform. It focuses on artifact submission, discovery, and governance using Sui + Walrus storage. Please follow these guidelines when contributing.

---

## Code Standards

### Code Philosophy

Follow these principles when writing frontend code:

- Prefer **simple solutions**
- Avoid **unnecessary abstractions**
- Favor **readability over clever code**
- Write **maintainable and predictable code**
- Follow **existing patterns in the codebase**

---

## Development Flow

- Dev: `npm run dev`
- Build: `npm run build`
- Test: `npm run test` (Jest)
- Lint/format: follow project ESLint + Prettier config

---

## Tech Stack

### Languages

- TypeScript
- JavaScript

### Frontend

- React (functional components only)
- React Router
- TailwindCSS

### Testing

- Jest

---

## Repository Structure (Expected)

- `components/` — reusable UI components
- `pages/` — route-level pages
- `hooks/` — custom hooks
- `services/` — API / GraphQL / blockchain logic
- `utils/` — helpers
- `assets/` — static files (SVGs, etc.)
- `docs/` — documentation

---

## React Component Rules

### Functional Components Only

Always use **functional components**.  
Avoid class components.

---

### Component Design

Prefer **small reusable components**.

Example structure:

```
components/
  Button/
    index.tsx
  Avatar/
    index.tsx
```

Avoid large monolithic components.

---

### JSX Rules

Keep JSX **clean and readable**.

Move complex logic **outside the return statement**.

Prefer optional chaining instead of long logical chains.

**Bad:**

```tsx
<div>{user && user.profile && user.profile.name}</div>
```

**Preferred:**

```tsx
const name = user?.profile?.name;

<div>{name}</div>;
```

---

## Styling & Layout

### Layout Primitives

Use layout primitives instead of raw layout CSS.

Preferred components:

- `Flex`
- `Stack`
- `Center`

Avoid inline layout styles like:

```tsx
<div style={{ display: "flex" }}>
```

---

### Tailwind Rules

Use **TailwindCSS utilities** for styling.

Avoid:

- custom CSS files
- `<style>` blocks
- inline CSS

Unless absolutely necessary.

---

### Variable Usage

Create variables **only when reused or improving readability**.

Avoid wrapping simple values used once.

**Bad:**

```tsx
const imgSrc = "https://example.com/avatar.png";
<img src={imgSrc} />;
```

**Preferred:**

```tsx
<img src="https://example.com/avatar.png" />
```

---

## State Management

- Keep state **close to where it is used**
- Avoid unnecessary **global state**

---

## SVG Usage Rules

### Rendering

All SVGs must use the **react-inlinesvg** library.

```tsx
import SVG from "react-inlinesvg";
```

---

### Do Not Use `<img>` for SVG

Never render SVG icons using:

```tsx
<img src="/assets/icon.svg" />
```

Using `react-inlinesvg` allows Tailwind classes to control:

- color
- size

---

### Do Not Inline Raw SVG

Avoid placing raw SVG markup directly inside JSX.

**Bad:**

```tsx
<svg>
  <path d="..." />
</svg>
```

Instead:

- store SVG files in `/public/assets/`
- load them using `react-inlinesvg`

---

## Design Implementation (Accuracy Policy)

### 90–95% Rule

If a complex visual effect cannot be reproduced with **~90–95% accuracy**, skip the effect rather than implementing a poor approximation.

Examples of complex effects:

- glow effects
- shader-like button lighting
- complex gradients
- layered overlays
- advanced blur masks

---

### Reporting Skipped Effects

If a visual effect is skipped, clearly document it in the **PR or task notes**.

Example:

```
Skipped effects:
- Glow effect on hero card
- Gradient overlay on background image
```

---

### Priority Order

Even when effects are skipped, the following must remain accurate:

- layout structure
- spacing
- typography
- base colors

---

## TypeScript & Consistency

### Strict Typing

Always use strict TypeScript types.

Avoid:

```ts
any;
```

---

### Codebase Consistency

When modifying code:

- follow existing naming conventions
- match existing file structures
- avoid refactoring unrelated code
- maintain consistency with existing components

---

## Architecture Context (Important)

This project is part of the **Walrus Archive system**:

- **Sui blockchain** → stores metadata (`Artifact`)
- **Walrus storage** → stores immutable file content

Each file is referenced by:

- `blobId`
- `quiltPatchId`
- `endEpoch`

Frontend responsibilities:

- artifact submission (upload + metadata)
- discovery (search, filter, browse)
- artifact detail (download + verification)

---

## Key Product Concepts

### Artifact

A structured unit containing:

- metadata (title, authors, topics, etc.)
- files (stored on Walrus)

Properties:

- versioned (tree structure)
- independently verifiable on-chain

---

### File Handling Rules

- Files are uploaded as **Walrus quilts**
- Never mutate file content
- Never assume local persistence
- Always rely on:
  - `quiltPatchId` for retrieval
  - `blobId` for on-chain reference

---

## Testing

- Use **Jest**
- Write tests for:
  - utilities
  - hooks
  - critical logic

---

## General Guidelines

1. Prefer **simple and predictable implementations**
2. Avoid adding new dependencies unless necessary
3. Use **existing utilities and patterns first**
4. Prioritize **readability and maintainability**
5. Keep components small and composable

---

## When in Doubt

- Follow existing code patterns
- Keep solutions minimal
- Optimize for clarity over cleverness
