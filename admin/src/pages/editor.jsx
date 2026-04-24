import { useEffect, useImperativeHandle, forwardRef, useRef, useCallback, useState } from 'react';
import { useEditor, EditorContent, Node, Mark, mergeAttributes, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import './editor.css';

// ─── FontSize Mark — change size of selected text only (inline) ───────────────
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
    addCommands() {
        return {
            setFontSize: (size) => ({ commands }) => commands.setMark(this.name, { size }),
            unsetFontSize: () => ({ commands }) => commands.unsetMark(this.name),
        };
    },
});

// ─── Inline Label Mark ────────────────────────────────────────────────────────
const InlineLabel = Mark.create({
    name: 'inlineLabel',
    parseHTML() { return [{ tag: 'span[data-label]' }]; },
    renderHTML() { return ['span', { 'data-label': '', style: 'font-weight:700;color:#FF1033;' }, 0]; },
});

// ─── Resizable Image Node View ────────────────────────────────────────────────
const ResizableImageView = ({ node, updateAttributes, selected }) => {
    const { src, alt, width, align } = node.attrs;
    const isResizing = useRef(false);
    const startX = useRef(0);
    const startW = useRef(0);

    const onMouseDown = useCallback((e) => {
        e.preventDefault();
        isResizing.current = true;
        startX.current = e.clientX;
        // Always parse as integer to avoid "400px" string issues
        startW.current = parseInt(width, 10) || 400;

        const onMove = (ev) => {
            if (!isResizing.current) return;
            const delta = ev.clientX - startX.current;
            const newW = Math.max(80, Math.min(900, startW.current + delta));
            updateAttributes({ width: newW }); // store as number
        };
        const onUp = () => {
            isResizing.current = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, [width, updateAttributes]);

    const w = parseInt(width, 10) || 400;
    const alignStyle = align === 'left'
        ? { float: 'left', marginRight: 16, marginBottom: 8 }
        : align === 'right'
        ? { float: 'right', marginLeft: 16, marginBottom: 8 }
        : { display: 'block', margin: '12px auto' };

    return (
        <NodeViewWrapper style={{ ...alignStyle, width: w, position: 'relative', display: align === 'center' ? 'block' : 'inline-block' }}>
            {/* Alignment toolbar — shows on select */}
            {selected && (
                <div className="img-toolbar">
                    <button type="button" title="Align left"  onClick={() => updateAttributes({ align: 'left' })}   className={align === 'left'   ? 'active' : ''}>◧</button>
                    <button type="button" title="Align center" onClick={() => updateAttributes({ align: 'center' })} className={align === 'center' ? 'active' : ''}>◫</button>
                    <button type="button" title="Align right" onClick={() => updateAttributes({ align: 'right' })}  className={align === 'right'  ? 'active' : ''}>◨</button>
                </div>
            )}
            <img
                src={src}
                alt={alt || ''}
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 6, outline: selected ? '2px solid #4f46e5' : 'none' }}
                draggable={false}
            />
            {/* Resize handle — bottom-right corner */}
            <div
                className="resize-handle"
                onMouseDown={onMouseDown}
                title="Drag to resize"
            />
        </NodeViewWrapper>
    );
};

// ─── Resizable Image Extension ────────────────────────────────────────────────
const ResizableImage = Node.create({
    name: 'resizableImage',
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            src:   { default: null },
            alt:   { default: '' },
            // Store width as number, parse it back from data-width attribute
            width: {
                default: 400,
                parseHTML: el => parseInt(el.getAttribute('data-width') || el.style.width || '400', 10),
                renderHTML: attrs => ({ 'data-width': attrs.width }),
            },
            align: {
                default: 'center',
                parseHTML: el => el.getAttribute('data-align') || 'center',
                renderHTML: attrs => ({ 'data-align': attrs.align }),
            },
        };
    },
    parseHTML() {
        return [{ tag: 'img[data-resizable]' }];
    },
    renderHTML({ HTMLAttributes }) {
        const w = parseInt(HTMLAttributes['data-width'] || 400, 10);
        const align = HTMLAttributes['data-align'] || 'center';
        const style = align === 'left'
            ? `float:left;margin-right:16px;margin-bottom:8px;width:${w}px;height:auto;`
            : align === 'right'
            ? `float:right;margin-left:16px;margin-bottom:8px;width:${w}px;height:auto;`
            : `display:block;margin:12px auto;width:${w}px;height:auto;`;
        const { src, alt } = HTMLAttributes;
        return ['img', { src, alt: alt || '', 'data-resizable': '', 'data-width': w, 'data-align': align, style }];
    },
    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageView);
    },
});

