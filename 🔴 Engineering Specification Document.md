## Legacy Creative Agency Website Refactor

---

## 1. Document Purpose

This document defines the **official engineering specification** for refactoring an existing legacy creative agency website.

The objective is a **code-level reconstruction only**, preserving the current UI **pixel-for-pixel**, while significantly improving:

- Code quality
- Maintainability
- Scalability
- Performance
- Multilingual readiness
- Team collaboration workflow

This specification is **binding** and must be followed strictly.

---

## 2. Project Scope

### 2.1 In Scope

- Full technical audit of the existing codebase
- Internal refactor of HTML, CSS, and JavaScript
- Design system internalization (variables & tokens)
- Multilingual architecture (UI-neutral)
- Framework migration (incremental, UI-safe)
- Animation optimization (GSAP)

- SEO, accessibility, and standards compliance
- Monorepo and Git workflow preparation

### 2.2 Out of Scope

- UI/UX redesign
- Visual restyling
- Layout changes
- Content rewriting
- Feature additions affecting UI

---

## 3. Non-Negotiable Constraints (UI Freeze)

The website **must remain visually identical** to the current version.
This includes:

- Layout and grid system
- DOM hierarchy and section order
- Spacing (margin, padding, gaps)
- Typography (font family, size, weight, line-height)
- Colors, gradients, shadows, borders
- Icons and icon placement
- Animation timing, easing, and motion behavior

Any visual deviation constitutes **specification failure**.

---

## 4. Existing Technology Stack (Locked)

The current website is built using:

- Bootstrap 5.3
- GSAP + plugins
- MixItUp
- Plyr
- Swipper.js
- Vanilla JavaScript
- Remix Icons

Rules:

- Libraries may be reorganized, wrapped, or modularized
- Libraries may NOT be removed or replaced
- Replacement is allowed **only if strictly necessary**, fully justified, and UI-neutral

---

## 5. Website Structure (Immutable)

### Core Pages

1. Home
2. About Us
3. FAQ
4. Contact
5. Legal Pages

### Services

6.1 Services Index
6.2 Branding
6.3 Graphic Design
6.4 Other services (same structure)

### Portfolio

7.1 Works Index
7.2 Work Details Template

### Case Studies

8.1 Case Studies Index
8.2 Case Study Details Template

### Blog

9.1 Blog Index
9.2 Blog Post Template
No additions, removals, or restructuring are allowed.

---

## 6. Design System Internalization (Code-Level Only)

### 6.1 Global Design Tokens

A global variable layer must be created to centralize existing values:

- Color palette
- Spacing scale
- Font sizes
- Border radius
- Z-index scale
- Animation durations

All values must match **existing computed styles exactly**.

### 6.2 Component-Level Variables

Each major component must:

- Define local CSS variables
- Reference global tokens
- Avoid hardcoded values

Goal:

- Reduce duplication
- Improve isolation
- Enable safe future extensions

No new visual rules are allowed.

---

## 7. Multilingual Architecture Requirements

The multilingual system must:

- Preserve DOM structure

- Support LTR and RTL

- Be SEO-friendly

- Scale to additional languages

Required documentation:

- Routing strategy
- Language detection logic
- Content loading mechanism

---

## 8. Framework Evaluation & Selection

The following frameworks must be evaluated:

- Next.js (React)
- Svelte / SvelteKit
- Astro

Selection criteria:

- SEO performance
- Runtime performance
- Compatibility with Bootstrap and GSAP
- Incremental migration capability
- Monorepo compatibility

One framework must be selected with **purely technical justification**.

---

## 9. Blog Integration (Subdomain)

Design an architecture to integrate a Blogger-powered blog via:

- `blog.domain.com`
- Requirements:
- No UI changes
- SEO-safe
- Brand-consistent behavior
- Proper cross-domain handling

---

## 10. Monorepo & Git Workflow

### 10.1 Monorepo Preparation

The project must be structured for a scalable monorepo, including:

- Clear package separation (core, UI, assets, configs)
- Shared configuration layer
- Environment isolation

### 10.2 Git Workflow

Define and document:

- Branching strategy (main / develop / feature)

- Commit message conventions

- Versioning approach

- Deployment flow

Tooling assumptions must be justified.

---

## 11. Implementation Rules

### 11.1 HTML Refactor

- Convert HTML into framework components
- Preserve DOM structure exactly
- Semantic improvements allowed only if UI-neutral

### 11.2 CSS Refactor

- Normalize styles using variables
- Preserve computed output exactly
- Eliminate duplication
- RTL-ready
- Zero visual regression

### 11.3 JavaScript Refactor

- Modular architecture
- No global scope pollution
- Identical behavior and output

### 11.4 Animations

- Reuse existing GSAP animations

- Internal optimization only

- No changes to motion, timing, or easing

---

## 12. Quality Gates

The final implementation must be:

- Pixel-identical to the original UI

- SEO optimized

- W3C valid

- WCAG compliant

- Optimized for Core Web Vitals

---

## 13. Forbidden Actions

- UI redesign

- Layout or spacing changes

- Color or typography changes

- New UI components

- Creative interpretation

- Opinion-based decisions

---

## 14. Execution Protocol

If any requirement is ambiguous:

- STOP and request clarification

