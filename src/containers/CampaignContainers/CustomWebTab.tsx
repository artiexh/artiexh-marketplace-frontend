"use client";

import Thumbnail from "@/components/CreateProduct/Thumbnail";
import { Button, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor, Link } from "@mantine/tiptap";

function CustomWebTab() {
  const { errors, onSubmit, setFieldValue, getInputProps, values } = useForm();

  const editor = useEditor({
    extensions: [StarterKit],

    onUpdate({ editor }) {
      setFieldValue("content", editor.getHTML());
    },
  });

  const updateWebInfo = (data: any) => {
    console.log(data);
  };
  return (
    <form onSubmit={onSubmit(updateWebInfo)} className="mt-5">
      <Thumbnail
        setFile={(file) => {
          setFieldValue("thumbnail", file);
        }}
        error={errors.thumbnail as string}
        defaultPlaceholder={
          <div className="flex flex-col items-center">
            <p className="text-4xl font-thin">+</p>
            <p>Add thumbnail</p>
          </div>
        }
        className="!h-[20rem]"
        clearable
        onClear={() => {
          setFieldValue("thumbnail", undefined);
        }}
      />

      <RichTextEditor
        editor={editor}
        className="mt-5"
        {...getInputProps("content")}
      >
        <RichTextEditor.Content />

        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
          <div className="flex-1 flex justify-end bg-white pr-2 pb-2">
            <Button type="submit">Update</Button>
          </div>
        </RichTextEditor.Toolbar>
      </RichTextEditor>
    </form>
  );
}

export default CustomWebTab;