// ─── CTA Button Node ──────────────────────────────────────────────────────────
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
    addNodeView() {
        return ({ node }) => {
            const dom = document.createElement('a');
            dom.setAttribute('data-cta-button', '');
            dom.href = node.attrs.href;
            dom.target = '_blank';
            dom.textContent = node.attrs.label;
            dom.style.cssText = 'display:inline-block;background:#FF1033;color:#fff;padding:12px 28px;border-radius:50px;font-weight:700;text-decoration:none;font-size:15px;margin:12px 0;cursor:pointer;';
            return { dom };
        };
    },
});

// ─── Toolbar helpers ──────────────────────────────────────────────────────────
const Btn = ({ onClick, active, disabled, title, children, style }) => (
    <button type="button" onMouseDown={(e) => { e.preventDefault(); onClick(); }} disabled={disabled} title={title} className={active ? 'active' : ''} style={style}>
        {children}
    </button>
);
const Sep = () => <div className="divider" />;

// ─── Toolbar ──────────────────────────────────────────────────────────────────
const SIZES = [
    { label: 'Normal', value: null },
    { label: 'Small',  value: '0.85em' },
    { label: 'Large',  value: '1.25em' },
    { label: 'XL',     value: '1.6em' },
    { label: 'XXL',    value: '2em' },
    { label: '3XL',    value: '2.5em' },
];

const Toolbar = ({ editor, onImages, onCta }) => {
    if (!editor) return null;

    const [currentSize,setCurrentSIze] = useState(editor.getAttributes('fontSize').size || null)

    const applySize = (e) => {
        const val = e.target.value;
        setCurrentSIze(val)
        if (!val) editor.chain().focus().unsetMark('fontSize').run();
        else editor.chain().focus().setMark('fontSize', { size: val }).run();
    };

    const addLink = () => {
        const prev = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', prev || 'https://');
        if (url === null) return;
        if (!url) { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
    };

    return (
        <div className="tiptap-toolbar">
            <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><strong>B</strong></Btn>
            <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><em>I</em></Btn>
            <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><u>U</u></Btn>
            <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strike"><s>S</s></Btn>

            {/* Font size — applies to selected text only, stays inline */}
            <Sep />
            <select
                value={currentSize || ''}
                onChange={applySize}
                title="Text size (applies to selection only)"
                className="toolbar-select"
            >
                {SIZES.map(s => <option key={s.label} value={s.value || ''}>{s.label}</option>)}
            </select>
            <Sep />
            {[1,2,3,4].map(l => (
                <Btn key={l} onClick={() => editor.chain().focus().toggleHeading({ level: l }).run()} active={editor.isActive('heading', { level: l })} title={`H${l}`}>H{l}</Btn>
            ))}
            <Sep />
            <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            </Btn>
            <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 12h10M7 17h10M4 7h.01M4 12h.01M4 17h.01"/></svg>
            </Btn>
            <Sep />
            <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Left">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h10M4 14h16M4 18h10"/></svg>
            </Btn>
            <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Center">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 10h10M4 14h16M7 18h10"/></svg>
            </Btn>
            <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Right">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 10h10M4 14h16M10 18h10"/></svg>
            </Btn>
            <Sep />
            <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
            </Btn>
            <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            </Btn>
            <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Divider">—</Btn>
            <Sep />
            <Btn onClick={addLink} active={editor.isActive('link')} title="Add link">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            </Btn>
            <Btn onClick={onImages} active={false} title="Upload images (select multiple)">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </Btn>
            <Btn onClick={onCta} active={false} title="Insert CTA button" style={{ background: '#FF1033', color: '#fff', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700, minWidth: 'auto' }}>
                + Button
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().toggleMark('inlineLabel').run()}
                active={editor.isActive('inlineLabel')}
                title="Inline label — bold red text, stays on same line (use instead of H3 for labels)"
                style={editor.isActive('inlineLabel') ? { background: '#FF1033', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 700 } : { color: '#FF1033', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 700, border: '1px solid #FF1033' }}
            >
                Label
            </Btn>
            <Sep />
            <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} active={false} title="Undo">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
            </Btn>
            <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} active={false} title="Redo">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"/></svg>
            </Btn>
        </div>
    );
};