If any task risks visual change:

- DO NOT execute

---

## 15. Optional Technical Enhancements

Purely technical improvements may be suggested only if:

- UI remains untouched

- Long-term value is clear

- Justification is explicit

---

---

## 16. Acceptance Criteria (Mandatory)

All deliverables must satisfy the following acceptance criteria before approval.

### 16.1 Visual Integrity

- UI is pixel-identical to the legacy website

- No changes in layout, spacing, colors, typography, or animations

- Side-by-side comparison shows no visual differences

### 16.2 Code Quality

- No duplicated magic values (colors, spacing, sizes)

- All reusable values extracted into variables

- Components are isolated and reusable

- No unused code or dead files

### 16.3 Performance & Standards

- Lighthouse scores meet modern best-practice thresholds

- HTML passes W3C validation

- CSS contains no invalid rules

- JavaScript produces no console errors

### 16.4 Architecture

- Clear separation of concerns

- Scalable folder structure

- Multilingual system functional without DOM changes

- Monorepo-ready setup confirmed

---

## 17. Engineering Checklists

### 17.1 Pre-Implementation Checklist

- [ ] Full codebase audit completed

- [ ] Existing computed styles documented

- [ ] UI freeze confirmed

- [ ] Migration strategy approved

### 17.2 Implementation Checklist

- [ ] HTML converted to components without DOM changes

- [ ] Global design tokens defined

- [ ] Component-level variables implemented

- [ ] CSS duplication removed

- [ ] JavaScript modularized

- [ ] GSAP animations preserved

### 17.3 Pre-Delivery Checklist

- [ ] Pixel comparison verified

- [ ] SEO audit passed

- [ ] Accessibility audit passed

- [ ] W3C validation passed

- [ ] Performance benchmarks met

---

## 18. Antigravity Execution Mode (Mandatory)

When executed by Antigravity, the following execution rules apply:

- Execute tasks strictly in document order

- Do not skip phases

- Do not infer missing requirements

- Stop execution if ambiguity is detected

- Request clarification before proceeding

Antigravity must treat this document as a **hard specification**, not a guideline.

---

## 19. Reference Folder Structure (Monorepo-Ready)

A recommended high-level structure:

```

root/

├─ apps/

│  └─ web/

│     ├─ src/

│     │  ├─ components/

│     │  ├─ layouts/

│     │  ├─ pages/

│     │  ├─ styles/

│     │  │  ├─ tokens.css

│     │  │  ├─ globals.css

│     │  ├─ scripts/

│     │  └─ animations/

│     └─ public/

├─ packages/

│  ├─ ui/

│  ├─ config/

│  └─ utils/

├─ docs/

└─ tooling/

```

This structure must be adapted to the selected framework while preserving separation of concerns.

---

## 20. Naming Conventions

### 20.1 Files & Folders

- kebab-case for folders and files

- descriptive, non-abbreviated names

### 20.2 CSS

- BEM or utility-safe naming

- Variables prefixed by scope:

- `--global-*`

- `--component-*`

### 20.3 JavaScript

- camelCase for variables and functions

- PascalCase for components

- No anonymous complex functions

---

---

## 21. Test Matrix & Regression Strategy

### 21.1 Test Matrix

Each page and component must be validated across the following dimensions:

| Area | Criteria | Tool / Method |

|----|----|----|

| Visual | Pixel-identical rendering | Screenshot diff / manual overlay |

| Layout | Responsive behavior unchanged | Viewport testing |

| CSS | No computed style deviation | DevTools comparison |

| JS | No runtime errors | Console audit |

| Animations | Same timing & easing | GSAP timeline inspection |

| SEO | Metadata & structure intact | SEO audit tools |

| Accessibility | WCAG compliance | Lighthouse / axe |

### 21.2 Regression Strategy

- Capture baseline screenshots before refactor

- Lock baseline computed styles

- Validate after each phase

- Any regression requires rollback before proceeding

---

## 22. Component Inventory Table

A complete inventory must be created before refactoring.

| Component Name | Page Usage | CSS Scope | JS Dependencies | Animation |

|----|----|----|----|----|

| Header | All pages | Global | Navigation logic | GSAP |

| Footer | All pages | Global | None | None |

| Service Card | Services | Component | MixItUp | Hover animation |

| Work Card | Portfolio | Component | MixItUp | Hover animation |

This table must be expanded to include **all UI components**.

---

## 23. Antigravity Command File (Ultra-Strict)

When executed via Antigravity, the following command protocol applies:

```

MODE: STRICT_ENGINEERING

UI_STATE: FROZEN

ALLOW_CREATIVE: FALSE

EXECUTION:

  - READ_SPEC
  - VALIDATE_CONSTRAINTS
  - EXECUTE_PHASES_SEQUENTIALLY
  - STOP_ON_AMBIGUITY
  - REPORT_DEVIATIONS

```

Antigravity must not proceed without explicit confirmation after each phase.

---

## 24. Change Control Process

Any change request must follow this process:

1. Identify change type (visual / technical / structural)
2. Evaluate impact against UI Freeze
3. Document justification
4. Obtain explicit approval
5. Apply change in isolated branch
6. Re-run full regression matrix

Unauthorized changes invalidate the specification.

---

**End of Specification Document**
