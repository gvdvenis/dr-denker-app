# Plan: Crossword Solution System

This plan adds crossword puzzle functionality with answer tracking, validation, persistence, and a visual crossword overview matching the provided grid layout.

## Steps

### 1. Create data model and load answers.json
**Files:** `src/types.ts`, `src/composables/usePuzzleData.ts`

- Define `PuzzleAnswer` interface with `answerLength: number` and `solutionIndex: number`
- Define `UserSolution` interface with `imageId: number`, `answer: string`, `timestamp: number`
- Create composable to fetch `answers.json` at runtime (works in static hosting)
- Move answers.json from `images/` to `public/` directory for proper static serving

### 2. Add character count overlay to images
**Files:** `src/components/PuzzleGrid.vue`, `src/components/ImageZoomView.vue`

- Add character count badge to lower-left corner of each grid item
- Add same badge to zoom view image
- Style: small rounded badge with dark background, white text (e.g., "6" for 6-character answer)
- Position: `position: absolute; bottom: 8px; left: 8px;` with appropriate z-index

### 3. Implement localStorage persistence
**Files:** `src/composables/useLocalStorage.ts`

- Create composable for localStorage operations with reactive refs
- Key: `dr-denker-solutions` storing `UserSolution[]` array as JSON
- Methods: `saveSolution(imageId, answer)`, `getSolution(imageId)`, `getAllSolutions()`, `clearAll()`
- Auto-sync: watch for changes and persist automatically

### 4. Enhance SolutionButton with validation and persistence
**Files:** `src/components/SolutionButton.vue`

- Accept `imageId: number` and `expectedLength: number` props
- Accept `existingAnswer?: string` prop to pre-populate input
- Validate input length matches `expectedLength` before allowing submit
- Show error message if length mismatch (e.g., "Answer must be 6 characters")
- On submit: emit `submit(imageId, answer)` event (handled in App.vue to save to localStorage)
- Pre-fill input with existing answer if available

### 5. Add visual indicators for completed puzzles
**Files:** `src/components/PuzzleGrid.vue`

- Accept `solvedImages: Set<number>` prop containing IDs of solved images
- Add checkmark icon (✓) to lower-right corner of solved images
- Apply dim overlay: `opacity: 0.6` or grayscale filter on solved images
- Style checkmark: green circle badge with white checkmark, positioned next to character count

### 6. Create crossword overview component
**Files:** `src/components/CrosswordView.vue`

- Display 40 rows (one per puzzle)
- Each row: puzzle number + boxes for each character in answer (based on `answerLength`)
- Highlight `solutionIndex` box in each row with distinct color (matching green column in reference image)
- Fill in boxes with user's answers where available (uppercase letters)
- Empty boxes shown as outlined squares
- Vertical alignment: ensure all `solutionIndex` boxes align in same column
- Calculate max offset needed: `max(solutionIndex)` determines total width
- Responsive: scroll horizontally on mobile if needed

### 7. Wire up state management in App.vue
**Files:** `src/App.vue`

- Load puzzle data on mount using composable
- Load user solutions from localStorage
- Create `solutions: Ref<Map<number, string>>` to track answers by imageId
- Add `showCrossword: ref(false)` state for crossword view visibility
- Pass props down: character counts, existing answers, solved status to child components
- Handle solution submit event: save to localStorage and update solutions map
- Add floating action button (FAB) on main grid to open crossword view (e.g., grid icon)

### 8. Add crossword view toggle
**Files:** `src/components/PuzzleGrid.vue`

- Emit `open-crossword` event when FAB clicked
- FAB positioned top-right (opposite of close button), distinct icon (grid/crossword symbol)
- Style similar to existing buttons with different color scheme

## Further Considerations

1. **Loading states**: Show skeleton/spinner while `answers.json` loads?
2. **Answer correctness**: Validate against actual correct answers (not in current scope - needs answer key)?
3. **Export/import**: Allow users to backup/restore their solutions via JSON download/upload?
4. **Progress indicator**: Show "X/40 completed" on main grid?
5. **Crossword print view**: Add print-friendly CSS for crossword grid?

## User Stories Addressed

1. ✓ As a user I want to see the number of characters each answer has on the lower left corner of the picture (frame) in the grid and in the zoom preview as well. → **Step 2**
2. ✓ As a user I want to fill-in my answer in the "solution" entry dialog and have it added to the image solution model object. → **Steps 4, 7**
3. ✓ As a user I want to be able to store these answers in my browser, so that when i refresh or close the browser they don't get lost. → **Steps 3, 7**
4. ✓ As a user, I want the answer I entered to be visible in the solution input if I provided that earlier. → **Step 4**
5. ✓ As a user I want the image in the grid to reflect that I already provided a solution for an image by placing a check-mark and dimming. → **Step 5**
6. ✓ As a user I want to validate the number of characters I enter in the solution input against the expected character count. → **Step 4**
7. ✓ As a user I want to see an overview of my answers in a crossword-like overview. → **Steps 6, 7, 8**
