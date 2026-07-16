import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  FiBold, FiItalic, FiUnderline, FiList, FiCode, FiChevronDown,
  FiAlignLeft, FiAlignCenter, FiAlignRight, FiMinus,
} from 'react-icons/fi';
import { LuHeading1, LuHeading2, LuHeading3, LuListOrdered, LuQuote } from 'react-icons/lu';

const ToolbarButton = ({ onClick, active, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-lg transition-colors duration-200 ${
      active ? 'bg-accent/15 text-accent' : 'text-text/50 hover:text-text hover:bg-primary/5'
    }`}
  >
    {children}
  </button>
);

const Dropdown = ({ label, items, activeKey }) => {
  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1 p-2 rounded-lg text-text/50 hover:text-text hover:bg-primary/5 transition-colors duration-200 text-sm font-medium"
      >
        {label} <FiChevronDown className="w-3 h-3" />
      </button>
      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-primary/5 py-1 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            className={`w-full text-left px-3 py-1.5 text-sm font-body transition-colors duration-200 ${
              activeKey === item.key ? 'text-accent bg-accent/10' : 'text-text/70 hover:text-text hover:bg-primary/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const TiptapEditor = ({ content, onChange, placeholder = 'Write your content here...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none font-body text-text/80 min-h-[300px] outline-none px-4 py-3',
      },
    },
  });

  if (!editor) return null;

  const headingItems = [
    { key: '1', label: 'Heading 1', onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { key: '2', label: 'Heading 2', onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { key: '3', label: 'Heading 3', onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { key: 'p', label: 'Paragraph', onClick: () => editor.chain().focus().setParagraph().run() },
  ];

  const activeHeading = [1, 2, 3].find((l) => editor.isActive('heading', { level: l })) || 'p';

  return (
    <div className="border-2 border-primary/10 rounded-lg overflow-hidden focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(200,155,60,0.1)] transition-all duration-300">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-primary/10 bg-cream/50">
        <Dropdown label={activeHeading === 'p' ? 'Paragraph' : `Heading ${activeHeading}`} items={headingItems} activeKey={String(activeHeading)} />

        <div className="w-px h-6 bg-primary/10 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <FiBold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <FiItalic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <FiUnderline className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-primary/10 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          <FiList className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
          <LuListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-primary/10 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <LuQuote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
          <FiCode className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-primary/10 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <FiAlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <FiAlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <FiAlignRight className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-primary/10 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <FiMinus className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
