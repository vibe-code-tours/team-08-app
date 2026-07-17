import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { NeonButton } from '../components/NeonButton'

type DesktopGateScreenProps = {
  onContinueAnyway: () => void
}

const PRODUCTION_URL = 'https://vibecode.tours/team-08-app/'

/**
 * Gate screen shown on desktop / non-touch devices when a touch-required
 * game phase is reached. Offers a QR code handoff to a phone plus a
 * "Continue anyway" escape hatch (per ADR-0001: no mouse fallback for
 * the core touch mechanic).
 */
export default function DesktopGateScreen({ onContinueAnyway }: DesktopGateScreenProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    QRCode.toDataURL(PRODUCTION_URL, {
      width: 200,
      margin: 2,
      color: { dark: '#1a1025', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url)
      })
      .catch(() => {
        // QR generation failure — the "Continue anyway" button remains available
        if (!cancelled) setQrDataUrl(null)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative w-full h-dvh overflow-hidden flex flex-col items-center justify-center px-6 gap-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <h1
          className="text-2xl font-bold text-white/90 max-w-sm"
          style={{ textShadow: '0 0 20px rgba(168,85,247,0.5)' }}
        >
          TheChosenOne က mobile phone မှာပဲ ဆော့လို့ရပါတယ်။
          <br />
          အောက်က QR ကို phone နဲ့ scan ပြီး ဆက်ဆော့ပါ။
        </h1>

        <div
          className="w-[216px] h-[216px] rounded-2xl bg-white p-2 flex items-center justify-center"
          style={{ boxShadow: '0 0 24px 4px rgba(168,85,247,0.55)' }}
        >
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Scan to continue on your phone" width={200} height={200} />
          ) : (
            <div className="w-[200px] h-[200px] animate-pulse rounded-xl bg-slate-200" />
          )}
        </div>

        <NeonButton onClick={onContinueAnyway} size="sm" color="#64748b">
          ဒီအတိုင်း ဆက်သွားမည်
        </NeonButton>
      </div>
    </div>
  )
}
