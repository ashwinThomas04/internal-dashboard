# Project Overview

This is a large-scale React-based Single Page Application (SPA), built specifically for an interactive dashboard or customer portal. The project utilizes a modular, layered architectural style that strictly separates structural orchestration, business logic, global state management, and presentational UI components. This promotes maximum code reusability, clear semantic boundaries, and reliable testing surfaces.

# Folder Structure Explanation

The foundation of the `/src/app` codebase is mapped directly into semantic roles:

- **`/components`**: Reusable, loosely-coupled ("dumb") UI components (e.g., `textInput`, `alerts`, `modal`, `avatar`). They control their own internal transient states (like focus or hover) but receive all data and behavioral callbacks via `props`. They do not fetch data and are oblivious to app routing.
- **`/container`**: Business-logic wrappers grouping multiple UI components into functioning modules tailored for specific features (e.g., `auth`, `home`, `loader`, `transactions`). This is where feature-level State and Context consumers connect.
- **`/context`**: Global multi-context providers (`authContext`, `configContext`) orchestrating state across the entire DOM tree via React Hooks (`useState`, custom reducers, custom access hooks).
- **`/routes`**: The centralized configuration declaring route paths and mappings to various container/screen layouts via `react-router`.
- **`/screens`**: Top-level page wrappers (e.g., `TestScreen`). These encapsulate specific routes, configuring broader layouts before yielding logic to inner `/container` files.
- **`/service`**: API abstraction, API boundary structures, messaging models, and static class helpers (e.g., `/classes/messages.tsx`, `/classes/validation.tsx`) defining how client data exchanges conform to the backend structure.
- **`/config`**: Application and environment structural mappings, API keys, and environment variables.
- **`/utils`**: Pure, decoupled helper functions categorized by domain (e.g., `basic.ts`, `dateTime.ts`, `id.ts`, `random.ts`, `url.ts`). These functions execute cleanly without React dependencies.
- **`/types`**: Cross-boundary TypeScript data contracts, interfaces, and models shared across the entire environment.
- **`/layout`**: Structural presentation wrappers orchestrating broad layout segments like navigational headers or sidebars applied across pages.

# Component Architecture Rules

- **Separation of Presentation and State**: All data retrieval and complex interaction orchestration must happen in `/container`. The UI representations reside exclusively in `/components`.
- **File Naming Conventions**: Files must adhere strictly to `camelCase` naming conventions (e.g., `textInput.tsx`, `authStorage.tsx`).
- **Component Formatting**: Exported React Components must be Functional Components using `PascalCase` syntax.
- **Props Patterns (Types \& Interfaces)**: Every component **must** interface explicitly via TypeScript prop definitions (e.g., `TextInputProps`).
- **Internationalization (i18n)**: All UI components natively handle localized strings via the `I18nContent` module. Components are engineered to accept either localized string objects (`{en: "", es: "", fr: ""}`) or literal strings.
- **Reusability Expectations**: Re-use existing Base UI elements (like Input wraps) before defining bespoke structures to unify style propagation.

# State & Data Flow

- **Global Context Architecture**: Shared configurations and user/auth contexts are hoisted at the application peak (`app.js` inside `AppWrapper`) through composed providers (`ConfigProvider`, `AuthProvider`, `AlertsProvider`, `ModalProvider`).
- **Data Flow Guidelines**: Data cascades downward into tree nodes via `Context.Consumer` custom hooks and explicitly passed down through `props` across component iterations. Mutation flow forces upward progression backward through callback functions (e.g. `onChange`, `onFocus`).

# Services & API Layer

- **Layer Boundaries**: Reusable schema validations and abstracted API messaging parameters live in `/service/classes/`. Functions here decouple JSON extraction and token inclusion so React Views never deal with manual `fetch()` API calls directly.
- **Abstraction Patterns**: `classes` directory separates domain-specific business abstractions to reduce container logic bloat. Data arriving in the container is already formatted, validated, and sanitized.

# Utilities

The `utils` layer serves purely functional operations preventing logic duplication throughout the React application.
- `url.ts`: URL formatting, safe path joining, parameter extractions.
- `random.ts`: Safe hashing, random value or string key generation.
- `id.ts`: Shared unique ID generator abstractions or evaluators.
- `dateTime.ts`: Consistent Unix or ISO timestamp parsers, avoiding duplicate JS `Date` methods.
- `basic.ts`: General operators, generic guards, and fundamental checks (e.g., empty string processing).

**Expectation**: Import these pure functions into any layer seamlessly to evaluate variables. Do not store components or state loops inside utilities.

# Code Patterns & Rules (CRITICAL)

Strict adherence to the following directives is required for all PRs and implementations:

1. **File Creation**: Never arbitrarily place files. If it renders pure UI, it goes in `/components`. If it connects UI with context or business logic, it goes in `/container`.
2. **Naming Conventions**: Use `camelCase` for directories and file names. Use `PascalCase` for component declarations. Use explicit TypeScript typings for all variables and props outputs. Avoid `any`.
3. **Import Structure**: Always import external modules (`react`, `react-router`) first, absolute environment assets second, and relative structural assets (`../components`) last.
4. **Separation of Concerns**: UI components are "Stateless" or local-state ONLY. UI structures **never** trigger unprompted XHR operations.
5. **Anti-Patterns**:
   - Building "God" Components: Do not combine all API actions and UI markup into giant files. Extract immediately to `/container` and `/components`.
   - **Inline Styles are FORBIDDEN**: Never pass inline objects `<div style={{...}}>`. All elements bind to existing CSS variables via `qb-` classes.

# How to Add New Features

Strict step-by-step enforcement to merge feature enhancements:

1. **Define Types (Optional but Preferred)**: Map expected data structures (APIs, Interfaces) within `/types` before scripting.
2. **Implement UI (`/components`)**: Audit existing UI. If it requires a tailored UI construct, implement it entirely isolated in `/components` using strictly TSX structures and `qb-` SCSS styles in `/styles/app/components`.
3. **Draft the Logic (`/container`)**: Wire the state, hook fetching strategies (`/service`), and React Context dependencies inside your feature boundary in `/container`.
4. **Implement App Routing (`/routes` & `/screens`)**: Provide route mappings and embed the container logic into the layout scaffolding assigned in `/screens`.
5. **Test Modularity**: Confirm `I18nContent` strings handle correctly to match app translation requirements.
