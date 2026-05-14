# Styling System Overview

The styling architecture enforces high performance, minimal duplication, and predictable scoping across the entire codebase utilizing SCSS. It strictly demarcates logic into two domains:

1. **Base Platform (`/styles/base`)**: System-level utility configurations inspired by Bootstrap layouts. This layer processes grid environments, dimensions, spacers, margins, generic display flags, and responsive loops. **It is globally READ-ONLY.**
2. **Application Skin (`/styles/app`)**: Tailored implementations that inject the actual aesthetic themes, components, and module features, guaranteeing exact visual match. 

**Philosophy (Reuse-First)**: Never recreate CSS that exists. Assemble designs matching atomic Base utilities (e.g. `d-flex h-100 p-2`) and supplement with customized module overrides exclusively prefixing rules with `qb-`. 

---

# Base Utilities (Base Platform / Read-Only)

All foundational spacing, alignment, and grid values map to predictable class syntax derived from `$spacers` loops. These must be used for structural scaffolding:

### Layout (Display & Grid)
- **Container**: `container`, `container-fluid`, `container-{sm|md|lg|xl}`
- **Row/Columns**: `row`, `col-{infix}-{size}`
- **Display**: `d-*` (inline, inline-block, block, grid, flex, none)
- **Flexbox**: `flex-*` (row, column, wrap, grow-1, shrink-0)
- **Alignments**: `justify-content-*` (start, end, center, between, around), `align-items-*`, `align-content-*`, `align-self-*`
- **Visibility**: `overflow-*`, `overflow-x-*`, `overflow-y-*` (auto, hidden, visible, scroll)

### Spacing (Margin & Padding)
Steps scale from `0` to `6` or `-auto`. Infixed breakpoints dynamically scale padding/margins.
- **Margins**: `m-*` (all), `mx-*` (left/right), `my-*` (top/bottom)
- **Directional Margins**: `mt-*` (top), `mb-*` (bottom), `ms-*` (start/left), `me-*` (end/right)
- **Paddings**: `p-*` (all), `px-*`, `py-*`
- **Directional Paddings**: `pt-*`, `pb-*`, `ps-*`, `pe-*`
- **Gaps**: `gap-*`

### Sizing (Width & Height)
- **Widths**: `w-100`, `w-80`, `w-60`
- **Viewports**: `vw-100` (100svw), `vh-100` (100svh), `mvh-100` (min height 100svh)
- **Heights**: `h-100`

### Typography & Interactions
- **Alignment**: `text-*` (start, end, center, inherit)
- **Decoration/Transitions**: `text-decoration-*` (none, underline, line-through), `text-transform-*`, `white-space-wrap`, `word-wrap-break`
- **Interactions**: `pointer-*` (none, auto), `user-select-*` (all, auto, none)

---

# Custom Styles (Application Layer: `styles/app`)

All proprietary designs exist independently and isolate collisions using the `.qb-*` prefix. 

### Globals & Wrappers (`_style.scss`)
- `.qb-app-wrapper`: Top-level framework enforcement map.
- `.qb-page-loader`: Universal loading overlay.
- `.qb-text-truncate`: Proprietary ellipses truncations.
- `.qb-file-input-btn`: Default file handling inputs.

### Generated Theme Properties (`_loops.scss`)
Variables generated iteratively from theme configurations mapping colors and fonts:
- **Colors**: `.qb-bg-*`, `.qb-text-*`, `.qb-stroke-*`, `.qb-fill-*`
- **Radii/Borders**: `.qb-br-*` (Border radii sizes), `.qb-border-*`
- **Gradients**: `.qb-bg-*-grad` 
- **Typography Sizing**: `.qb-fs-*` (Font scale sizing), `.qb-fw-*` (Font weights)
- **Surfaces**: `.qb-shadow-*` (Shadow loops)
- **Z-Index**: `.qb-z-*`

### UI Components (`app/components`)
- **Inputs**: `.qb-input-wrap`, `.qb-text-input`, `.qb-input-container`, `.qb-input-placeholder`, `.qb-input-prefix`.
- **Alerts**: `.qb-toast-wrapper`, `.qb-toast-container`, `.qb-toast-visible`, `.qb-toast-indicator`, `.qb-toast-bg`.
- **Modals**: `.qb-modal-open`, `.qb-modal-backdrop`, `.qb-modal-container`, `.qb-modal-dialog-wrapper`.
- **Phone Mockup Tools**: `.qb-phone-mockup-wrapper`, `.qb-phone-mockup-container`, `.qb-phone-mockup-outer-skin`, `.qb-phone-mockup-notch`, `.qb-phone-mockup-content-wrap`.
- **Surfaces**: `.qb-surface-paper-wrapper`.
- **Interactions**: `.qb-draggable-wrapper`, `.qb-dragging-element`.

### Feature Containers (`app/container`)
Container-specific overriding isolated to prevent page bleeding:
- **Auth Features**: Scoped via `.qb-auth-*` patterns if present in `_auth.scss`.
- **Home Layouts**: Scoped via `.qb-home-*` properties from `_home.scss`.

---

# Global Rules (Strict Constraints)

Failure to abide by these styling standards immediately breaches UI integrity requirements:

1. **Always reuse base classes first**: Do not write `display: flex; flex-direction: column` in SCSS. Implement `d-flex flex-column` inside the React `.tsx` wrapper instead.
2. **Restrict Prefix Injections**: Every custom class attached to SCSS rule blocks **must** commence with the target prefix: `qb-`. 
3. **NO INLINE STYLES EVER**: Utilizing `style={{}}` tags inside React components is universally prohibited. 
4. **Follow Theme Variables Strategy**: Static raw colors (e.g., `#000` or `#FEFEFE`) are expressly forbidden. All hex variables track rigidly against loops via generic `.qb-bg-*` logic to inherit CSS variables globally.

---

# How to Create New Styles

**Decision Workflow**: Before assigning a new class directly to SCSS:
1. **Check Base Utilities**: Do your positioning and dimension targets exist via generic grid layouts (`w-100 p-2 d-flex`)? If yes, map to `<div className="w-100 p-2 d-flex">`.
2. **Check the Loops System**: Do you require a specific brand color, bold weight, shadow, or established border sizing? Inherit those rules natively through combinations (`qb-text-primary qb-fw-semi-bold qb-br-4`).
3. **Create Extracted Rules**: Did mapping the above fail due to highly custom UX patterns (animations, deep nesting targeting, pseudo hover/active rules)? 
    - Create a distinct SCSS file if a structural domain expands dramatically (`_feature.scss`).
    - Namespace universally inside `styles/app/container` (business-feature) or `styles/app/components` (re-usable widgets).
    - Class nomenclature maps strictly linearly: `.qb-{domain}-{variant}-{element}`.
