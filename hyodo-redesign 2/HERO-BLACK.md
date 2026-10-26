# Home hero: the black around HYODO

**Decision:** ship option **09, Ghost reel + soft light leak**. Reference:
`design/HeroBlack.dc.html` (the full-width frame at the top) and `design/Main.dc.html`
(the hero, with `ghostReel` and `lightLeak` on and `leakIntensity` 0.45).
Options 01–08 on that board are explorations only. Don't build grain, halation, flare or
the viewfinder.

This adds two layers to the existing "reel through the letters" hero (see HANDOFF.md,
Animations 1). Don't change the mask, the word or the scroll maths. Only add layers.

## Layer order (inside the sticky hero stage)

1. Reel video (existing). Full bleed, `object-fit: cover`.
2. Black mask with the white "HYODO", `mix-blend-mode: multiply` (existing).
3. **Ghost reel** (new).
4. **Light leak** (new).
5. Header, captions and the "Watch the full reel" button (existing; keep them on top).

Both new layers are `aria-hidden`, `pointer-events: none` and `overflow: hidden`, and sit
at `inset: 0` of the stage.

## Scroll coupling

Both new layers multiply their opacity by the same `maskOpacity` the black mask already
uses (`1 − clamp((p − 0.4) / 0.4)`), so they vanish together with the black by p = 0.8.
Drive it with one CSS custom property (e.g. `--mask`) set from the existing scroll handler,
not a React re-render per frame.

## 1. Ghost reel

The footage shows faintly through the black: blurred, colorless, slightly overscanned.

- Wrapper: `mix-blend-mode: screen; opacity: calc(0.3 * var(--mask))`.
- Media: a second, muted `<video>` of the **same reel** (autoplay, loop, muted,
  playsinline), positioned `inset: -6%; width: 112%; height: 112%; object-fit: cover;
  filter: blur(28px) grayscale(1)`.
- Keep it in sync with the main reel: start both together; on the main video's `play`,
  `seeked`, and about every 5s, if `|ghost.currentTime − main.currentTime| > 0.15`, set
  the ghost's time to match. Exact sync doesn't matter much at this blur, but cuts should
  line up.
- **Performance:** if Sanity can serve a smaller rendition (or a separate low-res
  proxy, ~640px wide), use it for the ghost. For a cheaper blur, render the ghost video at
  25% size with `blur(7px)` and `transform: scale(4)` instead of a full-size `blur(28px)`.
  Pause the ghost when the hero is off-screen (IntersectionObserver) or when `--mask`
  reaches 0.

## 2. Soft light leak

Warm red-orange light drifts in from the top-left and bottom-right corners and slowly
breathes.

- Wrapper: `mix-blend-mode: screen; opacity: calc(var(--leak-intensity, 0.45) *
  var(--mask))`. Make 0.45 a single constant so it's easy to tune.
- Inner wrapper (breathing): animate opacity between **0.6 and 1.0**, ease-in-out,
  ~**6.3s** per cycle, infinite.
- Blob A (top-left): `width: 75%` of the stage, `aspect-ratio: 1`, circle, placed
  `left: -30%; top: -45%`, background
  `radial-gradient(circle, rgba(220,72,28,0.75) 0%, rgba(138,20,20,0.5) 38%, rgba(138,20,20,0) 70%)`.
  It drifts about ±6% of the stage width horizontally (~33s period) and ±5% of the
  height vertically (~43s period), ease-in-out, alternating.
- Blob B (bottom-right): `width: 60%`, `aspect-ratio: 1`, circle, placed
  `left: 66%; top: 38%`, background
  `radial-gradient(circle, rgba(240,150,40,0.5) 0%, rgba(160,40,20,0.3) 40%, rgba(160,40,20,0) 70%)`.
  It drifts about ±5% horizontally (~27s) and ±6% vertically (~30s).
- The mockup also blurs the blobs with `filter: blur(60px)`. In production, **drop the
  filter** and extend each gradient's last stop to ~78% for the same softness: big CSS
  blurs are expensive. Animate only `transform` and `opacity` (CSS keyframes, not JS).

## Reduced motion

With `prefers-reduced-motion: reduce`: no blob drift and no breathing (hold the inner
wrapper at opacity 0.8), and the ghost follows whatever the main reel does in that mode.

## Mobile

Same two layers on the 720px mobile hero stage. The percentages scale on their own. Use
the low-res ghost source on mobile for sure.

## Done when

- At the top of Home, footage plays sharp through the letters, with soft colorless
  footage and a slow warm glow in the black around them.
- Scrolling grows the word and lifts the black, and the ghost and leak fade out with it.
  By the time the full reel is showing, neither is visible.
- No extra layout shift, no jank while scrolling, and Lighthouse performance doesn't
  drop noticeably compared with before this change.
