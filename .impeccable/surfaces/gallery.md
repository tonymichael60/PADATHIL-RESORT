# Gallery
Route: gallery.html
Mode: Experience

The user explicitly requested a new gallery interface after repeatedly favoring a minimal, aesthetically premium, photography-led gallery. That prior preference pins this route's direction. Earlier green editorial and full-screen explorer directions were rejected and are not authority here.

## Direction contract

THESIS: Let real property photographs carry a quiet collection, with each property legible as its own chapter. Proportion, spacing and browsing do the visual work.

OWN-WORLD: White background, charcoal type, Manrope at all levels, flat local navigation, hairline rules and square-edged photographs. No display-serif headline, dark hero, grain, floating cards or ornamental effects on this route.

STORY: Browse ten actual stay photographs in three factual chapters: Nature Castle Resort (six), Niva Waterways (two) and Riparian Ayur Resorts (two). Open an uncropped photo, then request current room photographs. Six representative or promotional images remain separately available under More moments with honest captions.

FIRST VIEWPORT: In a white 1320px container, a Manrope Gallery title grows to 96px and sits opposite a short place introduction. A ruled filter bar and count lead into Nature Castle's heading and asymmetric first photo pair, with a broad landscape image beside a narrower portrait. Below 600px, the title scales from 54px to 68px, the native collection selector and count lead into one photo column, and images retain their natural proportions.

FORM: User-pinned minimal photographic gallery, built code-led. The repeated explicit preference supplies the direction, so no further concept roll or comp round was needed; the first-viewport composition carries that choice. Desktop filter tabs and a mobile native selector stay synchronized. The image viewer stays within the selected collection and supports keyboard navigation, swipe, focus containment and return, loading feedback, and retry after an image failure.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Verification
Desktop 1440px and mobile 390px captured with actual Manrope fonts; intermediate widths checked at 600, 768, 1000 and 1280px. Verified both filter types, image loading, viewer navigation and wrap, focus trap and return, inert background, touch swipe, failed-image retry, and direct image links without JavaScript. No loaded image failures or script errors. Captures and the test harness are under the ignored .impeccable/review directory.

## Boundary
Gallery styles remain in gallery.css. Existing image assets are reused without editing; no new raster was created for this route. Shared stylesheets, other routes and PRODUCT.md remain outside this work. Gallery-specific DESIGN.md and sidecar entries record the shipped interface without replacing the Riparian system. The finish reviewer scored all listed corrections resolved and returned a ship verdict.

