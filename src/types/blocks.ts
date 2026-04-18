export type BlockType =
  | 'heading' | 'paragraph' | 'image' | 'video'
  | 'divider' | 'spacer' | 'button'
  | 'text_input' | 'email_input' | 'phone_input' | 'number_input'
  | 'textarea' | 'select' | 'radio_group' | 'checkbox_group'
  | 'checkbox_single' | 'date_picker' | 'rating' | 'slider'
  | 'file_upload' | 'name_fields' | 'opinion_scale'
  | 'picture_choice' | 'legal_consent'

export interface BlockStyles {
  marginTop?: number | null
  marginBottom?: number | null
  paddingTop?: number | null
  paddingBottom?: number | null
  textAlign?: 'left' | 'center' | 'right' | null
  backgroundColor?: string | null
  borderRadius?: number | null
  maxWidth?: string | null
}

export interface BaseBlock {
  id: string
  type: BlockType
  hidden: boolean
  styles: BlockStyles
}

// ── Content Blocks ─────────────────────────────────────────────────────────

export interface HeadingBlock extends BaseBlock {
  type: 'heading'
  config: { text: string; level: 1 | 2 | 3 | 4; color: string | null; fontSize: string | null }
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph'
  config: { html: string; color: string | null; fontSize: string | null }
}

export interface ImageBlock extends BaseBlock {
  type: 'image'
  config: { src: string; alt: string; width: string | null; linkUrl: string | null; openInNewTab: boolean }
}

export interface VideoBlock extends BaseBlock {
  type: 'video'
  config: { embedUrl: string; aspectRatio: '16:9' | '4:3' | '1:1'; autoplay: boolean; muted: boolean }
}

export interface DividerBlock extends BaseBlock {
  type: 'divider'
  config: { color: string | null; thickness: number; style: 'solid' | 'dashed' | 'dotted' }
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer'
  config: { height: number }
}

export interface ButtonBlock extends BaseBlock {
  type: 'button'
  config: {
    label: string
    action: 'next_step' | 'prev_step' | 'submit' | 'url'
    url: string | null
    openInNewTab: boolean
    variant: 'filled' | 'outline' | 'ghost'
    size: 'sm' | 'md' | 'lg'
    fullWidth: boolean
    color: string | null
    textColor: string | null
  }
}

// ── Base field config ──────────────────────────────────────────────────────

export interface BaseFieldConfig {
  label: string
  placeholder: string | null
  helpText: string | null
  required: boolean
  fieldName: string
  defaultValue: string | null
}

export interface BaseFieldBlock extends BaseBlock {
  config: BaseFieldConfig
}

// ── Form Field Blocks ──────────────────────────────────────────────────────

export interface TextInputBlock extends BaseBlock {
  type: 'text_input'
  config: BaseFieldConfig & { minLength: number | null; maxLength: number | null; pattern: string | null; autocomplete: string | null }
}

export interface EmailInputBlock extends BaseBlock {
  type: 'email_input'
  config: BaseFieldConfig & { confirmEmail: boolean }
}

export interface PhoneInputBlock extends BaseBlock {
  type: 'phone_input'
  config: BaseFieldConfig & { defaultCountry: string; formatDisplay: boolean }
}

export interface NumberInputBlock extends BaseBlock {
  type: 'number_input'
  config: BaseFieldConfig & { min: number | null; max: number | null; step: number | null; prefix: string | null; suffix: string | null }
}

export interface TextareaBlock extends BaseBlock {
  type: 'textarea'
  config: BaseFieldConfig & { rows: number; maxLength: number | null; showCharCount: boolean }
}

export interface SelectOption { label: string; value: string }

export interface SelectBlock extends BaseBlock {
  type: 'select'
  config: BaseFieldConfig & { options: SelectOption[]; allowOther: boolean; searchable: boolean; multi: boolean }
}

export interface ChoiceOption { label: string; value: string; imageUrl: string | null }

