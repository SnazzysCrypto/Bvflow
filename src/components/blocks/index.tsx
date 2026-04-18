import React from 'react'
import type { Block } from '../../types/blocks'
import { sanitizeHtml } from '../../utils/sanitize'

interface BlockViewProps {
  block: Block
  previewMode?: boolean
  formValues?: Record<string, unknown>
  onFieldChange?: (fieldName: string, value: unknown) => void
  fieldError?: string
}

export function BlockView({ block, previewMode, formValues, onFieldChange, fieldError }: BlockViewProps) {
  const cfg = (block as any).config ?? {}
  const fn = cfg.fieldName ?? block.id

  switch (block.type) {
    // ── Content ───────────────────────────────────────────────────────────
    case 'heading': {
      const Tag = `h${cfg.level ?? 1}` as 'h1' | 'h2' | 'h3' | 'h4'
      const sizes = { 1: 'text-3xl', 2: 'text-2xl', 3: 'text-xl', 4: 'text-lg' }
      return (
        <Tag
          className={`font-bold leading-tight ${sizes[cfg.level as 1|2|3|4] ?? 'text-3xl'}`}
          style={{ color: cfg.color ?? undefined, fontSize: cfg.fontSize ?? undefined }}
        >
          {cfg.text || 'Heading'}
        </Tag>
      )
    }

    case 'paragraph':
      return (
        <div
          className="prose prose-sm max-w-none text-gray-700"
          style={{ color: cfg.color ?? undefined, fontSize: cfg.fontSize ?? undefined }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(cfg.html || '<p>Paragraph text</p>') }}
        />
      )

    case 'image':
      return cfg.src ? (
        <img src={cfg.src} alt={cfg.alt ?? ''} style={{ width: cfg.width ?? '100%' }} className="rounded-lg" />
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400 text-sm">
          🖼 Image — enter URL in settings
        </div>
      )

    case 'video':
      return cfg.embedUrl ? (
        <div className="relative w-full" style={{ paddingBottom: cfg.aspectRatio === '4:3' ? '75%' : cfg.aspectRatio === '1:1' ? '100%' : '56.25%' }}>
          <iframe
            src={cfg.embedUrl}
            className="absolute inset-0 w-full h-full rounded-lg"
            allow="autoplay; fullscreen"
            title="video"
          />
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400 text-sm">
          ▶ Video — enter embed URL in settings
        </div>
      )

    case 'spacer':
      return <div style={{ height: `${cfg.height ?? 32}px` }} />

    case 'divider':
      return (
        <hr
          style={{
            borderTopColor: cfg.color ?? '#e5e7eb',
            borderTopWidth: `${cfg.thickness ?? 1}px`,
            borderTopStyle: cfg.style ?? 'solid',
          }}
          className="my-1"
        />
      )

    case 'button': {
      const variantClass = cfg.variant === 'outline'
        ? 'border-2 border-brand-600 text-brand-600 bg-transparent hover:bg-brand-50'
        : cfg.variant === 'ghost'
        ? 'text-brand-600 bg-transparent hover:bg-brand-50'
        : 'bg-brand-600 text-white hover:bg-brand-700'
      const sizeClass = cfg.size === 'sm' ? 'px-4 py-2 text-sm' : cfg.size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3'
      return (
        <div style={{ textAlign: block.styles?.textAlign ?? 'center' }}>
          <button
            disabled={!previewMode}
            className={`rounded-lg font-semibold transition-colors ${variantClass} ${sizeClass} ${cfg.fullWidth ? 'w-full' : ''}`}
            style={{ backgroundColor: (cfg.variant === 'filled' && cfg.color) ? cfg.color : undefined, color: cfg.textColor ?? undefined }}
          >
            {cfg.label || 'Button'}
          </button>
        </div>
      )
    }

    // ── Form Fields ───────────────────────────────────────────────────────
    case 'text_input':
    case 'email_input':
    case 'phone_input':
    case 'number_input': {
      const typeMap = { text_input: 'text', email_input: 'email', phone_input: 'tel', number_input: 'number' }
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <input
            type={typeMap[block.type as keyof typeof typeMap]}
            placeholder={cfg.placeholder ?? ''}
            value={String(formValues?.[fn] ?? '')}
            onChange={e => onFieldChange?.(fn, e.target.value)}
            className={fieldInputClass(!!fieldError)}
            readOnly={!previewMode}
          />
        </FieldWrapper>
      )
    }

    case 'textarea':
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <textarea
            placeholder={cfg.placeholder ?? ''}
            rows={cfg.rows ?? 4}
            value={String(formValues?.[fn] ?? '')}
            onChange={e => onFieldChange?.(fn, e.target.value)}
            className={`${fieldInputClass(!!fieldError)} resize-y`}
            readOnly={!previewMode}
          />
        </FieldWrapper>
      )

    case 'select': {
      const val = formValues?.[fn] ?? ''
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <select
            value={String(val)}
            onChange={e => onFieldChange?.(fn, e.target.value)}
            className={fieldInputClass(!!fieldError)}
            disabled={!previewMode}
          >
            <option value="">{cfg.placeholder ?? 'Select...'}</option>
            {(cfg.options ?? []).map((o: any) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </FieldWrapper>
      )
    }

    case 'radio_group': {
      const current = String(formValues?.[fn] ?? '')
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <div className={cfg.layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'}>
            {(cfg.options ?? []).map((o: any) => (
              <label
                key={o.value}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  current === o.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={fn}
                  value={o.value}
                  checked={current === o.value}
                  onChange={() => onFieldChange?.(fn, o.value)}
                  className="accent-brand-600"
                  disabled={!previewMode}
                />
                <span className="text-sm text-gray-800">{o.label}</span>
              </label>
            ))}
          </div>
        </FieldWrapper>
      )
    }

    case 'checkbox_group': {
      const current = Array.isArray(formValues?.[fn]) ? formValues![fn] as string[] : []
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <div className="flex flex-col gap-2">
            {(cfg.options ?? []).map((o: any) => {
              const checked = current.includes(o.value)
              return (
                <label
                  key={o.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    checked ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked ? current.filter(v => v !== o.value) : [...current, o.value]
                      onFieldChange?.(fn, next)
                    }}
                    className="accent-brand-600"
                    disabled={!previewMode}
                  />
                  <span className="text-sm text-gray-800">{o.label}</span>
                </label>
              )
            })}
          </div>
        </FieldWrapper>
      )
    }

    case 'checkbox_single': {
      const checked = formValues?.[fn] === (cfg.checkedValue ?? 'yes')
      return (
        <div className={`flex items-start gap-3 ${fieldError ? 'text-red-500' : ''}`}>
          <input
            type="checkbox"
            id={`cb-${block.id}`}
            checked={!!checked}
            onChange={() => onFieldChange?.(fn, checked ? (cfg.uncheckedValue ?? 'no') : (cfg.checkedValue ?? 'yes'))}
            className="mt-0.5 accent-brand-600"
            disabled={!previewMode}
          />
          <label htmlFor={`cb-${block.id}`} className="text-sm text-gray-700 cursor-pointer"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(cfg.checkboxLabel ?? cfg.label ?? 'I agree') }}
          />
        </div>
      )
    }

    case 'date_picker':
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <input
            type={cfg.includeTime ? 'datetime-local' : 'date'}
            value={String(formValues?.[fn] ?? '')}
            onChange={e => onFieldChange?.(fn, e.target.value)}
            className={fieldInputClass(!!fieldError)}
            readOnly={!previewMode}
          />
        </FieldWrapper>
      )

    case 'rating': {
      const current = Number(formValues?.[fn] ?? 0)
      const icons: Record<string, string> = { star: '★', heart: '♥', thumb: '👍', circle: '●' }
      const icon = icons[cfg.icon] ?? '★'
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <div className="flex gap-1">
            {Array.from({ length: cfg.maxRating ?? 5 }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => onFieldChange?.(fn, n)}
                className={`text-2xl transition-colors ${n <= current ? 'text-amber-400' : 'text-gray-300'}`}
                disabled={!previewMode}
              >
                {icon}
              </button>
            ))}
          </div>
        </FieldWrapper>
      )
    }

    case 'slider': {
      const val = Number(formValues?.[fn] ?? cfg.min ?? 0)
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <div className="flex flex-col gap-1">
            <input
              type="range"
              min={cfg.min ?? 0}
              max={cfg.max ?? 100}
              step={cfg.step ?? 1}
              value={val}
              onChange={e => onFieldChange?.(fn, Number(e.target.value))}
              className="w-full accent-brand-600"
              disabled={!previewMode}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{cfg.prefix}{cfg.min ?? 0}{cfg.suffix}</span>
              {cfg.showValue && <span className="font-semibold text-brand-600">{cfg.prefix}{val}{cfg.suffix}</span>}
              <span>{cfg.prefix}{cfg.max ?? 100}{cfg.suffix}</span>
            </div>
          </div>
        </FieldWrapper>
      )
    }

    case 'opinion_scale': {
      const steps2 = cfg.steps ?? 11
      const start = steps2 === 11 ? 0 : 1
      const current = String(formValues?.[fn] ?? '')
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: steps2 }, (_, i) => String(i + start)).map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onFieldChange?.(fn, n)}
                  className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-colors ${
                    current === n
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-gray-200 hover:border-brand-300'
                  }`}
                  disabled={!previewMode}
                >
                  {n}
                </button>
              ))}
            </div>
            {(cfg.startLabel || cfg.endLabel) && (
              <div className="flex justify-between text-xs text-gray-400">
                <span>{cfg.startLabel}</span>
                <span>{cfg.endLabel}</span>
              </div>
            )}
          </div>
        </FieldWrapper>
      )
    }

    case 'name_fields': {
      const fields = cfg.fields ?? { firstName: true, lastName: true }
      const fullVal = String(formValues?.[fn] ?? '')
      const parts = fullVal.split(' ')
      const first = formValues?.[fn + '_first'] ?? (parts[0] ?? '')
      const last = formValues?.[fn + '_last'] ?? (parts.slice(1).join(' ') ?? '')
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <div className="grid grid-cols-2 gap-3">
            {fields.firstName && (
              <input
                type="text" placeholder="First name"
                value={String(first)}
                onChange={e => {
                  onFieldChange?.(fn + '_first', e.target.value)
                  onFieldChange?.(fn, `${e.target.value} ${last}`.trim())
                }}
                className={fieldInputClass(false)}
                readOnly={!previewMode}
              />
            )}
            {fields.lastName && (
              <input
                type="text" placeholder="Last name"
                value={String(last)}
                onChange={e => {
                  onFieldChange?.(fn + '_last', e.target.value)
                  onFieldChange?.(fn, `${first} ${e.target.value}`.trim())
                }}
                className={fieldInputClass(false)}
                readOnly={!previewMode}
              />
            )}
          </div>
        </FieldWrapper>
      )
    }

    case 'picture_choice': {
      const current = cfg.multi
        ? (Array.isArray(formValues?.[fn]) ? formValues![fn] as string[] : [])
        : String(formValues?.[fn] ?? '')
      const cols = cfg.columns ?? 2
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {(cfg.options ?? []).map((o: any) => {
              const selected = cfg.multi ? (current as string[]).includes(o.value) : current === o.value
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    if (cfg.multi) {
                      const arr = Array.isArray(current) ? current : []
                      onFieldChange?.(fn, selected ? arr.filter(v => v !== o.value) : [...arr, o.value])
                    } else {
                      onFieldChange?.(fn, o.value)
                    }
                  }}
                  className={`p-3 rounded-xl border-2 text-center transition-colors ${
                    selected ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={!previewMode}
                >
                  {o.imageUrl && <img src={o.imageUrl} alt={o.altText ?? o.label} className="w-full rounded-lg mb-2" />}
                  {cfg.showLabels !== false && <span className="text-sm font-medium text-gray-800">{o.label}</span>}
                </button>
              )
            })}
          </div>
        </FieldWrapper>
      )
    }

    case 'file_upload':
      return (
        <FieldWrapper label={cfg.label} required={cfg.required} helpText={cfg.helpText} error={fieldError}>
          <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-400 transition-colors">
            <span className="text-2xl">📎</span>
            <span className="text-sm text-gray-500">Click to upload {cfg.multiple ? 'files' : 'a file'}</span>
            <span className="text-xs text-gray-400">{cfg.accept} · max {cfg.maxSizeMb}MB</span>
            <input type="file" accept={cfg.accept} multiple={cfg.multiple} className="hidden" disabled={!previewMode} />
          </label>
        </FieldWrapper>
      )

    case 'legal_consent': {
      const checked = formValues?.[fn] === 'yes'
      return (
        <div className={`flex items-start gap-3 ${fieldError ? 'text-red-500' : ''}`}>
          <input
            type="checkbox"
            id={`lc-${block.id}`}
            checked={!!checked}
            onChange={() => onFieldChange?.(fn, checked ? 'no' : 'yes')}
            className="mt-0.5 accent-brand-600"
            disabled={!previewMode}
          />
          <label
            htmlFor={`lc-${block.id}`}
            className="text-sm text-gray-600 cursor-pointer"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(cfg.html ?? cfg.label ?? 'I agree') }}
          />
        </div>
      )
    }

    default:
      return <div className="text-xs text-gray-400 italic">Unknown block type: {(block as any).type}</div>
  }
}

function FieldWrapper({ label, required, helpText, error, children }: {
  label?: string; required?: boolean; helpText?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helpText && !error && <p className="text-xs text-gray-400">{helpText}</p>}
    </div>
  )
}

function fieldInputClass(hasError: boolean): string {
  return [
    'w-full rounded-lg border px-3 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400',
    'outline-none transition-colors',
    hasError
      ? 'border-red-400 focus:border-red-500'
      : 'border-gray-200 focus:border-brand-400 focus:ring-1 focus:ring-brand-100',
  ].join(' ')
}
