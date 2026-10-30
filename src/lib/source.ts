import demoCss from '../demo.css?raw'
import previews from '../components/Previews.tsx?raw'
import validation from './validation.ts?raw'
import type { DemoId } from '../data/demos'

/** Extract the marked implementation itself, so examples cannot drift from the fix. */
export function extractSection(source: string, id: string): string {
  const marker = source.indexOf(`fixlab:start ${id}`)
  const end = source.indexOf(`fixlab:end ${id}`)
  if (marker < 0 || end < 0) throw new Error(`Missing source section: ${id}`)
  return source.slice(source.indexOf('\n', marker) + 1, source.lastIndexOf('\n', end)).trim()
}

export function repairSource(id: DemoId): string {
  return extractSection(
    id === 'layout' || id === 'alignment' ? demoCss : id === 'validation' ? validation : previews,
    id,
  )
}
