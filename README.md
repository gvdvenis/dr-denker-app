# Dr. Denker Image Puzzle Web App

🎮 **[Live Demo](https://gvdvenis.github.io/dr-denker-app/)**

A Vue 3 Progressive Web App for interactive image puzzles with zoom/pan capabilities, crossword solution grid, and multi-language support.

## Features

- **Single-Page Architecture** - No router, dialog-based navigation with Vue state management
- **Progressive Web App** - Installable, offline support, auto-updates
- **Internationalization** - English/Dutch with URL/localStorage/browser detection
- **Responsive Design** - Adaptive layouts (5×8, 4×10, 2×20) across all devices
- **Image Optimization** - Automated WebP conversion with Sharp on build
- **Crossword Grid** - View all puzzle solutions with progress tracking
- **Smooth Animations** - Fade transitions and panzoom with gesture support

## Technology Stack

- **Vue 3.4+** with Composition API and TypeScript
- **Vite 5** with PWA plugin (workbox service worker)
- **vue-i18n 9** for internationalization
- **Panzoom 9.4** for zoom/pan gestures
- **Swiper 12** for thumbnail carousel
- **Sharp** for automated image optimization

## Project Structure

```
src/
├── components/         # PuzzleGrid, ImageZoomView, CrosswordView, etc.
├── composables/        # usePuzzleData, useLocalStorage
├── locales/            # i18n config (en.json, nl.json)
├── App.vue            # Root component with state management
├── main.js            # Vue initialization
├── style.css          # Global theme (CSS custom properties)
└── types.ts           # TypeScript interfaces

public/
├── images/            # Optimized WebP images (40 puzzles)
├── icons/             # PWA icons (auto-generated)
└── answers.json       # Puzzle metadata (answerLength, solutionIndex)

scripts/
├── optimize-images.js    # Automated WebP conversion
└── generate-pwa-icons.js # PWA icon generation

.github/workflows/deploy.yml  # GitHub Actions CI/CD
```

## Getting Started

### Prerequisites
- **Node.js 18+** (for Sharp native bindings)
- **npm** or yarn

### Installation

```bash
git clone https://github.com/gvdvenis/dr-denker-app.git
cd dr-denker-app
npm install
```

### Development

```bash
npm run dev
```

Development server runs at `http://localhost:5173/dr-denker-app/`

- Hot module replacement (HMR) enabled
- Automatic image optimization on startup
- Service worker disabled in development

### Available Scripts

#### `npm run dev`
Starts the Vite development server with hot module replacement (HMR).
- Automatically runs image optimization on startup (cached, won't re-process existing WebP files)
- Exposes server on local network with `--host` flag (accessible from mobile devices in your network)
- Service worker disabled in development mode
- URL: `http://localhost:5173/dr-denker-app/`

**When to use**: Daily development, testing changes locally

#### `npm run build`
Creates optimized production build in `dist/` folder.
- Runs image optimization before build (respects cache)
- Generates service worker with workbox (PWA)
- Minifies JavaScript/CSS with terser
- Outputs PWA manifest and icons
- Suitable for deployment to any static hosting

**When to use**: Before deployment, testing production build locally

#### `npm run preview`
Serves the production build locally for testing.
- Must run `npm run build` first
- Tests PWA features (service worker, offline mode)
- Validates production behavior before deploying

**When to use**: After building, to verify production behavior

#### `npm run optimize-images`
Converts source images to WebP format using Sharp.
- **Smart Caching**: Only processes images that don't already have WebP equivalents
- Checks modification timestamps to detect changed source images
- 90% quality WebP output, maintains aspect ratios
- Runs automatically with `dev` and `build` commands

**When to use**: Rarely needed manually (runs automatically)

#### `npm run force-optimize`
Forces re-optimization of ALL images, ignoring cache.
- Clears the optimization cache
- Re-processes all source images to WebP
- Useful after changing optimization settings or when original images have been added/updated

**When to use**: 
- After updating image optimization settings
- When WebP files appear corrupted
- When switching between different Sharp versions
- After adding new source images

#### `npm run generate-icons`
Generates PWA icons in multiple sizes from a source image.
- Outputs: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- Target folder: `public/icons/`
- Requires source icon file configured in script

**When to use**: After changing the app icon/logo

---

**Image Optimization Details:**

The `optimize-images` script intelligently handles image conversion:

1. **First Run**: Converts all images in `public/images/` to WebP
2. **Subsequent Runs**: Skips images that already have WebP files with newer timestamps
3. **Changed Images**: Re-processes if source file is newer than WebP file
4. **Performance**: Avoids redundant processing, speeds up development builds

**Cache Behavior:**
- ✅ **Does NOT overwrite** existing WebP files by default
- ✅ Compares source and output timestamps
- ✅ Only re-processes when source is modified
- ❌ Use `force-optimize` to bypass cache and reprocess everything

### Build Output

```bash
npm run build
```

Generates:
- `dist/` - Production build
- `dist/sw.js` - Service worker
- `dist/manifest.webmanifest` - PWA manifest
- Optimized WebP images in `public/images/`

### Testing Language Switching

- English: `http://localhost:5173/dr-denker-app/?lang=en`
- Dutch: `http://localhost:5173/dr-denker-app/?lang=nl`

Language preference persists in localStorage (`dr-denker-language` key).

## Deployment

### Live Application

🌐 **Production**: [https://gvdvenis.github.io/dr-denker-app/](https://gvdvenis.github.io/dr-denker-app/)

### Automated Deployment (GitHub Actions)

Deployment triggers on push/PR to `main` or `master` branch:

1. **Build**: `npm run build` (includes image optimization)
2. **Deploy**: Publishes `dist/` to `gh-pages` branch
3. **Live**: Available within 1-2 minutes at GitHub Pages URL

Workflow file: `.github/workflows/deploy.yml`

### Configuration

**vite.config.js**:
```javascript
base: '/dr-denker-app/'  // Repository name (must match GitHub repo)
```

**Important**: If you fork/rename the repository, update `base` in `vite.config.js` to match your repo name.

### Manual Deployment

Not typically needed, but possible via:
```bash
npm run build
# Deploy dist/ folder to hosting provider of choice
```

## Key Files & Configuration

| File | Purpose |
|------|---------|
| `vite.config.js` | Base URL, PWA config, build settings |
| `public/answers.json` | Puzzle metadata (40 entries) |
| `src/locales/` | Translation files for i18n |
| `src/composables/` | Reusable logic (puzzle data, localStorage) |
| `src/types.ts` | TypeScript interfaces |
| `scripts/` | Build-time utilities (image optimization, icon generation) |

## Development Notes

- **State Management**: Centralized in `App.vue` (no router, no Vuex/Pinia)
- **CSS Theme**: All colors/spacing/shadows in `src/style.css` as CSS custom properties
- **LocalStorage**: User solutions stored in `dr-denker-solutions` key
- **Image Format**: WebP (auto-converted from source images on build)
- **PWA**: Auto-updates via service worker, shows toast notification

## License

MIT
