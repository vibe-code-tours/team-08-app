/**
 * Test-time stand-in for `virtual:pwa-register/react`.
 *
 * That module is a Vite virtual module only resolved by the VitePWA plugin
 * at build/dev time (see vite.config.ts). vitest.config.ts intentionally
 * doesn't load the VitePWA plugin (it's build/deploy-only tooling), so
 * `vitest.config.ts` aliases the real specifier to this file — components
 * importing `useRegisterSW` (e.g. UpdateToast) resolve here under test
 * instead of failing to resolve the virtual module.
 */
export function useRegisterSW() {
  return {
    needRefresh: [false, () => {}] as [boolean, (value: boolean) => void],
    offlineReady: [false, () => {}] as [boolean, (value: boolean) => void],
    updateServiceWorker: () => Promise.resolve(),
  }
}
