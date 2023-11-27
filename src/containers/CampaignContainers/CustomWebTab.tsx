"use client";

import Thumbnail from "@/components/CreateProduct/Thumbnail";
import { Button, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { CampaignDetail } from "@/types/Campaign";
import { publicUploadFile } from "@/services/backend/services/media";
import {
  ARTIST_CAMPAIGN_ENDPOINT,
  updateCampaignWebInfoApi,
} from "@/services/backend/services/campaign";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { isDisabled } from "@/utils/campaign.utils";
import { notifications } from "@mantine/notifications";
import { getNotificationIcon } from "@/utils/mapper";
import { NOTIFICATION_TYPE } from "@/constants/common";

function CustomWebTab({ data: campaignData }: { data: CampaignDetail }) {
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
    editable:
      campaignData.status === "DRAFT" ||
      campaignData.status === "REQUEST_CHANGE",
    onUpdate({ editor }) {
      setFieldValue("content", editor.getHTML());
    },
  });

  useEffect(() => {
    console.log(values);
    // setValues({
    //   content: campaignData.content,
    //   thumbnail: campaignData.thumbnailUrl,
    // });
    editor?.setEditable(
      campaignData.status === "DRAFT" ||
        campaignData.status === "REQUEST_CHANGE"
    );
  }, [campaignData]);

  const updateWebInfoMutation = useMutation({
    mutationFn: async (data: {
      content?: string;
      thumbnail?: string | File;
    }) => {
      let thumbnailUrl: string | undefined = campaignData.thumbnailUrl;
      console.log(data.thumbnail);
      if (data.thumbnail instanceof File) {
        const res = await publicUploadFile([data.thumbnail]);
        thumbnailUrl = res?.data.data.fileResponses[0].presignedUrl;
      } else if (!data.thumbnail) {
        thumbnailUrl = undefined;
      }

      const res = await updateCampaignWebInfoApi(campaignData, {
        content: data.content,
        thumbnailUrl: thumbnailUrl,
      });

      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [ARTIST_CAMPAIGN_ENDPOINT, { id: campaignData.id }],
        data
      );
      notifications.show({
        message: "Chỉnh sửa thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    },
    onError: () => {
      notifications.show({
        message: "Chỉnh sửa thất bại! Vui lòng thử lại!",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    },
  });

  return (
    <form
      onSubmit={onSubmit((values) => updateWebInfoMutation.mutate(values))}
      className="mt-5"
    >
      <Thumbnail
        disabled={isDisabled(campaignData.status)}
        url={
          values.thumbnail instanceof File
            ? URL.createObjectURL(values.thumbnail)
            : values.thumbnail
        }
        setFile={(file) => {
          console.log(file);
          setFieldValue("thumbnail", file);
        }}
        error={errors.thumbnail as string}
        defaultPlaceholder={
          !isDisabled(campaignData.status) ? (
            <div className="flex flex-col items-center">
              <p className="text-4xl font-thin">+</p>
              <p>Add thumbnail</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p>No image</p>
            </div>
          )
        }
        className="!h-[20rem]"
        clearable={!isDisabled(campaignData.status)}
        onClear={() => {
          setFieldValue("thumbnail", undefined);
        }}
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
      <div className="flex-1 flex justify-end mt-4 pr-2">
        <Button
          type="submit"
          loading={updateWebInfoMutation.isLoading}
          disabled={
            (campaignData.status !== "DRAFT" &&
              campaignData.status !== "REQUEST_CHANGE") ||
            !isDirty()
          }
        >
          Update
        </Button>
      </div>
    </form>
  );
}

export default CustomWebTab;
