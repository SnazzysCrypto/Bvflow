import React, { useRef } from 'react'
import { useBuilderStore } from '../../../store/builderStore'
import { Input, Textarea } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { ColorPicker } from '../../../components/ui/ColorPicker'
import { FONT_OPTIONS } from '../../../constants/defaultBranding'

export function FunnelInspector() {
  const funnel = useBuilderStore(s => s.funnel)
  const updateFunnelMeta = useBuilderStore(s => s.updateFunnelMeta)
  const updateBranding = useBuilderStore(s => s.updateBranding)
  const updateFunnelSettings = useBuilderStore(s => s.updateFunnelSettings)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!funnel) return null

  const b = funnel.branding
  const s = funnel.settings

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => updateBranding({ logoUrl: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="p-4 flex flex-col gap-5">
      <Section title="Funnel info">
        <Input label="Title" value={funnel.title} onChange={e => updateFunnelMeta({ title: e.target.value })} />
        <Textarea label="Description" value={funnel.description} onChange={e => updateFunnelMeta({ description: e.target.value })} rows={2} />
        <Input label="Slug" value={funnel.slug} onChange={e => updateFunnelMeta({ slug: e.target.value })} hint="Used as export filename" />
      </Section>

      <Section title="Branding">
        {/* Logo */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Logo</label>
          {b.logoUrl && (
            <div className="flex items-center gap-2 mb-1">
              <img src={b.logoUrl} alt="Logo" className="h-8 border border-gray-200 rounded p-0.5" />
              <button onClick={() => updateBranding({ logoUrl: null })} className="text-xs text-red-400 hover:text-red-600">Remove</button>
            </div>
          )}
          <button onClick={() => fileRef.current?.click()} className="text-xs text-brand-600 hover:underline text-left">
            {b.logoUrl ? 'Change logo' : 'Upload logo'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>

        <ColorPicker label="Primary color" value={b.primaryColor} onChange={v => updateBranding({ primaryColor: v })} />
        <ColorPicker label="Accent color" value={b.accentColor} onChange={v => updateBranding({ accentColor: v })} />
        <ColorPicker label="Background color" value={b.backgroundColor} onChange={v => updateBranding({ backgroundColor: v })} />

        <Select
          label="Font"
          value={b.fontFamily}
          onChange={e => updateBranding({ fontFamily: e.target.value })}
          options={FONT_OPTIONS}
        />

        <Select
          label="Border radius"
          value={b.borderRadius}
          onChange={e => updateBranding({ borderRadius: e.target.value as any })}
          options={[
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
            { label: 'Pill', value: 'full' },
          ]}
        />

        <Select
          label="Button style"
          value={b.buttonStyle}
          onChange={e => updateBranding({ buttonStyle: e.target.value as any })}
          options={[{ label: 'Filled', value: 'filled' }, { label: 'Outline', value: 'outline' }, { label: 'Ghost', value: 'ghost' }]}
        />

        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input type="checkbox" checked={b.progressBar} onChange={e => updateBranding({ progressBar: e.target.checked })} className="accent-brand-600" />
          Show progress bar
        </label>
      </Section>

      <Section title="SEO & meta">
        <Input label="Meta title" value={s.metaTitle ?? ''} onChange={e => updateFunnelSettings({ metaTitle: e.target.value || null })} />
        <Textarea label="Meta description" value={s.metaDescription ?? ''} onChange={e => updateFunnelSettings({ metaDescription: e.target.value || null })} rows={2} />
      </Section>

      <Section title="Submission settings">
        <Textarea
          label="Thank-you message (HTML)"
          value={s.thankYouMessage ?? ''}
          onChange={e => updateFunnelSettings({ thankYouMessage: e.target.value || null })}
          rows={3}
          placeholder="<h2>Thank you!</h2><p>We'll be in touch soon.</p>"
        />
        <Input label="Redirect URL after submit" value={s.redirectAfterSubmit ?? ''} onChange={e => updateFunnelSettings({ redirectAfterSubmit: e.target.value || null })} placeholder="https://..." />
      </Section>

      <Section title="Custom CSS">
        <Textarea
          label=""
          value={b.customCss}
          onChange={e => updateBranding({ customCss: e.target.value })}
          rows={5}
          placeholder=".funnel-wrap { max-width: 720px; }"
        />
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</h4>
      {children}
    </div>
  )
}