export interface RadioGroupBlock extends BaseBlock {
  type: 'radio_group'
  config: BaseFieldConfig & { options: ChoiceOption[]; layout: 'vertical' | 'horizontal' | 'grid'; allowOther: boolean }
}

export interface CheckboxGroupBlock extends BaseBlock {
  type: 'checkbox_group'
  config: BaseFieldConfig & { options: ChoiceOption[]; layout: 'vertical' | 'horizontal' | 'grid'; minSelections: number | null; maxSelections: number | null }
}

export interface CheckboxSingleBlock extends BaseBlock {
  type: 'checkbox_single'
  config: BaseFieldConfig & { checkboxLabel: string; checkedValue: string; uncheckedValue: string }
}

export interface DatePickerBlock extends BaseBlock {
  type: 'date_picker'
  config: BaseFieldConfig & { includeTime: boolean; minDate: string | null; maxDate: string | null; format: string }
}

export interface RatingBlock extends BaseBlock {
  type: 'rating'
  config: BaseFieldConfig & { maxRating: number; icon: 'star' | 'heart' | 'thumb' | 'circle'; showLabels: boolean; lowLabel: string | null; highLabel: string | null }
}

export interface SliderBlock extends BaseBlock {
  type: 'slider'
  config: BaseFieldConfig & { min: number; max: number; step: number; showValue: boolean; prefix: string | null; suffix: string | null }
}

export interface FileUploadBlock extends BaseBlock {
  type: 'file_upload'
  config: BaseFieldConfig & { accept: string; maxSizeMb: number; multiple: boolean }
}

export interface NameFieldsBlock extends BaseBlock {
  type: 'name_fields'
  config: BaseFieldConfig & { fields: { prefix: boolean; firstName: boolean; middleName: boolean; lastName: boolean; suffix: boolean } }
}

export interface OpinionScaleBlock extends BaseBlock {
  type: 'opinion_scale'
  config: BaseFieldConfig & { steps: 5 | 7 | 10 | 11; startLabel: string | null; endLabel: string | null }
}

export interface PictureOption { label: string; value: string; imageUrl: string; altText: string }

export interface PictureChoiceBlock extends BaseBlock {
  type: 'picture_choice'
  config: BaseFieldConfig & { options: PictureOption[]; multi: boolean; showLabels: boolean; columns: 2 | 3 | 4 }
}

export interface LegalConsentBlock extends BaseBlock {
  type: 'legal_consent'
  config: BaseFieldConfig & { html: string; mustCheck: boolean }
}

// ── Union ──────────────────────────────────────────────────────────────────

export type Block =
  | HeadingBlock | ParagraphBlock | ImageBlock | VideoBlock
  | DividerBlock | SpacerBlock | ButtonBlock
  | TextInputBlock | EmailInputBlock | PhoneInputBlock | NumberInputBlock
  | TextareaBlock | SelectBlock | RadioGroupBlock | CheckboxGroupBlock
  | CheckboxSingleBlock | DatePickerBlock | RatingBlock | SliderBlock
  | FileUploadBlock | NameFieldsBlock | OpinionScaleBlock
  | PictureChoiceBlock | LegalConsentBlock

export type FormFieldBlock =
  | TextInputBlock | EmailInputBlock | PhoneInputBlock | NumberInputBlock
  | TextareaBlock | SelectBlock | RadioGroupBlock | CheckboxGroupBlock
  | CheckboxSingleBlock | DatePickerBlock | RatingBlock | SliderBlock
  | FileUploadBlock | NameFieldsBlock | OpinionScaleBlock
  | PictureChoiceBlock | LegalConsentBlock

export const FORM_FIELD_TYPES: BlockType[] = [
  'text_input', 'email_input', 'phone_input', 'number_input',
  'textarea', 'select', 'radio_group', 'checkbox_group',
  'checkbox_single', 'date_picker', 'rating', 'slider',
  'file_upload', 'name_fields', 'opinion_scale',
  'picture_choice', 'legal_consent',
]

export function isFormField(type: BlockType): boolean {
  return FORM_FIELD_TYPES.includes(type)
}
