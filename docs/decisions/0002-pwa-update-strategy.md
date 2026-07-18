# ADR 0002: PWA update strategy — NetworkFirst navigation + tap-to-reload

## Status

Accepted

## Context

The app is deployed to GitHub Pages, which gives no server-side control over
`Cache-Control` headers. `VitePWA({ registerType: 'autoUpdate' })` had no
`workbox` block and no `useRegisterSW`/`virtual:pwa-register` call, so a new
service worker installed after a deploy but sat in the `waiting` state —
players kept seeing the old build until every open tab was closed, which for
a share-the-phone party game could mean days.

Note: `registerType: 'autoUpdate'` also has a hidden effect on vite-plugin-pwa's
generated client registration code — it bakes in an unconditional
`window.location.reload()` on activation and never invokes `onNeedRefresh`,
so a tap-to-reload prompt component is unreachable dead code under
`autoUpdate`. Verified locally (build + preview + simulated deploy): with
`autoUpdate` + `skipWaiting: true`, an already-open tab reloaded itself
silently with no toast shown. Switching to `registerType: 'prompt'` (and
dropping `skipWaiting: true` from the workbox config, keeping
`clientsClaim: true`) is required for the toast path to actually fire.

In the context of **shipping frequent GitHub Pages deploys with no
server-side cache control**, facing **stale service workers stuck in
`waiting` until all tabs close**, we needed a fix that lives entirely at the
service-worker layer and does not disrupt a live game round mid-play.

## Decision

We chose:

- `registerType: 'prompt'` (not `'autoUpdate'`) so vite-plugin-pwa's
  generated client code takes the `onNeedRefresh` code path instead of
  silently calling `window.location.reload()` on activation.
- `clientsClaim: true` in the workbox config (without `skipWaiting: true`),
  so a new service worker sits in `waiting` until the client sends the
  skip-waiting message, then takes control immediately once it does.
- `NetworkFirst` for navigation requests (`request.mode === 'navigate'`)
  with a 3-second network timeout, so a fresh HTML shell is fetched on the
  next navigation when the user is online, falling back to cache only when
  offline or slow.
- `CacheFirst` for static assets (`script`, `style`, `image`, `font`), since
  built asset filenames are content-hashed and safe to cache aggressively.
- A tap-to-reload `UpdateToast` component (via `useRegisterSW` from
  `virtual:pwa-register/react`) that surfaces when a new service worker is
  ready — explicitly NOT a silent auto-reload, since reloading mid-round
  would interrupt an in-progress game.

to achieve **new deploys reaching users on the next fresh navigation
(within ~3s if online) instead of only after every tab closes**, accepting
**a brief tap-to-reload prompt as the tradeoff needed to avoid silently
interrupting a live round, and that the whole fix must live client-side
since GitHub Pages offers no server-side Cache-Control**.

## Consequences

- Deploys land within ~3 seconds of a fresh navigation when the user is
  online, rather than waiting for every tab to close.
- Because GitHub Pages gives no server-side cache header control, all update
  behavior is compensated for entirely at the service-worker layer
  (`workbox` config + `useRegisterSW`); there is no `netlify.toml` or
  equivalent fallback.
- Players see a small tap-to-reload prompt instead of a silent reload — a
  deliberate UX tradeoff to avoid disrupting a live game round.
- `navigateFallback` is derived from the same `base` constant used by Vite's
  `base` option in `vite.config.ts`, so they can't drift apart into a 404
  on offline navigation.
