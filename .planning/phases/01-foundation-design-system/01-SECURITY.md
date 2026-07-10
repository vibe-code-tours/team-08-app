---
phase: 01
slug: foundation-design-system
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-07-10
---

# Phase 01 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| localStorage → app runtime | The user's own browser (or a browser extension / devtools) can write arbitrary bytes under the settings key; this untrusted input crosses into the app on every load via `loadSettings()`. | `GameSettings` JSON (difficulty, pack, timer toggle) |
| build tooling → shipped assets | `@tailwindcss/vite` and `vite-plugin-pwa` transform source into shipped CSS/SW at build time; no runtime server trust boundary exists (fully client-side). | Compiled CSS, service worker, manifest |
| service worker → cached app shell | `vite-plugin-pwa`'s generated SW precaches and serves the app shell; a stale SW could serve outdated code after deploy. | Precached JS/CSS/icons |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-01-01 | Tampering | `loadSettings()` JSON.parse on localStorage | medium | mitigate | `try/catch` around `localStorage.getItem` + `JSON.parse`; falls back to `defaultSettings` on any error. Verified in `src/state/GameContext.tsx:17-23`. | closed |
| T-01-02 | Denial of Service | localStorage quota / private-browsing on `saveSettings()` | low | mitigate | `try/catch` around `localStorage.setItem`; fails silently, in-memory state continues to work. Verified in `src/state/GameContext.tsx:26-31`. | closed |
| T-01-03 | Information Disclosure | Data persisted to localStorage | low | accept | Only non-sensitive `GameSettings` (difficulty/pack/timer toggle) are persisted; no PII, secrets, or auth tokens exist in this app. | closed |
| T-01-SC | Tampering | npm/pip/cargo installs | high | mitigate | No new package installs in plan 01-01 — all deps already pinned in `package.json` and legitimacy-audited in RESEARCH.md. Confirmed via `git log -- package.json`: no install commits between plan authoring and execution. | closed |
| T-02-01 | Tampering | Stale service worker serving outdated app shell | low | mitigate | `registerType: 'autoUpdate'` set in `vite.config.ts:12`, activates new SW and reloads rather than trapping users on a stale cached version. | closed |
| T-02-02 | Spoofing | PWA manifest identity (name/icons/theme_color) | low | accept | Manifest identity is public, non-sensitive branding for a party game with no accounts. No install-integrity control beyond HTTPS-served static assets is warranted. | closed |
| T-02-03 | Information Disclosure | Precached assets in the SW cache | low | accept | Only public static build output (JS/CSS/icons) is precached; no secrets or user data enter the cache. | closed |
| T-02-SC | Tampering | npm/pip/cargo installs | high | mitigate | No new package installs in plan 01-02 — `vite-plugin-pwa` and `@tailwindcss/vite` already pinned and legitimacy-audited. Confirmed `workbox-window` is NOT in `package.json` dependencies. | closed |

*Status: open · closed · open — below {block_on} threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| R-01 | T-01-03 | No PII/secrets ever enter localStorage in this app; disclosure of difficulty/pack settings is inconsequential. | Plan 01-01 threat model | 2026-07-10 |
| R-02 | T-02-02 | No accounts/identity system exists; manifest branding is inherently public. | Plan 01-02 threat model | 2026-07-10 |
| R-03 | T-02-03 | SW cache only ever contains public static build output. | Plan 01-02 threat model | 2026-07-10 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-10 | 8 | 8 | 0 | /gsd-secure-phase (L1 grep-depth, register authored at plan time, short-circuit per ASVS L1) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-10
