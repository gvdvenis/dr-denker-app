## Plan: Vue 3 + Vite Image Puzzle Web App

**TL;DR:** Initialize a Vue 3 + Vite project with panzoom for image zooming, Swiper for thumbnail carousel, and deploy to GitHub Pages. The app will display a 5×8 image grid, allow click-to-zoom with pinch gestures, show a thumbnail strip when zoomed in, and include a floating solution input button.

### Steps

1. Initialize Vue 3 + Vite project with `npm init vite@latest`, select Vue + TypeScript, install core dependencies (panzoom, swiper, @vueuse/core), and move images to `public/images/`.

2. Create [PuzzleGrid.vue](src/components/PuzzleGrid.vue) component displaying 5 columns × 8 rows using CSS Grid with clickable image tiles.

3. Create [ImageZoomView.vue](src/components/ImageZoomView.vue) component handling fullscreen image display with panzoom for pinch/zoom gestures.

4. Create [ThumbnailCarousel.vue](src/components/ThumbnailCarousel.vue) using Swiper library to show miniature images at bottom when zoomed in.

5. Create [SolutionButton.vue](src/components/SolutionButton.vue) as floating action button with modal to enter puzzle solution.

6. Set up [vite.config.js](vite.config.js) with `base: '/dr-denker-app/'` and configure `public/` folder for static images.

7. Create GitHub Actions workflow (`.github/workflows/deploy.yml`) to auto-build and deploy `dist/` to gh-pages branch.

### Further Considerations

1. **Base URL & repo name:** Confirm your GitHub/GitLab repo name is `dr-denker-app`—if deploying to a user/org page instead, set `base: '/'` in Vite config. **Recommendation:** Keep repo name as is.

2. **TypeScript vs JavaScript:** Subagent included TypeScript; confirm if you prefer plain JavaScript instead for simpler setup. **Recommendation:** Use TypeScript for type safety with puzzle data.

3. **Solution storage & validation:** Plan how solutions are validated (local check, server-side validation, or just client-side display). **Recommendation:** Start with local validation to keep it static-friendly.

### Technology Stack

**Core:**
- Vue 3 + Vite (development and build)
- TypeScript (type safety)

**Libraries:**
- `panzoom` - Image zoom/pan functionality
- `swiper` - Thumbnail carousel at bottom
- `@vueuse/core` - Vue composition utilities

**Deployment:**
- GitHub Pages (static hosting)
- GitHub Actions (CI/CD)

### Key Package.json Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5",
    "vite": "^5",
    "vue": "^3",
    "@vitejs/plugin-vue": "^5"
  },
  "dependencies": {
    "panzoom": "^9",
    "swiper": "^11",
    "@vueuse/core": "^10"
  }
}
```

### Vite Configuration

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/dr-denker-app/',
  build: {
    target: 'es2020',
    minify: 'terser'
  }
})
```

### GitHub Pages Deployment

- Images placed in `public/images/` (copied to build output)
- Build output to `dist/` folder
- CI/CD workflow deploys to `gh-pages` branch
- Hash-based routing if needed for multi-page setup
