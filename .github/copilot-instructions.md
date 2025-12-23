# GitHub Copilot Instructions for Dr. Denker App

## CSS Architecture

This application uses a centralized theme system with CSS custom properties defined in `src/style.css`. All components should use these variables and utility classes instead of hard-coded values.

### Key CSS Variables:
- **Colors**: `--color-success`, `--color-danger`, `--color-info`, `--color-white`, etc.
- **Shadows**: `--shadow-success`, `--shadow-danger`, `--shadow-base`, etc.
- **Spacing**: `--spacing-md` (12px), `--spacing-2xl` (24px), etc.
- **Border Radius**: `--radius-pill` (50px), `--radius-lg` (12px), `--radius-circle` (50%)
- **Transitions**: `--transition-all`, `--transition-base`
- **Typography**: `--font-size-base`, `--font-weight-bold`, etc.

## Button Styling Guidelines

All buttons in this application should follow a consistent pill-shaped design pattern using the utility classes defined in `src/style.css`.

### Using Button Utility Classes:

**Preferred approach** - Use existing utility classes:
```html
<!-- Success/Primary button -->
<button class="btn-pill btn-success">Submit</button>

<!-- Danger/Error button -->
<button class="btn-pill btn-danger">Close</button>

<!-- Info button -->
<button class="btn-pill btn-info">Info</button>

<!-- Neutral button -->
<button class="btn-pill btn-neutral">Cancel</button>
```

### Standard Button Style (using CSS variables):
- **Border Radius**: `var(--radius-pill)` (50px)
- **Padding**: `var(--spacing-md) var(--spacing-2xl)` (12px 24px)
- **Font Size**: `var(--font-size-base)` (16px)
- **Font Weight**: `var(--font-weight-bold)`
- **Box Shadow**: `var(--shadow-success)` or `var(--shadow-danger)` or `var(--shadow-base)`
- **Box Shadow on Hover**: `var(--shadow-success-hover)` or `var(--shadow-danger-hover)` or `var(--shadow-md)`
- **Transform on Hover**: `translateY(-2px)`
- **Transition**: `var(--transition-all)` (all 0.3s ease)

### Custom Button Implementation (if utility classes cannot be used):
```css
.my-button {
  background: var(--color-success);
  color: var(--color-white);
  border: none;
  padding: var(--spacing-md) var(--spacing-2xl);
  border-radius: var(--radius-pill);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: var(--shadow-success);
  transition: var(--transition-all);
}

.my-button:hover {
  background: var(--color-success-dark);
  box-shadow: var(--shadow-success-hover);
  transform: translateY(-2px);
}
```

### Color Variants:
- **Success/Primary** (green): `--color-success`, `--color-success-dark`, `--shadow-success`, `--shadow-success-hover`
- **Danger/Error** (red): `--color-danger`, `--color-danger-dark`, `--shadow-danger`, `--shadow-danger-hover`
- **Info** (blue): `--color-info`, `--color-info-dark`, `--shadow-info`, `--shadow-info-hover`
- **Neutral** (gray): `--color-bg-lighter`, `--color-gray-lightest`, `--shadow-sm`, `--shadow-base`

When creating or modifying buttons, always use CSS variables and utility classes to maintain visual consistency and theming across the application.
