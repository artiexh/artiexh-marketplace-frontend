"use client";

import Thumbnail from "@/components/CreateProduct/Thumbnail";
import { CampaignDetail } from "@/types/Campaign";
import { SaleCampaignDetail } from "@/types/SaleCampaign";
import { Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { RichTextEditor } from "@mantine/tiptap";
import { useQueryClient } from "@tanstack/react-query";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function CustomWebTab({ data: campaignData }: { data: SaleCampaignDetail }) {
  const queryClient = useQueryClient();
  const {
    errors,
    onSubmit,
    setFieldValue,
    getInputProps,
    values,
    isDirty,
    setValues,
  } = useForm<{
    content?: string;
    thumbnail?: string | File;
  }>({
    initialValues: {
      content: campaignData.content,
      thumbnail: campaignData.thumbnailUrl,
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: campaignData.content ?? "",
    editable: false,
    onUpdate({ editor }) {
      setFieldValue("content", editor.getHTML());
    },
  });

  return (
    <form className="mt-5">
      <Thumbnail
        url={
          values.thumbnail instanceof File
            ? URL.createObjectURL(values.thumbnail)
            : values.thumbnail
        }
        disabled
        error={errors.thumbnail as string}
        defaultPlaceholder={
          <div className="flex flex-col items-center">
            <p className="text-4xl font-thin">+</p>
            <p>Không có hình ảnh</p>
          </div>
        }
        className="!h-[20rem]"
      />

      <RichTextEditor
        editor={editor}
        className="mt-5"
        {...getInputProps("content")}
      >
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
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </form>
  );
}

export default CustomWebTab;
