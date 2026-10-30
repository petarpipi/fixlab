import {
  AlignVerticalJustifyCenter,
  AppWindow,
  Image,
  LayoutGrid,
  ListChecks,
  Menu,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type DemoId = 'layout' | 'navigation' | 'alignment' | 'images' | 'validation' | 'components'
export type ComparisonMode = 'before' | 'after'

export interface Demo {
  id: DemoId
  title: string
  shortTitle: string
  category: string
  icon: LucideIcon
  problem: string
  solution: string
  instruction: string
  beforeLabel: string
  afterLabel: string
  tags: string[]
  sourceFile: string
}

export const demos: Demo[] = [
  {
    id: 'layout',
    title: 'Responsive Layout Fix',
    shortTitle: 'Responsive layout',
    category: 'CSS · RESPONSIVENESS',
    icon: LayoutGrid,
    problem:
      'Fixed-width columns push content off a small screen. The page only works on the designer’s monitor.',
    solution:
      'A fluid grid uses the space it has. Cards reflow without clipping, and long content stays within its column.',
    instruction: 'The grid reflows to fit any width, down to a single column.',
    beforeLabel: 'Fixed columns. Hidden content.',
    afterLabel: 'Every card. Every screen.',
    tags: ['CSS Grid', 'Fluid sizing', 'Overflow'],
    sourceFile: 'src/demo.css',
  },
  {
    id: 'navigation',
    title: 'Navigation Fix',
    shortTitle: 'Mobile navigation',
    category: 'REACT · ACCESSIBILITY',
    icon: Menu,
    problem:
      'The mobile menu looks clickable, but has no handler. Links disappear and keyboard users cannot reach them.',
    solution:
      'A real disclosure button exposes its state, opens the menu, closes on selection or Escape, and returns focus.',
    instruction: 'Open the sample menu, choose a page, or press Escape.',
    beforeLabel: 'A menu that goes nowhere.',
    afterLabel: 'A clear path forward.',
    tags: ['React state', 'Keyboard', 'ARIA'],
    sourceFile: 'src/components/Previews.tsx',
  },
  {
    id: 'alignment',
    title: 'CSS Alignment Fix',
    shortTitle: 'CSS alignment',
    category: 'CSS · LAYOUT',
    icon: AlignVerticalJustifyCenter,
    problem:
      'Manual margins misalign icons, text, and actions. Different text lengths break the layout.',
    solution:
      'Grid aligns each row, with a flexible text track and a stable action column. Long names wrap safely.',
    instruction: 'Rows stay aligned even when long names wrap.',
    beforeLabel: 'Close, but never aligned.',
    afterLabel: 'A little structure. A lot of clarity.',
    tags: ['CSS Grid', 'Alignment', 'Text wrapping'],
    sourceFile: 'src/demo.css',
  },
  {
    id: 'images',
    title: 'Image Optimization',
    shortTitle: 'Responsive images',
    category: 'HTML · PERFORMANCE',
    icon: Image,
    problem:
      'Forced dimensions stretch the photograph. One oversized image is downloaded on every device.',
    solution:
      'Local AVIF and WebP variants, responsive sources, intrinsic dimensions, and object-fit keep images sharp and proportional.',
    instruction: 'The photo keeps its 3:2 ratio at every width.',
    beforeLabel: 'Distorted and oversized.',
    afterLabel: 'The right crop. The right size.',
    tags: ['AVIF / WebP', 'srcset', 'Aspect ratio'],
    sourceFile: 'src/components/Previews.tsx',
  },
  {
    id: 'validation',
    title: 'Form Validation Fix',
    shortTitle: 'Form validation',
    category: 'REACT · USER EXPERIENCE',
    icon: ListChecks,
    problem:
      'Empty or malformed entries are accepted with no helpful feedback. A successful click proves nothing.',
    solution:
      'Field-level errors explain what to fix, invalid fields are linked to their messages, and focus moves to the first error.',
    instruction: 'Try an empty submission, then complete the demo form.',
    beforeLabel: 'No checks. No confidence.',
    afterLabel: 'Helpful feedback at every step.',
    tags: ['Validation', 'Error recovery', 'Focus'],
    sourceFile: 'src/lib/validation.ts',
  },
  {
    id: 'components',
    title: 'Interactive Component Fix',
    shortTitle: 'Interactive components',
    category: 'REACT · INTERACTION',
    icon: AppWindow,
    problem:
      'A decorative dropdown, a dead action button, and a modal with no keyboard support interrupt the user journey.',
    solution:
      'A native select, stateful action, and modal dialog support keyboard input, Escape, focus containment, and focus restoration.',
    instruction: 'Choose a repair, open its summary, then save it.',
    beforeLabel: 'Looks ready. Does nothing.',
    afterLabel: 'Built to work. For everyone.',
    tags: ['Dialog', 'Native select', 'State'],
    sourceFile: 'src/components/Previews.tsx',
  },
]
