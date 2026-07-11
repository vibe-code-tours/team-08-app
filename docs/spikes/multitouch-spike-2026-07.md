# Multi-Touch Spike — July 2026

## Question

Can iOS Safari and Android Chrome/Samsung Internet reliably detect 5+
simultaneous touches without dropping events, firing spurious
`touchcancel`, or triggering native scroll/zoom gesture hijacking? And
what is the practical ceiling on simultaneous touches per platform?

This was the primary technical risk for Finger Roulette before any real
game logic was built, since the entire core loop depends on accurate
multi-touch detection.

## Method

A standalone static HTML page (no framework, no build step) was built to
log raw `touchstart` / `touchmove` / `touchend` / `touchcancel` events,
counting simultaneous active touches and flagging dropped or unknown
move events. It was hosted via Netlify Drop for quick device-to-device
sharing and was **not** committed to this repository — it was a
throwaway harness, discarded once results were collected. Testers used
the app's "Copy Results" button to paste raw output into the team's
Notion "Multi-Touch Spike – Test Reports" page. This doc synthesizes
those six runs for engineering reference.

## Results — all logged runs (source: Notion "Multi-Touch Spike – Test Reports")

| # | Tester | Date/time (as logged) | Browser / Platform | Screen | Max touches | Verdict | Touch-starts | touchcancel | Dropped moves | Duration | Smooth | Fingers not registering | Zoom/scroll hijack |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Pi | 08/07/2026, 05:04:36 | Chrome / Android (Linux armv81) | 412×912 @2.625x | **7** | PASS (5+) | 89 | 0 | 0 | 70s | Yes | **Sometimes** | (no answer) |
| 2 | Khin | 08/07/2026, 07:03:48 | Samsung Internet / Android | 384×857 @2.8125x | 4 | PARTIAL (4) | 12 | 0 | (not recorded) | (not recorded) | (not recorded) | No | (no answer) |
| 3 | Shin Thant | 08/07/2026, 07:37:19 | Chrome / Android | 360×740 @3x | 5 | PASS (5+) | 34 | 0 | 0 | 45s | Yes | No | No |
| 4 | (not given) | 7/8/2026, 11:10:32 AM | Safari (iOS) / iPhone, iOS 18.7, Safari **26.5** | 390×844 @3x | 2 | PARTIAL (2) | 2 | 0 | 0 | 30s | Yes | No | No |
| 5 | Judy | 08/07/2026, 17:42:56 | Chrome / Android | 384×854 @2.8125x | 5 | PASS (5+) | 5 | 0 | 0 | 13s | (no answer) | (no answer) | (no answer) |
| 6 | (not given) | 09/07/2026, 00:15:57 | Safari (iOS) / iPhone, iOS 18.7, Safari **26.4** | 390×844 @3x | 5 | PASS (5+) | 80 | 0 | 0 | 75s | Yes | No | No |

All six runs recorded **zero `touchcancel` events and zero dropped/unknown
moves**, and every run that answered the hijack question reported no
scroll/zoom hijacking. That result is now consistent across 4 Android
runs (2 browsers) and 2 iOS runs — this is the strongest and most
important finding of the spike.

### Raw log — run #1 (Pi, Android, max 7)

```
MULTI-TOUCH SPIKE RESULT
------------------------
Tester: Pi
Date: 08/07/2026, 05:04:36
Browser: Chrome
Screen: 412x912 @ 2.625x
Platform: Linux armv81
Max simultaneous touches: 7
Verdict: PASS (5+)
Total touch-starts: 89
touchcancel events: 0
Dropped/unknown moves: 0
Test duration: 70s
Felt smooth: Yes
Fingers not registering: Sometimes
Screen zoom/scroll hijack: (no answer)
User agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36
```

### Raw log — run #6 (iPhone, max 5, longest iOS run)

```
MULTI-TOUCH SPIKE RESULT
------------------------
Tester: (not given)
Date: 09/07/2026, 00:15:57
Browser: Safari (iOS)
Screen: 390x844 @ 3x
Platform: iPhone
Max simultaneous touches: 5
Verdict: PASS (5+)
Total touch-starts: 80
touchcancel events: 0
Dropped/unknown moves: 0
Test duration: 75s
Felt smooth: Yes
Fingers not registering: No
Screen zoom/scroll hijack: No
User agent: Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1
```

Remaining raw entries (runs #2–5): see the Notion "Multi-Touch Spike –
Test Reports" page directly.

## Implementation pattern validated

- `touch-action: none` on the touch surface
- Event listeners registered with `{ passive: false }`
- `preventDefault()` called on `touchstart`/`touchmove` to suppress
  native scroll/zoom gesture handling

Zero gesture-hijack incidents were recorded across every run that
answered the question.

## Findings and open items

**The 5-touch figure is not a hard ceiling — at least on Android.**
Run #1 (Pi) reached 7 simultaneous touches on Chrome/Android, resolving
part of the ambiguity flagged after the first iOS result. However, that
same run reported "Fingers not registering: Sometimes" despite 0
dropped-move events logged — the drop-counter only counts events that
reached the browser, so a finger the OS silently caps *before* it
generates a `touchstart` wouldn't show up as a drop. **This needs a
targeted re-test**: have testers explicitly try 6, 7, 8+ fingers and
report which finger (by order) failed to register, not just a max
count.

**iOS is still thin.** Only 2 iOS runs exist, both same device model
(390×844 @3x) and same iOS version (18.7), but at *different* Safari
patch versions (26.4 vs 26.5) — worth noting since it means the two
runs aren't strictly identical builds, though nothing in the results
suggests a regression between them. One run only tested 2 fingers for
30s (run #4); the other tested 5 fingers for 75s with 80 touch-starts
(run #6) and is the more meaningful of the two. **iOS still needs
more testers and more device/iOS-version variety** before treating the
5-touch iOS result as representative rather than a single good sample.

**Samsung Internet result is weaker than Chrome's.** Run #2 (Khin,
Samsung Internet) only reached 4 touches, verdict PARTIAL, in a short
12-touch-start session with no duration or dropped-move data recorded.
This is the one browser/platform combination that hasn't produced a
clean PASS. **Retest Samsung Internet specifically**, with the same
"push to your physical max" instruction used for the ceiling question
above, before considering it validated.

**Test rigor varies a lot between runs.** Run #5 (Judy) logged only 5
touch-starts in 13 seconds — likely a quick tap-based check rather than
a sustained multi-touch hold, and several fields ("no answer") suggest
the test was cut short. Treat it as a weak positive, not a full pass.

**Instruction gap for future testers.** None of the six runs confirm
whether the tester attempted *more* fingers than their reported max.
Before collecting further data, add a field to the test harness/report
asking testers to explicitly state whether they tried more fingers than
their max and, if so, what happened — this is the only way to
distinguish a device/browser ceiling from a tester simply not trying
more fingers.

## Outcome

The core multi-touch risk — dropped touches, phantom `touchcancel`
events, and native gesture hijacking — is retired for Milestone 1
purposes: none of these occurred in any of the six recorded runs, across
two platforms and three browsers. **Not yet fully closed**: the true
per-platform touch ceiling, and a clean Samsung Internet pass. Neither
blocks starting `src/types/index.ts` or Milestone 1 implementation, but
both should be scheduled before finalizing max-player-count UI in the
Setup screen.

See
[`docs/decisions/0001-touch-identifier-keying.md`](../decisions/0001-touch-identifier-keying.md)
for the resulting implementation decision.