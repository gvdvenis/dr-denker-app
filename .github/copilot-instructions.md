# GitHub Copilot Instructions for Dr. Denker App

## Button Styling Guidelines

All buttons in this application should follow a consistent pill-shaped design pattern. Reference the button styling in `src/components/ImageZoomView.vue` as the canonical example.

### Standard Button Style:
- **Border Radius**: `50px` (pill shape)
- **Padding**: `12px 24px`
- **Font Size**: `16px`
- **Font Weight**: `bold`
- **Box Shadow**: `0 4px 12px rgba(0, 0, 0, 0.2)` (base state)
- **Box Shadow on Hover**: `0 6px 16px rgba(0, 0, 0, 0.3)`
- **Transform on Hover**: `translateY(-2px)`
- **Transition**: `all 0.3s ease`

### Color-Specific Shadows:
- **Green buttons** (e.g., Submit, Solution): Use `rgba(76, 175, 80, 0.4)` for base, `rgba(76, 175, 80, 0.6)` for hover
- **Red buttons** (e.g., Close, Cancel): Use `rgba(244, 67, 54, 0.4)` for base, `rgba(244, 67, 54, 0.6)` for hover
- **Neutral buttons**: Use `rgba(0, 0, 0, 0.15)` for base, `rgba(0, 0, 0, 0.25)` for hover

### Example Implementation:
```css
.my-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
  transition: all 0.3s ease;
}

.my-button:hover {
  background: #45a049;
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.6);
  transform: translateY(-2px);
}
```

When creating or modifying buttons, always apply this styling pattern to maintain visual consistency across the application.
