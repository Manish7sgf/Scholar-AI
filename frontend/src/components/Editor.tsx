'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Editor() {
  const { sections, activeSection, updateSection } = usePaperStore();

  const currentSection = sections.find((s) => s.id === activeSection);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your section content...',
      }),
    ],
    content: currentSection?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (activeSection) {
        updateSection(activeSection, editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor && currentSection) {
      const content = currentSection.content || '';
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [activeSection, currentSection, editor]);

  if (!activeSection || !currentSection) {
    return (
      <div className="flex-1 flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <p className="text-secondary-500 text-lg mb-2">No section selected</p>
          <p className="text-secondary-400 text-sm">
            Select or create a section from the sidebar to start writing
          </p>
        </div>
      </div>
    );
  }

  if (!editor) {
    return <div className="flex-1 flex items-center justify-center">Loading editor...</div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Toolbar */}
      <div className="border-b border-secondary-200 bg-secondary-50">
        <div className="flex items-center space-x-1 p-3">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              'p-2 rounded hover:bg-secondary-200 transition-colors',
              editor.isActive('bold') ? 'bg-secondary-200 text-primary-600' : 'text-secondary-700'
            )}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              'p-2 rounded hover:bg-secondary-200 transition-colors',
              editor.isActive('italic') ? 'bg-secondary-200 text-primary-600' : 'text-secondary-700'
            )}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-secondary-300 mx-2" />

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              'p-2 rounded hover:bg-secondary-200 transition-colors',
              editor.isActive('heading', { level: 1 })
                ? 'bg-secondary-200 text-primary-600'
                : 'text-secondary-700'
            )}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              'p-2 rounded hover:bg-secondary-200 transition-colors',
              editor.isActive('heading', { level: 2 })
                ? 'bg-secondary-200 text-primary-600'
                : 'text-secondary-700'
            )}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              'p-2 rounded hover:bg-secondary-200 transition-colors',
              editor.isActive('heading', { level: 3 })
                ? 'bg-secondary-200 text-primary-600'
                : 'text-secondary-700'
            )}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-secondary-300 mx-2" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              'p-2 rounded hover:bg-secondary-200 transition-colors',
              editor.isActive('bulletList')
                ? 'bg-secondary-200 text-primary-600'
                : 'text-secondary-700'
            )}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              'p-2 rounded hover:bg-secondary-200 transition-colors',
              editor.isActive('orderedList')
                ? 'bg-secondary-200 text-primary-600'
                : 'text-secondary-700'
            )}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-secondary-300 mx-2" />

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              'p-2 rounded hover:bg-secondary-200 transition-colors',
              editor.isActive('blockquote')
                ? 'bg-secondary-200 text-primary-600'
                : 'text-secondary-700'
            )}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(
              'p-2 rounded hover:bg-secondary-200 transition-colors',
              editor.isActive('code') ? 'bg-secondary-200 text-primary-600' : 'text-secondary-700'
            )}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-secondary-300 mx-2" />

          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-secondary-200 transition-colors text-secondary-700 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-secondary-200 transition-colors text-secondary-700 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Section Header */}
      <div className="border-b border-secondary-200 px-6 py-4">
        <input
          type="text"
          value={currentSection.name}
          onChange={(e) => {
            const updatedSections = sections.map((s) =>
              s.id === activeSection ? { ...s, name: e.target.value } : s
            );
            usePaperStore.setState({ sections: updatedSections });
          }}
          className="text-2xl font-bold text-secondary-900 w-full focus:outline-none"
          placeholder="Section Name"
        />
        <p className="text-sm text-secondary-500 mt-1">
          {currentSection.wordCount} words
        </p>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
