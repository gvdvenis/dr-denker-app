# Dr. Denker Image Puzzle Web App

A Vue 3 + Vite-based interactive image puzzle web application with zoom, pan, and thumbnail carousel capabilities.

## Features

- **5×8 Image Grid** - Browse puzzle pieces in a responsive grid layout
- **Interactive Zoom** - Click any image to zoom in with pinch/pan gesture support via panzoom
- **Thumbnail Carousel** - Swiper-based carousel for quick navigation when zoomed in
- **Solution Input** - Floating action button with modal for submitting solutions
- **GitHub Pages Deployment** - Automated CI/CD with GitHub Actions

## Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **TypeScript** - Type-safe JavaScript
- **Panzoom** - Image zoom and pan functionality
- **Swiper** - Touch-friendly carousel library
- **@vueuse/core** - Composition utilities
- **Vue Router** - Client-side routing

## Project Structure

```
src/
├── components/
│   ├── PuzzleGrid.vue          # 5×8 grid display
│   ├── ImageZoomView.vue       # Fullscreen zoom view with panzoom
│   ├── ThumbnailCarousel.vue   # Swiper carousel for thumbnails
│   └── SolutionButton.vue      # Floating solution input modal
├── App.vue                     # Root component
├── main.js                     # Vue app initialization with routing
└── style.css                   # Global styles

public/images/                  # Puzzle image assets (40 images)

.github/workflows/
└── deploy.yml                  # GitHub Actions deployment workflow
```

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

1. **Browse Grid** - Click on any puzzle piece to zoom in
2. **Navigate While Zoomed** - Use the thumbnail carousel at the bottom to switch images
3. **Zoom Controls** - Use pinch gestures or scroll wheel to zoom; drag to pan
4. **Submit Solution** - Click the "✓ Solution" button to submit your puzzle answer

## Configuration Notes

- Repository name: `dr-denker-app` (used in base URL)
- Images: 40 PNG files in `public/images/`
- Solution validation: Client-side only (customizable in `SolutionButton.vue`)

## License

MIT
