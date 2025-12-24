# Dr. Denker Image Puzzle Web App

🎮 **[Live Demo](https://gvdvenis.github.io/dr-denker-app/)**

A Vue 3 + Vite-based interactive image puzzle web application with smooth animations, zoom/pan capabilities, and an elegant thumbnail carousel.

## Features

- **Responsive Grid Layout** - Adaptive column counts (5×8, 4×10, 2×20) across all devices
- **Interactive Zoom Dialog** - Click any image to open full-screen zoom view with smooth fade-in animation
- **Pan & Zoom Controls** - Pinch, scroll, and drag gestures via panzoom with constrained bounds
- **Thumbnail Carousel** - Swiper-based carousel with auto-sizing and smooth centering
- **Cross-Fade Transitions** - Smooth image transitions when switching between puzzle pieces
- **Internationalization (i18n)** - Multi-language support (English/Dutch) with automatic detection
- **Solution Input** - Floating action button with modal for submitting solutions
- **Single-Page Architecture** - No routing, pure Vue state management with dialog overlays
- **GitHub Pages Deployment** - Automated CI/CD with GitHub Actions

## Technology Stack

- **Vue 3.4+** - Composition API with TypeScript
- **Vite 5** - Lightning-fast build tooling
- **vue-i18n 9** - Internationalization with automatic language detection
- **Panzoom 9.4** - Smooth image zoom and pan with bounds
- **Swiper 12** - Touch-friendly carousel with loop mode
- **CSS Transitions** - Native Vue transitions for animations

## Project Structure

```
src/
├── components/
│   ├── PuzzleGrid.vue          # Responsive grid (5×8, 4×10, 2×20 layouts)
│   ├── ImageZoomView.vue       # Full-screen zoom dialog with panzoom
│   ├── ThumbnailCarousel.vue   # Auto-sizing carousel with fixed heights
│   └── SolutionButton.vue      # Floating solution input modal
├── locales/
│   ├── index.ts                # i18n configuration and language detection
│   ├── en.json                 # English translations
│   └── nl.json                 # Dutch translations
├── App.vue                     # Root component with zoom state management
├── main.js                     # Vue app initialization with i18n
└── style.css                   # Global styles and transitions

public/images/                  # Puzzle image assets (40 images)

.github/workflows/
└── deploy.yml                  # GitHub Actions deployment workflow
```

## Architecture Highlights

- **Single-Page Application**: No routing library - uses Vue's reactive state and v-if for dialog management
- **Prop/Emit Pattern**: Components communicate via props and events, not route parameters
- **Smooth Animations**: Fade-in transitions for dialog opening, cross-fade for image switching
- **Internationalization**: Automatic language detection (URL → localStorage → browser → default 'en')
- **Fixed-Height Carousel**: 130px (desktop) / 90px (mobile) with explicit thumbnail sizing (100px / 60px)
- **Panzoom Reinitialization**: Disposes and recreates panzoom instance on image change to handle DOM transitions

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/dr-denker-app/`

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

The project is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Configuration

- **Base URL**: `/dr-denker-app/` (configurable in `vite.config.js`)
- **Deployment Target**: `gh-pages` branch
- **Build Output**: `dist/` folder

### Manual Deployment

1. Push to `main` or `master` branch
2. GitHub Actions automatically:
   - Installs dependencies
   - Builds the project
   - Deploys to GitHub Pages

## Usage

1. **Browse Grid** - Click on any puzzle piece to open the zoom dialog with fade-in animation
2. **Navigate While Zoomed** - Use the thumbnail carousel at the bottom to switch images with cross-fade
3. **Zoom & Pan** - Scroll/pinch to zoom; drag to pan (with bounds to keep image visible)
4. **Close** - Click the red ✕ button or press ESC to return to grid
5. **Submit Solution** - Click the "✓ Solution" button to submit your puzzle answer
6. **Switch Language** - Add `?lang=nl` or `?lang=en` to URL (persists in localStorage)

## Configuration Notes

- Repository name: `dr-denker-app` (used in base URL)
- Images: 40 PNG files in `public/images/`
- Solution validation: Client-side only (customizable in `SolutionButton.vue`)

## License

MIT
