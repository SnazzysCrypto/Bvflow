import { genId } from './idGen'
import type { Block, BlockType, BlockStyles } from '../types/blocks'

const defaultStyles: BlockStyles = { marginBottom: 16 }

export function createBlock(type: BlockType): Block {
  const base = { id: genId('blk'), hidden: false, styles: { ...defaultStyles } }

  switch (type) {
    case 'heading':
      return { ...base, type, config: { text: 'Your headline here', level: 1, color: null, fontSize: null } }
    case 'paragraph':
      return { ...base, type, config: { html: '<p>Add your content here.</p>', color: null, fontSize: null } }
    case 'image':
      return { ...base, type, config: { src: '', alt: '', width: null, linkUrl: null, openInNewTab: false } }
    case 'video':
      return { ...base, type, config: { embedUrl: '', aspectRatio: '16:9', autoplay: false, muted: true } }
    case 'divider':
      return { ...base, type, config: { color: null, thickness: 1, style: 'solid' } }
    case 'spacer':
      return { ...base, type, config: { height: 32 } }
    case 'button':
      return { ...base, type, config: { label: 'Continue', action: 'next_step', url: null, openInNewTab: false, variant: 'filled', size: 'md', fullWidth: true, color: null, textColor: null } }
    case 'text_input':
      return { ...base, type, config: { ...fieldBase('Text question', 'text_field'), minLength: null, maxLength: null, pattern: null, autocomplete: null } }
    case 'email_input':
      return { ...base, type, config: { ...fieldBase('Email address', 'email'), confirmEmail: false } }
    case 'phone_input':
      return { ...base, type, config: { ...fieldBase('Phone number', 'phone'), defaultCountry: 'US', formatDisplay: true } }
    case 'number_input':
      return { ...base, type, config: { ...fieldBase('Number', 'number'), min: null, max: null, step: null, prefix: null, suffix: null } }
    case 'textarea':
      return { ...base, type, config: { ...fieldBase('Your message', 'message'), rows: 4, maxLength: null, showCharCount: false } }
    case 'select':
      return { ...base, type, config: { ...fieldBase('Choose an option', 'select_field'), options: [{ label: 'Option 1', value: 'option_1' }, { label: 'Option 2', value: 'option_2' }], allowOther: false, searchable: false, multi: false } }
    case 'radio_group':
      return { ...base, type, config: { ...fieldBase('Pick one', 'radio_field'), options: [{ label: 'Option A', value: 'a', imageUrl: null }, { label: 'Option B', value: 'b', imageUrl: null }], layout: 'vertical', allowOther: false } }
    case 'checkbox_group':
      return { ...base, type, config: { ...fieldBase('Select all that apply', 'checkbox_field'), options: [{ label: 'Option A', value: 'a', imageUrl: null }, { label: 'Option B', value: 'b', imageUrl: null }], layout: 'vertical', minSelections: null, maxSelections: null } }
    case 'checkbox_single':
      return { ...base, type, config: { ...fieldBase('I agree', 'agree'), checkboxLabel: 'I agree to the terms', checkedValue: 'yes', uncheckedValue: 'no' } }
    case 'date_picker':
      return { ...base, type, config: { ...fieldBase('Date', 'date'), includeTime: false, minDate: null, maxDate: null, format: 'MM/DD/YYYY' } }
    case 'rating':
      return { ...base, type, config: { ...fieldBase('Rating', 'rating'), maxRating: 5, icon: 'star', showLabels: false, lowLabel: null, highLabel: null } }
    case 'slider':
      return { ...base, type, config: { ...fieldBase('Slide to choose', 'slider'), min: 0, max: 100, step: 1, showValue: true, prefix: null, suffix: null } }
    case 'file_upload':
      return { ...base, type, config: { ...fieldBase('Upload a file', 'file'), accept: '.pdf,.doc,.docx,.jpg,.png', maxSizeMb: 10, multiple: false } }
    case 'name_fields':
      return { ...base, type, config: { ...fieldBase('Your name', 'name'), fields: { prefix: false, firstName: true, middleName: false, lastName: true, suffix: false } } }
    case 'opinion_scale':
      return { ...base, type, config: { ...fieldBase('On a scale of 0–10', 'scale'), steps: 11, startLabel: 'Not likely', endLabel: 'Very likely' } }
    case 'picture_choice':
      return { ...base, type, config: { ...fieldBase('Choose one', 'picture_choice'), options: [{ label: 'Option A', value: 'a', imageUrl: '', altText: 'A' }, { label: 'Option B', value: 'b', imageUrl: '', altText: 'B' }], multi: false, showLabels: true, columns: 2 } }
    case 'legal_consent':
      return { ...base, type, config: { ...fieldBase('Legal consent', 'consent'), html: 'I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.', mustCheck: true } }
    default:
      return { ...base, type: 'spacer' as any, config: { height: 16 } }
  }
}

function fieldBase(label: string, fieldName: string) {
  return { label, placeholder: null, helpText: null, required: false, fieldName, defaultValue: null }
}
