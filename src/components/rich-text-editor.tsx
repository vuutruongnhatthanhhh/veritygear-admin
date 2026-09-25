"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  ImageIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { MediaPicker } from "./media-picker";

const COLORS = ["#111827", "#DC2626", "#EA580C", "#CA8A04", "#16A34A", "#2563EB", "#7C3AED", "#DB2777"];

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "flex h-8 w-8 items-center justify-center rounded transition",
        active ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, bucket }: { editor: Editor; bucket: string }) {
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 p-2">
      <select
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p"
        }
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: Number(v[1]) as 1 | 2 | 3 }).run();
        }}
        className="h-8 rounded border border-zinc-300 bg-white px-2 text-xs text-zinc-700"
      >
        <option value="p">Đoạn văn</option>
        <option value="h1">Tiêu đề 1</option>
        <option value="h2">Tiêu đề 2</option>
        <option value="h3">Tiêu đề 3</option>
      </select>

      <div className="mx-1 h-5 w-px bg-zinc-200" />

      <ToolbarButton title="In đậm" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <BoldIcon size={15} />
      </ToolbarButton>
      <ToolbarButton title="In nghiêng" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <ItalicIcon size={15} />
      </ToolbarButton>
      <ToolbarButton title="Gạch chân" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon size={15} />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-zinc-200" />

      <ToolbarButton title="Danh sách" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton title="Danh sách số" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={15} />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-zinc-200" />

      <div className="flex items-center gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            title={c}
            onClick={() => editor.chain().focus().setColor(c).run()}
            className="h-5 w-5 rounded-full border border-zinc-300"
            style={{ backgroundColor: c }}
          />
        ))}
        <button
          type="button"
          title="Bỏ màu"
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-zinc-400 text-[8px] text-zinc-400"
        >
          ×
        </button>
      </div>

      <div className="mx-1 h-5 w-px bg-zinc-200" />

      <div className="relative">
        <ToolbarButton
          title="Chèn liên kết"
          active={editor.isActive("link")}
          onClick={() => {
            setLinkUrl(editor.getAttributes("link").href ?? "");
            setShowLinkInput((v) => !v);
          }}
        >
          <LinkIcon size={15} />
        </ToolbarButton>
        {showLinkInput && (
          <div className="absolute left-0 top-9 z-20 flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="h-7 w-48 rounded border border-zinc-300 bg-white px-2 text-xs"
            />
            <button
              type="button"
              onClick={() => {
                if (linkUrl) editor.chain().focus().setLink({ href: linkUrl }).run();
                else editor.chain().focus().unsetLink().run();
                setShowLinkInput(false);
              }}
              className="rounded bg-zinc-900 px-2 py-1 text-xs font-medium text-white"
            >
              OK
            </button>
          </div>
        )}
      </div>

      <ToolbarButton title="Chèn hình ảnh" onClick={() => setShowImagePicker(true)}>
        <ImageIcon size={15} />
      </ToolbarButton>

      {showImagePicker && (
        <MediaPicker
          bucket={bucket}
          title="Chèn hình ảnh vào bài"
          uploadLabel="Tải lên & chèn vào bài"
          onSelect={(url) => {
            editor.chain().focus().setImage({ src: url }).run();
            setShowImagePicker(false);
          }}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
}

export function RichTextEditor({
  name,
  defaultValue = "",
  bucket,
}: {
  name: string;
  defaultValue?: string;
  bucket: string;
}) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "tiptap-link" } }),
      TiptapImage.configure({ HTMLAttributes: { class: "tiptap-img" } }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] px-3 py-2 text-sm text-zinc-900 focus:outline-none max-w-none " +
          "[&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 " +
          "[&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_a]:underline [&_a]:text-blue-600 " +
          "[&_img]:my-3 [&_img]:max-w-full [&_img]:rounded " +
          "[&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-bold",
      },
    },
    onUpdate({ editor }) {
      setHtml(editor.getHTML());
    },
  });

  if (!editor) {
    return <div className="min-h-70 rounded-lg border border-zinc-300 bg-white" />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white">
      <Toolbar editor={editor} bucket={bucket} />
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} onChange={() => {}} />
    </div>
  );
}
