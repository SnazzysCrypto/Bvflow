import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  label?: string
}

export function RichTextEditor({ value, onChange, label }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        {editor && (
          <div className="flex gap-1 p-1.5 border-b border-gray-100 bg-gray-50 flex-wrap">
            {[
              { label: 'B', cmd: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
              { label: 'I', cmd: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
            ].map((btn, i) => (
              <button
                key={i}
                onMouseDown={e => { e.preventDefault(); btn.cmd() }}
                className={`px-2 py-0.5 text-xs rounded font-medium ${btn.active ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100'}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-2 min-h-[80px] text-sm focus-within:outline-none"
        />
      </div>
    </div>
  )
}
