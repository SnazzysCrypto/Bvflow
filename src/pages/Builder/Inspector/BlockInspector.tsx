import React from 'react'
import { useBuilderStore, useSelectedBlock, useSelectedStep } from '../../../store/builderStore'
import { Input, Textarea } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { ColorPicker } from '../../../components/ui/ColorPicker'
import { RichTextEditor } from '../../../components/ui/RichTextEditor'
import type { Block } from '../../../types/blocks'

export function BlockInspector() {
  const block = useSelectedBlock()
  const step = useSelectedStep()
  const updateBlock = useBuilderStore(s => s.updateBlock)

  if (!block || !step) {
    return <div className="p-4 text-xs text-gray-400">Select a block to edit its properties.</div>
  }

  const update = (updates: Partial<Block>) => updateBlock(step.id, block.id, updates)
  const updateConfig = (config: object) => update({ config: { ...(block as any).config, ...config } } as any)
  const updateStyles = (styles: object) => update({ styles: { ...block.styles, ...styles } } as any)
  const cfg = (block as any).config ?? {}

  const StylesSection = () => (
    <Section title="Spacing & Style">
      <div className="grid grid-cols-2 gap-2">
        <Input label="Margin top (px)" type="number" value={String(block.styles?.marginTop ?? '')} onChange={e => updateStyles({ marginTop: Number(e.target.value) || null })} />
        <Input label="Margin bottom (px)" type="number" value={String(block.styles?.marginBottom ?? '')} onChange={e => updateStyles({ marginBottom: Number(e.target.value) || null })} />
      </div>
      <Select
        label="Text align"
        value={block.styles?.textAlign ?? ''}
        onChange={e => updateStyles({ textAlign: e.target.value || null })}
        options={[{ label: 'Default', value: '' }, { label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }]}
      />
      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
        <input type="checkbox" checked={block.hidden} onChange={e => update({ hidden: e.target.checked } as any)} className="accent-brand-600" />
        Hide this block (use logic to show it)
      </label>
    </Section>
  )

  const FieldBaseSection = () => (
    <Section title="Field settings">
      <Input label="Label" value={cfg.label ?? ''} onChange={e => updateConfig({ label: e.target.value })} />
      <Input label="Placeholder" value={cfg.placeholder ?? ''} onChange={e => updateConfig({ placeholder: e.target.value })} />
      <Input label="Field name (key in submission)" value={cfg.fieldName ?? ''} onChange={e => updateConfig({ fieldName: e.target.value })} />
      <Input label="Help text" value={cfg.helpText ?? ''} onChange={e => updateConfig({ helpText: e.target.value })} />
      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
        <input type="checkbox" checked={cfg.required ?? false} onChange={e => updateConfig({ required: e.target.checked })} className="accent-brand-600" />
        Required field
      </label>
    </Section>
  )

  switch (block.type) {
    case 'heading':
      return (
        <div className="p-4 flex flex-col gap-4">
          <Section title="Content">
            <Input label="Text" value={cfg.text ?? ''} onChange={e => updateConfig({ text: e.target.value })} />
            <Select label="Level" value={String(cfg.level ?? 1)} onChange={e => updateConfig({ level: Number(e.target.value) })}
              options={[{ label: 'H1 — Page title', value: '1' }, { label: 'H2 — Section heading', value: '2' }, { label: 'H3 — Sub-heading', value: '3' }, { label: 'H4 — Small heading', value: '4' }]}
            />
            <ColorPicker label="Text color" value={cfg.color ?? '#1a1a2e'} onChange={v => updateConfig({ color: v })} />
          </Section>
          <StylesSection />
        </div>
      )

    case 'paragraph':
      return (
        <div className="p-4 flex flex-col gap-4">
          <Section title="Content">
            <RichTextEditor label="Content" value={cfg.html ?? ''} onChange={v => updateConfig({ html: v })} />
            <ColorPicker label="Text color" value={cfg.color ?? '#374151'} onChange={v => updateConfig({ color: v })} />
          </Section>
          <StylesSection />
        </div>
      )

    case 'image':
      return (
        <div className="p-4 flex flex-col gap-4">
          <Section title="Image">
            <Input label="Image URL" value={cfg.src ?? ''} onChange={e => updateConfig({ src: e.target.value })} placeholder="https://..." />
            <Input label="Alt text" value={cfg.alt ?? ''} onChange={e => updateConfig({ alt: e.target.value })} />
            <Input label="Width" value={cfg.width ?? ''} onChange={e => updateConfig({ width: e.target.value })} placeholder="100% or 400px" />
            <Input label="Link URL (optional)" value={cfg.linkUrl ?? ''} onChange={e => updateConfig({ linkUrl: e.target.value })} />
          </Section>
          <StylesSection />
        </div>
      )

    case 'video':
      return (
        <div className="p-4 flex flex-col gap-4">
          <Section title="Video">
            <Input label="Embed URL" value={cfg.embedUrl ?? ''} onChange={e => updateConfig({ embedUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
            <Select label="Aspect ratio" value={cfg.aspectRatio ?? '16:9'} onChange={e => updateConfig({ aspectRatio: e.target.value })}
              options={[{ label: '16:9 (Widescreen)', value: '16:9' }, { label: '4:3 (Standard)', value: '4:3' }, { label: '1:1 (Square)', value: '1:1' }]}
            />
          </Section>
          <StylesSection />
        </div>
      )

    case 'spacer':
      return (
        <div className="p-4 flex flex-col gap-4">
          <Section title="Spacer">
            <Input label="Height (px)" type="number" value={String(cfg.height ?? 32)} onChange={e => updateConfig({ height: Number(e.target.value) })} />
          </Section>
        </div>
      )

    case 'divider':
      return (
        <div className="p-4 flex flex-col gap-4">
          <Section title="Divider">
            <ColorPicker label="Color" value={cfg.color ?? '#e5e7eb'} onChange={v => updateConfig({ color: v })} />
            <Input label="Thickness (px)" type="number" value={String(cfg.thickness ?? 1)} onChange={e => updateConfig({ thickness: Number(e.target.value) })} />
            <Select label="Style" value={cfg.style ?? 'solid'} onChange={e => updateConfig({ style: e.target.value })}
              options={[{ label: 'Solid', value: 'solid' }, { label: 'Dashed', value: 'dashed' }, { label: 'Dotted', value: 'dotted' }]}
            />
          </Section>
          <StylesSection />
        </div>
      )

    case 'button':
      return (
        <div className="p-4 flex flex-col gap-4">
          <Section title="Button">
            <Input label="Label" value={cfg.label ?? ''} onChange={e => updateConfig({ label: e.target.value })} />
            <Select label="Action" value={cfg.action ?? 'next_step'} onChange={e => updateConfig({ action: e.target.value })}
              options={[{ label: 'Go to next step', value: 'next_step' }, { label: 'Go to previous step', value: 'prev_step' }, { label: 'Submit form', value: 'submit' }, { label: 'Open URL', value: 'url' }]}
            />
            {cfg.action === 'url' && (
              <>
                <Input label="URL" value={cfg.url ?? ''} onChange={e => updateConfig({ url: e.target.value })} placeholder="https://..." />
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={cfg.openInNewTab ?? false} onChange={e => updateConfig({ openInNewTab: e.target.checked })} className="accent-brand-600" />
                  Open in new tab
                </label>
              </>
            )}
          </Section>
          <Section title="Style">
            <Select label="Variant" value={cfg.variant ?? 'filled'} onChange={e => updateConfig({ variant: e.target.value })}
              options={[{ label: 'Filled', value: 'filled' }, { label: 'Outline', value: 'outline' }, { label: 'Ghost', value: 'ghost' }]}
            />
            <Select label="Size" value={cfg.size ?? 'md'} onChange={e => updateConfig({ size: e.target.value })}
              options={[{ label: 'Small', value: 'sm' }, { label: 'Medium', value: 'md' }, { label: 'Large', value: 'lg' }]}
            />
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" checked={cfg.fullWidth ?? true} onChange={e => updateConfig({ fullWidth: e.target.checked })} className="accent-brand-600" />
              Full width
            </label>
            <ColorPicker label="Background color" value={cfg.color ?? '#6471f5'} onChange={v => updateConfig({ color: v })} />
            <ColorPicker label="Text color" value={cfg.textColor ?? '#ffffff'} onChange={v => updateConfig({ textColor: v })} />
          </Section>
          <StylesSection />
        </div>
      )

    // ── Form fields ────────────────────────────────────────────────────────
    case 'text_input':
    case 'email_input':
    case 'phone_input':
    case 'number_input':
    case 'textarea':
    case 'date_picker':
    case 'file_upload':
      return (
        <div className="p-4 flex flex-col gap-4">
          <FieldBaseSection />
          {block.type === 'textarea' && (
            <Section title="Options">
              <Input label="Rows" type="number" value={String(cfg.rows ?? 4)} onChange={e => updateConfig({ rows: Number(e.target.value) })} />
            </Section>
          )}
          {block.type === 'number_input' && (
            <Section title="Options">
              <div className="grid grid-cols-2 gap-2">
                <Input label="Min" type="number" value={String(cfg.min ?? '')} onChange={e => updateConfig({ min: e.target.value ? Number(e.target.value) : null })} />
                <Input label="Max" type="number" value={String(cfg.max ?? '')} onChange={e => updateConfig({ max: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label="Prefix" value={cfg.prefix ?? ''} onChange={e => updateConfig({ prefix: e.target.value })} placeholder="$" />
                <Input label="Suffix" value={cfg.suffix ?? ''} onChange={e => updateConfig({ suffix: e.target.value })} placeholder="%" />
              </div>
            </Section>
          )}
          {block.type === 'file_upload' && (
            <Section title="Options">
              <Input label="Accepted types" value={cfg.accept ?? ''} onChange={e => updateConfig({ accept: e.target.value })} placeholder=".pdf,.docx,.jpg" />
              <Input label="Max size (MB)" type="number" value={String(cfg.maxSizeMb ?? 10)} onChange={e => updateConfig({ maxSizeMb: Number(e.target.value) })} />
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={cfg.multiple ?? false} onChange={e => updateConfig({ multiple: e.target.checked })} className="accent-brand-600" />
                Allow multiple files
              </label>
            </Section>
          )}
          <StylesSection />
        </div>
      )

    case 'select':
    case 'radio_group':
    case 'checkbox_group':
      return (
        <div className="p-4 flex flex-col gap-4">
          <FieldBaseSection />
          <Section title="Options">
            <OptionsEditor
              options={cfg.options ?? []}
              onChange={options => updateConfig({ options })}
            />
          </Section>
          {(block.type === 'radio_group' || block.type === 'checkbox_group') && (
            <Section title="Layout">
              <Select label="Layout" value={cfg.layout ?? 'vertical'} onChange={e => updateConfig({ layout: e.target.value })}
                options={[{ label: 'Vertical', value: 'vertical' }, { label: 'Horizontal', value: 'horizontal' }, { label: 'Grid', value: 'grid' }]}
              />
            </Section>
          )}
          <StylesSection />
        </div>
      )

    case 'checkbox_single':
      return (
        <div className="p-4 flex flex-col gap-4">
          <FieldBaseSection />
          <Section title="Checkbox">
            <Textarea label="Checkbox label (HTML allowed)" value={cfg.checkboxLabel ?? ''} onChange={e => updateConfig({ checkboxLabel: e.target.value })} rows={2} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Checked value" value={cfg.checkedValue ?? 'yes'} onChange={e => updateConfig({ checkedValue: e.target.value })} />
              <Input label="Unchecked value" value={cfg.uncheckedValue ?? 'no'} onChange={e => updateConfig({ uncheckedValue: e.target.value })} />
            </div>
          </Section>
          <StylesSection />
        </div>
      )

    case 'rating':
      return (
        <div className="p-4 flex flex-col gap-4">
          <FieldBaseSection />
          <Section title="Rating">
            <Select label="Max rating" value={String(cfg.maxRating ?? 5)} onChange={e => updateConfig({ maxRating: Number(e.target.value) })}
              options={[{ label: '5 stars', value: '5' }, { label: '10 stars', value: '10' }]}
            />
            <Select label="Icon" value={cfg.icon ?? 'star'} onChange={e => updateConfig({ icon: e.target.value })}
              options={[{ label: '★ Star', value: 'star' }, { label: '♥ Heart', value: 'heart' }, { label: '👍 Thumb', value: 'thumb' }]}
            />
          </Section>
          <StylesSection />
        </div>
      )

    case 'slider':
      return (
        <div className="p-4 flex flex-col gap-4">
          <FieldBaseSection />
          <Section title="Slider">
            <div className="grid grid-cols-3 gap-2">
              <Input label="Min" type="number" value={String(cfg.min ?? 0)} onChange={e => updateConfig({ min: Number(e.target.value) })} />
              <Input label="Max" type="number" value={String(cfg.max ?? 100)} onChange={e => updateConfig({ max: Number(e.target.value) })} />
              <Input label="Step" type="number" value={String(cfg.step ?? 1)} onChange={e => updateConfig({ step: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Prefix" value={cfg.prefix ?? ''} onChange={e => updateConfig({ prefix: e.target.value })} />
              <Input label="Suffix" value={cfg.suffix ?? ''} onChange={e => updateConfig({ suffix: e.target.value })} />
            </div>
          </Section>
          <StylesSection />
        </div>
      )

    case 'opinion_scale':
      return (
        <div className="p-4 flex flex-col gap-4">
          <FieldBaseSection />
          <Section title="Scale">
            <Select label="Steps" value={String(cfg.steps ?? 11)} onChange={e => updateConfig({ steps: Number(e.target.value) })}
              options={[{ label: '0–10 (11 steps)', value: '11' }, { label: '1–10 (10 steps)', value: '10' }, { label: '1–7 (7 steps)', value: '7' }, { label: '1–5 (5 steps)', value: '5' }]}
            />
            <Input label="Start label" value={cfg.startLabel ?? ''} onChange={e => updateConfig({ startLabel: e.target.value })} placeholder="Not likely" />
            <Input label="End label" value={cfg.endLabel ?? ''} onChange={e => updateConfig({ endLabel: e.target.value })} placeholder="Very likely" />
          </Section>
          <StylesSection />
        </div>
      )

    case 'name_fields':
      return (
        <div className="p-4 flex flex-col gap-4">
          <FieldBaseSection />
          <Section title="Fields to show">
            {(['firstName', 'lastName', 'middleName', 'prefix', 'suffix'] as const).map(f => (
              <label key={f} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer capitalize">
                <input type="checkbox" checked={cfg.fields?.[f] ?? false} onChange={e => updateConfig({ fields: { ...(cfg.fields ?? {}), [f]: e.target.checked } })} className="accent-brand-600" />
                {f.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
            ))}
          </Section>
          <StylesSection />
        </div>
      )

    case 'picture_choice':
      return (
        <div className="p-4 flex flex-col gap-4">
          <FieldBaseSection />
          <Section title="Options">
            <PictureOptionsEditor
              options={cfg.options ?? []}
              onChange={options => updateConfig({ options })}
            />
            <Select label="Columns" value={String(cfg.columns ?? 2)} onChange={e => updateConfig({ columns: Number(e.target.value) })}
              options={[{ label: '2 columns', value: '2' }, { label: '3 columns', value: '3' }, { label: '4 columns', value: '4' }]}
            />
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" checked={cfg.multi ?? false} onChange={e => updateConfig({ multi: e.target.checked })} className="accent-brand-600" />
              Allow multiple selections
            </label>
          </Section>
          <StylesSection />
        </div>
      )

    case 'legal_consent':
      return (
        <div className="p-4 flex flex-col gap-4">
          <FieldBaseSection />
          <Section title="Consent text">
            <RichTextEditor label="HTML content" value={cfg.html ?? ''} onChange={v => updateConfig({ html: v })} />
          </Section>
          <StylesSection />
        </div>
      )

    default:
      return <div className="p-4 text-xs text-gray-400">No settings for this block type.</div>
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</h4>
      {children}
    </div>
  )
}

function OptionsEditor({ options, onChange }: { options: { label: string; value: string }[]; onChange: (o: any[]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o, i) => (
        <div key={i} className="flex gap-1.5 items-center">
          <input
            className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-brand-400"
            value={o.label}
            onChange={e => {
              const next = [...options]
              next[i] = { ...o, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') }
              onChange(next)
            }}
            placeholder="Option label"
          />
          <button onClick={() => onChange(options.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 shrink-0">✕</button>
        </div>
      ))}
      <button
        onClick={() => onChange([...options, { label: `Option ${options.length + 1}`, value: `option_${options.length + 1}` }])}
        className="text-xs text-brand-600 hover:text-brand-700 text-left"
      >
        + Add option
      </button>
    </div>
  )
}

function PictureOptionsEditor({ options, onChange }: { options: any[]; onChange: (o: any[]) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((o, i) => (
        <div key={i} className="border border-gray-100 rounded-lg p-2 flex flex-col gap-1.5">
          <input className="text-xs border border-gray-200 rounded px-2 py-1" value={o.label} onChange={e => { const next = [...options]; next[i] = { ...o, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') }; onChange(next) }} placeholder="Label" />
          <input className="text-xs border border-gray-200 rounded px-2 py-1" value={o.imageUrl ?? ''} onChange={e => { const next = [...options]; next[i] = { ...o, imageUrl: e.target.value }; onChange(next) }} placeholder="Image URL" />
          <button onClick={() => onChange(options.filter((_, j) => j !== i))} className="text-xs text-red-400 text-left">Remove</button>
        </div>
      ))}
      <button onClick={() => onChange([...options, { label: `Option ${options.length + 1}`, value: `opt_${options.length + 1}`, imageUrl: '', altText: '' }])} className="text-xs text-brand-600">+ Add option</button>
    </div>
  )
}
