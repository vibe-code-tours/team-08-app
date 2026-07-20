import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sourceDir = resolve('content/burmese-cards')
const outputFile = resolve('src/data/cards.ts')
const packs = ['friends', 'couple', 'family', 'classic']
const difficulties = ['easy', 'medium', 'hard']
const cards = []

for (const fileName of readdirSync(sourceDir).sort()) {
  const match = fileName.match(/^(friends|couple|family|classic)-(easy|medium|hard)\.md$/)
  if (!match) continue

  const [, pack, difficulty] = match
  const markdown = readFileSync(resolve(sourceDir, fileName), 'utf8')
  const entries = [...markdown.matchAll(/^\*\*(Question|Dare):\*\*\s*(.+)$/gmu)]

  if (entries.length === 0) {
    throw new Error(`${fileName}: no cards found`)
  }

  const typeCounts = { truth: 0, dare: 0 }
  for (const [, label, rawText] of entries) {
    const type = label === 'Question' ? 'truth' : 'dare'
    typeCounts[type] += 1
    const number = String(typeCounts[type]).padStart(2, '0')
    const difficultyId = difficulty === 'medium' ? 'med' : difficulty

    cards.push({
      id: `${pack}-${difficultyId}-${type === 'truth' ? 't' : 'd'}${number}`,
      type,
      difficulty,
      pack,
      text: rawText.trim(),
    })
  }

  if (typeCounts.truth === 0 || typeCounts.dare === 0) {
    throw new Error(`${fileName}: both Truth and Dare cards are required`)
  }
}

const expectedGroups = packs.length * difficulties.length
const actualGroups = new Set(cards.map(({ pack, difficulty }) => `${pack}-${difficulty}`))
if (actualGroups.size !== expectedGroups) {
  throw new Error(`Expected ${expectedGroups} pack/difficulty groups, found ${actualGroups.size}`)
}

const ids = new Set(cards.map(({ id }) => id))
if (ids.size !== cards.length) {
  throw new Error('Generated card IDs are not unique')
}

const lines = [
  "import type { Card, CardPack, Difficulty, CardType } from '../types'",
  '',
  '/**',
  ' * Burmese Truth or Dare library generated from content/burmese-cards/*.md.',
  ` * Total: ${cards.length} cards across every pack/difficulty group.`,
  ' * Run `node scripts/generate-burmese-cards.mjs` after editing the Markdown sources.',
  ' */',
  'export const cards: Card[] = [',
]

let previousGroup = ''
for (const card of cards) {
  const group = `${card.pack}-${card.difficulty}`
  if (group !== previousGroup) {
    if (previousGroup) lines.push('')
    lines.push(`  // ${card.pack[0].toUpperCase() + card.pack.slice(1)} — ${card.difficulty[0].toUpperCase() + card.difficulty.slice(1)}`)
    previousGroup = group
  }

  lines.push(`  ${JSON.stringify(card)},`)
}

lines.push(
  ']',
  '',
  '/** Filter cards by any combination of pack, difficulty, and type */',
  'export function filterCards(options: {',
  '  pack?: CardPack',
  '  difficulty?: Difficulty',
  '  type?: CardType',
  '} = {}): Card[] {',
  '  return cards.filter(',
  '    (c) =>',
  '      (!options.pack || c.pack === options.pack) &&',
  "      (!options.difficulty || options.difficulty === 'all' || c.difficulty === options.difficulty) &&",
  '      (!options.type || c.type === options.type),',
  '  )',
  '}',
  '',
  '/** Get a single random card matching filters */',
  'export function randomCard(options: {',
  '  pack?: CardPack',
  '  difficulty?: Difficulty',
  '  type?: CardType',
  '} = {}): Card | null {',
  '  const filtered = filterCards(options)',
  '  if (filtered.length === 0) return null',
  '  return filtered[Math.floor(Math.random() * filtered.length)]',
  '}',
  '',
  '/** Get N random unique cards matching filters */',
  'export function randomCards(n: number, options: {',
  '  pack?: CardPack',
  '  difficulty?: Difficulty',
  '  type?: CardType',
  '} = {}): Card[] {',
  '  const filtered = filterCards(options)',
  '  // Fisher-Yates shuffle for uniform randomness',
  '  const shuffled = [...filtered]',
  '  for (let i = shuffled.length - 1; i > 0; i--) {',
  '    const j = Math.floor(Math.random() * (i + 1))',
  '    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]',
  '  }',
  '  return shuffled.slice(0, Math.min(n, shuffled.length))',
  '}',
  '',
  '/** Count cards matching filters */',
  'export function countCards(options: {',
  '  pack?: CardPack',
  '  difficulty?: Difficulty',
  '  type?: CardType',
  '} = {}): number {',
  '  return filterCards(options).length',
  '}',
)

writeFileSync(outputFile, `${lines.join('\n')}\n`, 'utf8')
console.log(`Generated ${cards.length} Burmese cards in ${outputFile}`)
