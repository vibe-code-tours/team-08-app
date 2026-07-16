# Sound Effects & Music

Place your audio files here. MP3 format recommended for browser compatibility.

## Sound Effects

| File | Duration | Description |
|------|----------|-------------|
| `tap.mp3` | ~0.1s | Short click — finger placed, UI button press |
| `countdown.mp3` | ~0.2s | Tick — each second during finger selection countdown |
| `roulette-tick.mp3` | ~0.1s | Quick blip — each roulette highlight step |
| `winner.mp3` | ~1s | Dramatic reveal — winner announced |
| `coin-flip.mp3` | ~0.5s | Coin flip whoosh — random choice animation |
| `card-flip.mp3` | ~0.3s | Card flip swoosh — card is selected |
| `timer-tick.mp3` | ~0.2s | Urgent tick — last 5 seconds of countdown |
| `time-up.mp3` | ~0.5s | Buzzer/bell — timer expired |
| `vote.mp3` | ~0.2s | Click — vote button pressed |
| `celebrate.mp3` | ~1.5s | Cheer/fanfare — pass or excellent result |
| `fail.mp3` | ~1s | Sad trombone/fail sound — fail result |
| `fanfare.mp3` | ~1s | Trumpet/ding — player selected reveal |

## Background Music (looping, crossfaded between phases)

| File | Loops on | Description |
|------|----------|-------------|
| `bgm-menu.mp3` | Start, Onboarding, Setup, Next Round | Chill ambient — menu/transition screens |
| `bgm-tension.mp3` | Finger Selection, Roulette, Player Selected | Building tension — selection phase |
| `bgm-gameplay.mp3` | Truth/Dare, Card Reveal, Voting, Result | Upbeat — active gameplay |

## Notes

- SFX files are loaded on demand by Howler.js
- BGM files are preloaded as HTML5 audio streams (looped, crossfaded over 1.5s)
- Missing files fail gracefully (no crash, just a console warning)
- Keep SFX under 100KB each; BGM can be larger (streamed)
- 44.1kHz sample rate, mono or stereo
