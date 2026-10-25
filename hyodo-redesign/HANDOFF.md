# Hyodo Productions — Redesign handoff

This folder is the approved redesign for hyodoproductions.com. Rebuild the site's
presentation layer to match it while keeping the existing backend untouched.

## Ground rules

- **Keep all existing plumbing**: the Sanity client and queries, data fetching, routing,
  image/video URL helpers, and the contact form's submit logic. Replace only markup,
  styles and page composition.
- **Use real content from Sanity**, never hard-coded copies of it. Project titles,
  client/artist names, categories, thumbnails, videos, stills and the BTS gallery
  already exist in the CMS. If a field the design needs doesn't exist, stop and list it
  rather than inventing one.
- Work page by page, run the dev server after each, and don't deploy or push.
- The `design/*.dc.html` files are reference mockups. Inline styles carry the exact
  values; the `<script type="text/x-dc">` block at the bottom of each file holds the
  animation logic. Translate them into the project's own components and styling
  approach. Don't copy the mockup runtime (`support.js`, `<x-dc>`, `<sc-for>`, `{{…}}`).

## Pages

| Route | Desktop mockup | Mobile mockup |
|---|---|---|
| `/` Home | `design/Main.dc.html` | `design/MobileHome.dc.html` |
| `/work/:slug` Project | `design/Project.dc.html` | `design/MobileProject.dc.html` |
| `/about` About (new standalone page) | `design/About.dc.html` | `design/MobileAbout.dc.html` |
| `/contact` Contact | `design/Contact.dc.html` | `design/MobileContact.dc.html` |
| Mobile menu (overlay) | — | `design/MobileMenu.dc.html` |

`design/HeroStates.dc.html` shows the three key frames of the home hero animation.
`design/KoreanType.dc.html` shows the 효도 font options.

Mobile layout applies below ~768px. Desktop content max-width is 1600px with side
padding `clamp(16px, 3vw, 40px)` (16px on mobile).

## Design tokens

**Color**
- White `#FFFFFF` (page ground), Ink `#0A0A0A` (text, rules, dark sections)
- Greys: `#444444` body on white, `#6E6E6E` labels/meta on white, `#9A9A9A` labels on
  black, `#BDBDBD` body on black, `#D0D0D0` idle chip border, `#E2E2E2` light hairline,
  `#333333` hairline on black
- Accent red `#8A1414` (the live site's red). Use sparingly: category marker square and
  category text, active nav underline, About 효도, discipline numbers, the
  "authentic human stories" highlight, "lasting." on Contact. Never as small text on black
  (fails contrast).

**Type**
- Latin: **Inter Tight** (Google Fonts) 400 / 500 / 600 / 900. Headlines 900 with
  letter-spacing around -0.05em and line-height ~0.9; labels 11–13px uppercase,
  letter-spacing 0.14em.
- Korean 효도 on About: **Gaegu Light (300)** is the current pick. Alternatives on the
  About page's font switcher: Hi Melody, Gowun Batang, Nanum Pen Script. Ask Peter which
  one is final before shipping.
- Square corners everywhere (border-radius 0), except the round play-button rings.

## Components

- **Header**: `HYODO` wordmark (14px, 600, letter-spacing 0.24em) left; Work / About /
  Contact right. The active page gets a 2px red underline offset 8px. On Home it sits
  white over the hero. On mobile it's the wordmark plus a two-line hamburger (44×44) that
  opens the full-screen black menu.
- **Footer** (all pages; see the Home mockup): large lowercase "hyodo" wordmark left,
  Menu and Connect columns right, then a hairline and the copyright line
  ("© 2026 Hyodo Productions — Led by story. Crafted to last." / "Los Angeles /
  Worldwide"). White with a top rule on Home, Project and Contact; **black** on About.
  Swap the typed "hyodo" for the existing logo SVG asset.
- **Project tile** (Home list): full-width image at 2.39:1 on desktop and 4:5 on mobile,
  then title (600, ~64px), meta line "■ CATEGORY / NAME" (red square, red category) and an
  "01 / 05" counter on the right.
- **Category filter**: All / Commercial / Music Video / Short Film as square chips (44px
  min height). Active is filled black. Filtering re-numbers the counters.

## Animations

All scroll effects key off scroll progress and must respect
`prefers-reduced-motion: reduce` (show the final state, no motion).

1. **Home hero, "reel through the letters"**: a section 2.6× the viewport tall with a
   sticky viewport-high stage. The reel video fills the stage. Over it sits a black layer
   with `mix-blend-mode: multiply` holding "HYODO" in white (Inter Tight 900,
   `clamp(110px, 25vw, 440px)`), so footage shows only through the letters. With scroll
   progress p from 0 to 1:
   - word scale = `1 + p^1.6 × 2.2`
   - mask opacity = `1 − clamp((p − 0.4) / 0.4)`, so the full reel is revealed by p = 0.8
   - reel scale = `1.12 − 0.12p`
   - captions fade out by p ≈ 0.33; "Watch the full reel" fades in from 0.75 to 0.95
   In production use the real reel video (muted, looped, playsinline) instead of the
   mockup's rotating stills. Mobile uses the same mask on a 720px-tall stage.
2. **About headline**: "authentic human stories" sweeps from black to red on load, word by
   word: a 200%-wide two-colour gradient clipped to the text, background-position from
   100% to 0%, 750ms, staggered 0 / 260 / 520ms, starting 450ms after load.
3. **About "Who we are"**: words ink from `#CFCFCF` to `#0A0A0A` in reading order as the
   paragraph scrolls from 85% to 45% of the viewport.
4. **About mosaic**: three columns of BTS/team photos, each translating vertically at a
   different rate across the section's pass through the viewport (offsets
   `(p − 0.5) × −180px`, `× 140px`, `× −60px`). Two columns with a 56px stagger on mobile,
   no parallax.
5. **About 효도, focus pull**: each character starts blurred (28px), faint (0.1) and
   scaled to 1.18, then eases (cubic out) into focus as the section enters. 도 trails 효
   by 30% of the range.

## Content notes

- Home project order follows the CMS.
- The About mosaic should pull from the existing BTS gallery images (and team photos
  once they're added to Sanity).
- The Contact form keeps the existing fields (Name, Email, Company optional, Project)
  and the existing submit handler, restyled as underlined inputs with a full-width black
  "Send inquiry ↗" button and an inline thank-you state.
- The `assets/` folder holds the five stills used in the mockups, for reference only.
  The live site should keep using the Sanity images.
