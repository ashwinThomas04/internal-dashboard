# CTA Components

This package provides a set of reusable Call To Action (CTA) components for consistent interactions across your project. All components follow unified behavior rules for active state, disabled state, loading state, sizing, and optional i18n content.

Available components:

- **PrimaryButton**
- **SecondaryButton**
- **GhostButton**
- **TextLink**

These components are designed to be used instead of raw HTML buttons or links to ensure consistent UX.

---

## Installation

Import components directly:

```tsx
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  TextLink
} from "qubriux-design-system/cta";

```

---

## Shared Props

All CTA components support a common set of props:

| Prop | Type | Description |
| --- | --- | --- |
| **id** | `string` | Identifier passed to click handlers. |
| **size** | `"lg"`, `"md"`, `"sm"` | Controls component size. |
| **isActive** | `boolean` | When `false`, disables the CTA. Default: `true`. |
| **isLoading** | `boolean` | Shows a loading state and prevents interaction. |
| **onClick** | `(id?: string) => void` | Triggered when active and not loading. |
| **onDisabledClick** | `(id?: string) => void` | Optional handler when disabled and clicked. |
| **children** | `ReactNode` | English content. |
| **es** | `ReactNode` | Spanish content. |
| **fr** | `ReactNode` | French content. |

---

## PrimaryButton

Used for primary actions such as submitting forms, saving data, or continuing to the next step.

### Basic Example

```tsx
<PrimaryButton onClick={() => save()}>
  Save
</PrimaryButton>

```

### Disabled Example

```tsx
<PrimaryButton
  isActive={false}
  onDisabledClick={() => alert("Disabled")}
>
  Continue
</PrimaryButton>

```

### Loading Example

```tsx
<PrimaryButton isLoading>
  Processing…
</PrimaryButton>

```

---

## SecondaryButton

Used for secondary or supporting actions such as "Cancel" or "Back".

```tsx
<SecondaryButton onClick={() => cancel()}>
  Cancel
</SecondaryButton>

```

---

## GhostButton

Used for low-emphasis or optional actions. Minimal styling.

```tsx
<GhostButton onClick={() => viewDetails()}>
  View Details
</GhostButton>

```

---

## TextLink

Used for navigation or inline CTAs.

### Navigation

```tsx
<TextLink to="/help">
  Help Center
</TextLink>

```

### Inline Action

```tsx
<TextLink onClick={() => openDialog()}>
  Learn More
</TextLink>

```

### With Translations

```tsx
<TextLink es={<>Ayuda</>} fr={<>Aide</>} to="/help">
  Help
</TextLink>

```

---

## Click Behavior

All CTA components follow the same logic:

- If active and not loading → `onClick(id)`
- If disabled and `onDisabledClick` is provided → `onDisabledClick(id)`
- If loading → no interactions occur

This prevents duplicate submissions and ensures controlled user flows.

---

## Recommended Usage Patterns

### Provide `id` when identifying items

```tsx
<PrimaryButton id={item.id} onClick={(id) => handleSelect(id)}>
  Select
</PrimaryButton>

```

### Use loading state during async actions

```tsx
<PrimaryButton isLoading={isSaving}>
  Save
</PrimaryButton>

```

### Provide feedback when disabled

```tsx
<PrimaryButton
  isActive={!formInvalid}
  onDisabledClick={() => notify("Please complete the form first")}
>
  Submit
</PrimaryButton>

```

---

## Common Mistakes to Avoid

- Do not use raw `<button>` or `<a>` tags for CTAs.
- Do not bypass built-in click logic.
- Do not manually override disabled or loading behavior.

---

## Example Layout

```tsx
<div class="d-flex">
  <PrimaryButton id="save" onClick={save}>Save</PrimaryButton>
  <SecondaryButton id="cancel" onClick={cancel}>Cancel</SecondaryButton>
  <GhostButton id="more" onClick={showInfo}>More Info</GhostButton>
  <TextLink to="/help">Help</TextLink>
</div>

```

---

## Summary

- CTA components ensure consistent behavior and appearance.
- All components share a unified API and interaction logic.
- Loading and disabled states are managed internally.
- Multilingual content is supported via `es`, and `fr`.
- Use these components instead of raw buttons or links for a consistent UI.