// ─── Main Editor ──────────────────────────────────────────────────────────────
const TipTapEditor = forwardRef(({ value, onChange, placeholder = 'Start writing...' }, ref) => {
    const fileInputRef = useRef(null);
    const isInitialized = useRef(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
            ResizableImage,
            Placeholder.configure({ placeholder }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            CtaButton,
            InlineLabel,
            FontSize,
        ],
        content: value || '',
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: { attributes: { class: 'focus:outline-none min-h-[450px]' } },
    });

    useEffect(() => {
        if (!editor) return;
        if (value && value !== editor.getHTML() && !isInitialized.current) {
            editor.commands.setContent(value, false);
            isInitialized.current = true;
        }
    }, [editor, value]);

    useEffect(() => { isInitialized.current = false; }, [value]);

    useImperativeHandle(ref, () => ({
        save: () => editor ? editor.getHTML() : '',
        uploadAndGetHTML: async () => {
            if (!editor) return '';
            const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            let html = editor.getHTML();
            const matches = [...html.matchAll(/src="(data:image\/[^;]+;base64,[^"]+)"/g)];
            for (const m of matches) {
                try {
                    const blob = await (await fetch(m[1])).blob();
                    const ext = blob.type.split('/')[1] || 'jpg';
                    const fd = new FormData();
                    fd.append('image', new File([blob], `img-${Date.now()}.${ext}`, { type: blob.type }));
                    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
                    const up = await fetch(`${base}/api/upload/image`, {
                        method: 'POST',
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                        body: fd,
                    });
                    if (up.ok) {
                        const { url } = await up.json();
                        html = html.replace(m[1], `${base}/api${url}`);
                    }
                } catch (e) { console.error('upload failed', e); }
            }
            return html;
        },
    }));

    const handleImages = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                editor.chain().focus().insertContent({
                    type: 'resizableImage',
                    attrs: { src: ev.target.result, alt: file.name.replace(/\.[^/.]+$/, ''), width: 400, align: 'center' },
                }).run();
            };
            reader.readAsDataURL(file);
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCta = () => {
        const label = window.prompt('Button text:', 'Apply Now');
        if (!label) return;
        const href = window.prompt('Button URL:', 'https://');
        if (!href) return;
        editor.chain().focus().insertContent({ type: 'ctaButton', attrs: { label, href } }).run();
    };

    return (
        <div className="tiptap-editor-wrapper">
            <Toolbar editor={editor} onImages={() => fileInputRef.current?.click()} onCta={handleCta} />
            <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImages} />
            <EditorContent editor={editor} />
            {editor && (
                <div className="tiptap-footer">
                    <span>{editor.getText().trim().split(/\s+/).filter(Boolean).length} words</span>
                    <span>TipTap Editor</span>
                </div>
            )}
        </div>
    );
});

TipTapEditor.displayName = 'TipTapEditor';
export default TipTapEditor;
