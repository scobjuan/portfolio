# Animation and interaction notes per section

Reference: the HTML boards in this folder (`01-home.html` to `11-dev-notes.html`).
They are static mockups that are not meant to be executed; they serve as a visual guide.
The on-screen copy in the boards is in Spanish on purpose: it is the real site copy.

## Home
- Animation: 000 to 100 loader in mono; when it ends, a lime panel rises with `clip-path` (`inset(100%)` to `inset(0)`). The letters of JUAN and ESCOBAR enter line by line through a mask (`y` 110% to 0, 40 ms stagger, 1.1 s, `expo.out`). The "Available" pill pulses every 2 s.
- Interaction: letters widen `font-stretch` (100 to 125%) depending on cursor proximity. The lime sphere follows the cursor with lerp 0.12 and `mix-blend-mode: difference`. The bottom marquee speeds up with scroll velocity.

## Projects
- Animation: each row enters with a line drawn left to right (`scaleX` 0 to 1); the title rises from a mask; numbers count up.
- Interaction: hovering a row drops the others to 35% opacity and shows a floating preview that follows the cursor with inertia and tilt based on velocity (rotate up to 6 degrees). The cursor becomes a 96 px lime disc labelled "Ver caso". Filters reorder the list with FLIP (`TransitionGroup`).

## About
- Animation: the background goes from ink to bone on entry, tied to scroll. The large text is revealed word by word (ash to ink, `ScrollTrigger` scrub). The photo enters with `clip-path` from the bottom and a 1.15 to 1 zoom.
- Interaction: the circular seal rotates and speeds up under the cursor; the photo goes from duotone to color on hover; figures count up when they enter the viewport.

## Skills
- Animation: pills fall with physics and stack (later phase); the heading types in with a scramble effect.
- Interaction: pills can be dragged and thrown (cursor label "Arrastra"); hovering a category keeps only its pills solid while the rest turn to outline. On mobile and with reduced motion, a static grouped list is used.

## Experience
- Animation: pinned section; the giant year stays fixed and changes (digit wheel) while the list advances with scroll; the vertical line fills in lime according to progress.
- Interaction: hovering a role expands its description and technologies; the current role has a pulsing lime dot.

## Contact
- Animation: the lime background enters as a curtain from the bottom; the heading stretches `font-stretch` (62 to 125%) tied to scroll.
- Interaction: magnetic circular button (up to 24 px toward the cursor); clicking the email copies it and the text switches to "Copiado!" with a scramble. Social links draw their underline and rotate the arrow 45 degrees.

## Mobile
- No custom cursor and no physics; proximity effects are replaced by scroll reveals.
- Menu: the lime panel drops in with `clip-path: circle` from the button (700 ms) and the links rise with a 60 ms stagger; the button morphs from two lines to an X.
- Projects: stacked cards with vertical snap and inner parallax (`translateY` up to 20 px). Touch targets are at least 44 px.

## Page transition "Recompile" (1.2 s)
1. 0-250 ms: current content moves down 40 px and fades to 0.4; the cursor shrinks to a dot.
2. 250-600 ms: the curtain in the destination module color rises with a curved edge that flattens out.
3. 600-850 ms: screen covered; the route name appears with a scramble; Vue Router mounts the new view.
4. 850-1200 ms: the curtain exits upward and the new titles enter through a mask with a 40 ms stagger.
- Easing: `cubic-bezier(.76, 0, .24, 1)` on the curtain, `expo.out` on text.
- With `prefers-reduced-motion`: a 200 ms fade.
