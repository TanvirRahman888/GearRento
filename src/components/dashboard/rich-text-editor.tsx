"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Undo2,
  Redo2,
} from "lucide-react";

type RichTextEditorProps = {
  initialContent?: string;
  onChange: (html: string, text: string) => void;
};

export function RichTextEditor({
  initialContent = "",
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],

    // Load existing description when editing
    content: initialContent,

    // Prevent Next.js hydration problems
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[180px] px-4 py-3 text-sm leading-7 outline-none [&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-bold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-1",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText());
    },
  });

  const toolbar = [
    {
      label: "Bold",
      icon: Bold,
      action: () => editor?.chain().focus().toggleBold().run(),
      active: editor?.isActive("bold"),
    },
    {
      label: "Italic",
      icon: Italic,
      action: () => editor?.chain().focus().toggleItalic().run(),
      active: editor?.isActive("italic"),
    },
    {
      label: "Heading",
      icon: Heading2,
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor?.isActive("heading", { level: 2 }),
    },
    {
      label: "Bullet List",
      icon: List,
      action: () => editor?.chain().focus().toggleBulletList().run(),
      active: editor?.isActive("bulletList"),
    },
    {
      label: "Numbered List",
      icon: ListOrdered,
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      active: editor?.isActive("orderedList"),
    },
    {
      label: "Undo",
      icon: Undo2,
      action: () => editor?.chain().focus().undo().run(),
    },
    {
      label: "Redo",
      icon: Redo2,
      action: () => editor?.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background focus-within:border-primary">
      <div className="flex flex-wrap gap-1 border-b border-border bg-muted/60 p-2">
        {toolbar.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.label}
              type="button"
              disabled={!editor}
              title={tool.label}
              aria-label={tool.label}
              aria-pressed={tool.active ?? false}
              onClick={tool.action}
              className={`flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-accent disabled:opacity-50 ${
                tool.active ? "bg-secondary text-primary" : "text-foreground"
              }`}
            >
              <Icon size={17} />
            </button>
          );
        })}
      </div>

      <EditorContent editor={editor} />

      {!editor && (
        <p className="px-4 py-3 text-sm text-muted-foreground">
          Loading editor...
        </p>
      )}
    </div>
  );
}
