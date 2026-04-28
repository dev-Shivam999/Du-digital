import { useEditor, EditorContent, Node, Mark, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Table, TableCell, TableHeader } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';

// ── Same custom extensions as the admin editor (read-only, no NodeViews needed) ──

const FontSize = Mark.create({
  name: 'fontSize',
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: el => el.style.fontSize || null,
        renderHTML: attrs => attrs.size ? { style: `font-size:${attrs.size}` } : {},
      },
    };
  },
  parseHTML() { return [{ tag: 'span[style*="font-size"]' }]; },
  renderHTML({ HTMLAttributes }) { return ['span', HTMLAttributes, 0]; },
});

const InlineLabel = Mark.create({
  name: 'inlineLabel',
  parseHTML() { return [{ tag: 'span[data-label]' }]; },
  renderHTML() { return ['span', { 'data-label': '', style: 'font-weight:700;color:#FF1033;' }, 0]; },
});

// Resizable image — read-only: just renders the <img> with its saved inline style
const ResizableImage = Node.create({
  name: 'resizableImage',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src:   { default: null },
      alt:   { default: '' },
      width: {
        default: 400,
        parseHTML: el => parseInt(el.getAttribute('data-width') || '400', 10),
        renderHTML: attrs => ({ 'data-width': attrs.width }),
      },
      align: {
        default: 'center',
        parseHTML: el => el.getAttribute('data-align') || 'center',
        renderHTML: attrs => ({ 'data-align': attrs.align }),
      },
    };
  },
  parseHTML() { return [{ tag: 'img[data-resizable]' }]; },
  renderHTML({ HTMLAttributes }) {
    const w = parseInt(HTMLAttributes['data-width'] || 400, 10);
    const align = HTMLAttributes['data-align'] || 'center';
    const style = align === 'left'
      ? `float:left;margin-right:16px;margin-bottom:8px;width:${w}px;height:auto;border-radius:6px;`
      : align === 'right'
      ? `float:right;margin-left:16px;margin-bottom:8px;width:${w}px;height:auto;border-radius:6px;`
      : `display:block;margin:12px auto;width:${w}px;height:auto;border-radius:6px;`;
    return ['img', { src: HTMLAttributes.src, alt: HTMLAttributes.alt || '', 'data-resizable': '', 'data-width': w, 'data-align': align, style }];
  },
});

const CtaButton = Node.create({
  name: 'ctaButton',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      label: { default: 'Click Here' },
      href:  { default: '#' },
    };
  },
  parseHTML() { return [{ tag: 'a[data-cta-button]' }]; },
  renderHTML({ HTMLAttributes }) {
    const style = 'display:inline-block;background:#FF1033;color:#fff;padding:12px 28px;border-radius:50px;font-weight:700;text-decoration:none;font-size:15px;margin:12px 0;';
    return ['a', mergeAttributes(HTMLAttributes, { 'data-cta-button': '', href: HTMLAttributes.href, target: '_blank', rel: 'noopener noreferrer', style }), HTMLAttributes.label];
  },
});

const EXTENSIONS = [
  StarterKit,
  Underline,
  Link.configure({ openOnClick: true, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
  ResizableImage,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  CtaButton,
  InlineLabel,
  FontSize,
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
];

const BlogContentViewer = ({ content }) => {
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: content || '',
    editable: false,
    editorProps: { attributes: { class: 'blog-viewer-content' } },
  }, [content]);

  return <EditorContent editor={editor} />;
};

export default BlogContentViewer;
