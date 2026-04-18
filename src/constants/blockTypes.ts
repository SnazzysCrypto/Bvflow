import type { BlockType } from '../types/blocks'

export interface BlockTypeMeta {
  type: BlockType
  label: string
  icon: string
  category: 'content' | 'form' | 'layout'
  description: string
}

export const BLOCK_TYPE_META: BlockTypeMeta[] = [
  // Content
  { type: 'heading', label: 'Heading', icon: 'H', category: 'content', description: 'Bold headline text' },
  { type: 'paragraph', label: 'Paragraph', icon: '¶', category: 'content', description: 'Rich text content' },
  { type: 'image', label: 'Image', icon: '🖼', category: 'content', description: 'Display an image' },
  { type: 'video', label: 'Video', icon: '▶', category: 'content', description: 'Embed a YouTube/Vimeo video' },
  { type: 'button', label: 'Button', icon: '⬜', category: 'content', description: 'CTA or navigation button' },
  // Layout
  { type: 'spacer', label: 'Spacer', icon: '↕', category: 'layout', description: 'Vertical whitespace' },
  { type: 'divider', label: 'Divider', icon: '─', category: 'layout', description: 'Horizontal rule' },
  // Form fields
  { type: 'name_fields', label: 'Name', icon: '👤', category: 'form', description: 'First and last name' },
  { type: 'email_input', label: 'Email', icon: '@', category: 'form', description: 'Email address field' },
  { type: 'phone_input', label: 'Phone', icon: '📞', category: 'form', description: 'Phone number field' },
  { type: 'text_input', label: 'Text input', icon: 'T', category: 'form', description: 'Single-line text' },
  { type: 'textarea', label: 'Textarea', icon: '≡', category: 'form', description: 'Multi-line text' },
  { type: 'number_input', label: 'Number', icon: '#', category: 'form', description: 'Numeric input' },
  { type: 'select', label: 'Dropdown', icon: '▾', category: 'form', description: 'Select from a list' },
  { type: 'radio_group', label: 'Radio buttons', icon: '◉', category: 'form', description: 'Single choice' },
  { type: 'checkbox_group', label: 'Checkboxes', icon: '☑', category: 'form', description: 'Multiple choice' },
  { type: 'checkbox_single', label: 'Single checkbox', icon: '✓', category: 'form', description: 'Agree / opt-in' },
  { type: 'picture_choice', label: 'Picture choice', icon: '🖼', category: 'form', description: 'Visual selection' },
  { type: 'rating', label: 'Star rating', icon: '★', category: 'form', description: 'Star / heart rating' },
  { type: 'opinion_scale', label: 'Opinion scale', icon: '0→10', category: 'form', description: 'NPS or Likert scale' },
  { type: 'slider', label: 'Slider', icon: '⊸', category: 'form', description: 'Range slider' },
  { type: 'date_picker', label: 'Date', icon: '📅', category: 'form', description: 'Date picker' },
  { type: 'file_upload', label: 'File upload', icon: '📎', category: 'form', description: 'File attachment' },
  { type: 'legal_consent', label: 'Legal consent', icon: '⚖', category: 'form', description: 'GDPR / terms consent' },
]

export const BLOCK_CATEGORIES = ['content', 'form', 'layout'] as const
