# GitHub Copilot Instructions for Dr. Denker App

## Application Architecture

### Single-Page Application (SPA) Design
This application uses a **single-page architecture** without Vue Router. All navigation is handled through component state management and dialog overlays.

**Key Architectural Decisions:**
- **No Vue Router**: Simplified architecture using pure Vue state management
- **Dialog Pattern**: Views like `ImageZoomView` and `CrosswordView` are rendered conditionally with `v-if` based on App.vue state
- **URL Stability**: No URL changes during navigation - provides cleaner UX for image browsing
- **Prop/Emit Communication**: Components use props for data down, events for actions up
- **Transition Components**: Uses Vue's `<Transition>` with `zoom-fade` for smooth dialog animations

### Component Structure

**Main Components:**
1. **App.vue** - Root component managing application state
   - State: `showZoom`, `showCrossword`, `selectedImageId`
   - Loads puzzle data and solutions on mount
   - Syncs i18n locale with HTML attributes

2. **PuzzleGrid.vue** - Responsive image grid
   - Adaptive layouts: 5×8 (desktop), 4×10 (tablet/mobile), 2×20 (small phones)
   - Displays character count badges and solved indicators
   - Emits: `selectImage`, `openCrossword`

3. **ImageZoomView.vue** - Full-screen image zoom dialog
   - Panzoom integration for pinch/zoom/pan gestures
   - ThumbnailCarousel for navigation
   - SolutionButton for answer submission
   - Emits: `close`, `changeImage`, `submitSolution`

4. **CrosswordView.vue** - Crossword solution grid
   - Displays all 40 puzzle solutions in grid format
   - Vertical alignment of solution letters
   - Progress tracking (X/40 solved)
   - Emits: `close`

5. **ThumbnailCarousel.vue** - Swiper-based image carousel
   - Fixed heights: 130px (desktop), 90px (mobile)
   - Auto slides-per-view for dynamic sizing
   - Automatic centering on selection changes

6. **SolutionButton.vue** - Floating action button with modal
   - Character-count aware input validation
   - Pre-fills existing answers for editing

7. **UpdateToast.vue** - PWA update notification
   - Auto-hides after 5 seconds
   - Displays when service worker updates

### State Management

**Centralized State in App.vue:**
```vue
// Dialog visibility states
const showZoom = ref(false)
const showCrossword = ref(false)
const selectedImageId = ref(1)

// Data from composables
const { puzzleData, loadPuzzleData, getPuzzleAnswer } = usePuzzleData()
const { solutions, loadSolutions, saveSolution } = useLocalStorage()
```

**State Flow:**
- User clicks image in PuzzleGrid → `selectImage` event → App updates `selectedImageId` and `showZoom`
- User clicks crossword button → `openCrossword` event → App updates `showCrossword`
- Dialog emits `close` → App sets visibility to `false`

### Composables Architecture

**usePuzzleData** (`src/composables/usePuzzleData.ts`):
- Loads `public/answers.json` with puzzle metadata
- Provides: `puzzleData`, `isLoading`, `error`, `loadPuzzleData()`, `getPuzzleAnswer()`
- Returns array of `PuzzleAnswer` objects with `answerLength` and `solutionIndex`

**useLocalStorage** (`src/composables/useLocalStorage.ts`):
- Manages user solutions persistence in localStorage
- Storage key: `dr-denker-solutions`
- Uses `Map<number, UserSolution>` for efficient lookups
- Provides: `solutions`, `loadSolutions()`, `saveSolution()`, `getSolution()`, `clearAllSolutions()`
- Automatically persists changes to localStorage

**TypeScript Types** (`src/types.ts`):
```typescript
interface PuzzleAnswer {
  answerLength: number    // Number of characters in answer
  solutionIndex: number   // Position of letter used in final solution (0-based)
}

interface UserSolution {
  imageId: number        // 1-40
  answer: string         // Uppercase answer text
  timestamp: number      // Unix timestamp
}
```

### Data Structure

**answers.json Format:**
```json
[
  {"answerLength": 4, "solutionIndex": 2},
  {"answerLength": 6, "solutionIndex": 0},
  // ... 40 entries total
]
```

- Array index corresponds to imageId - 1 (zero-based)
- `answerLength`: Validates solution input length
- `solutionIndex`: Determines which letter contributes to the vertical crossword solution

### Animation System

**Transition Classes:**
- `.zoom-fade-enter-active` / `.zoom-fade-leave-active`: 300ms/200ms opacity transitions
- Applied to ImageZoomView and CrosswordView dialogs
- Eliminates flashing when opening/closing views

**Panzoom Reinitialization:**
- Panzoom instance is disposed and recreated when images change (350ms delay)
- Allows smooth cross-fade transitions between images
- Uses `<TransitionGroup>` with `:key="imageId"` for automatic animation

### Progressive Web App (PWA)

**Features:**
- **Vite PWA Plugin**: Generates service worker with workbox
- **Manifest**: Configured in `vite.config.js` with app name, icons, theme colors
- **Offline Support**: Caches assets (images, scripts, styles, JSON)
- **Update Notifications**: UpdateToast component shows when new version available
- **Installable**: Can be installed on mobile and desktop devices

**Service Worker:**
- Auto-update strategy with user notification
- Caches up to 5MB files
- Runtime caching for Google Fonts and external resources

### Image Optimization

**Automated WebP Conversion:**
- Script: `scripts/optimize-images.js` (uses Sharp library)
- Runs automatically on `npm run dev` and `npm run build`
- Converts images to WebP format at 90% quality
- Maintains aspect ratios
- Caches results to avoid redundant processing

**PWA Icons Generation:**
- Script: `scripts/generate-pwa-icons.js`
- Generates all required icon sizes (72px to 512px)
- Outputs to `public/icons/`

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

All buttons should use utility classes from `src/style.css`:

```html
<button class="btn-pill btn-success">Submit</button>  <!-- Primary/Success -->
<button class="btn-pill btn-danger">Close</button>    <!-- Error/Danger -->
<button class="btn-pill btn-info">Info</button>       <!-- Info -->
<button class="btn-pill btn-neutral">Cancel</button>  <!-- Neutral -->
```

**If custom implementation needed:** Use CSS variables (`var(--radius-pill)`, `var(--color-success)`, `var(--shadow-success)`, etc.) and apply hover effects with `translateY(-2px)` and `var(--transition-all)`.

