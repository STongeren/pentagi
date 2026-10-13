# NullHawk brand assets

Visual identity for NullHawk — autonomous red-team AI.

## Files

| File | Use |
|---|---|
| `logo.svg` | Primary emblem, NullHawk red (`#ff2b3e`). Hawk cut out of a shield, single even-odd path. |
| `logo-mono.svg` | Monochrome emblem (near-black `#09090b`) for light backgrounds and print. |
| `github-banner.png` | 1280×640 repo header / GitHub social preview. |

The in-app logo lives in `frontend/src/components/icons/logo.tsx` (inherits `currentColor`), and the favicons/app icons in `frontend/public/favicon/`.

## Colors

| Token | Hex | Role |
|---|---|---|
| Red | `#ff2b3e` | Primary accent, emblem, highlights |
| Red (deep) | `#b00617` | Pressed / gradient low |
| Ink | `#09090b` | Background, dark surfaces |
| Fog | `#eceae7` | Primary text on dark |
| Muted | `#908d8a` | Secondary text |

## Type

- **Display:** Chakra Petch (tactical, geometric)
- **Mono / utility:** IBM Plex Mono
- **Body:** IBM Plex Sans

## Using the GitHub social preview

GitHub does not read this file automatically. Upload `github-banner.png` under
**Repo → Settings → General → Social preview** (needs ≥ 640×320, ≤ 1 MB — this is 1280×640, ~130 KB).
