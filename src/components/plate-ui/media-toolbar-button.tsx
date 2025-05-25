"use client";

import React, { useCallback, useState } from "react";

import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

import { isUrl } from "@udecode/plate";
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  VideoPlugin,
} from "@udecode/plate-media/react";
import { useEditorRef } from "@udecode/plate/react";
import { useTranslation } from "react-i18next";
import {
  AudioLinesIcon,
  FileUpIcon,
  FilmIcon,
  ImageIcon,
  LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useFilePicker } from "use-file-picker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from "./dropdown-menu";
import { FloatingInput } from "./input";
import {
  ToolbarSplitButton,
  ToolbarSplitButtonPrimary,
  ToolbarSplitButtonSecondary,
} from "./toolbar";

export function MediaToolbarButton({
  children,
  nodeType,
  ...props
}: DropdownMenuProps & { nodeType: string }) {
  const { t } = useTranslation();
  const MEDIA_CONFIG: Record<
    string,
    {
      accept: string[];
      icon: React.ReactNode;
      title: string;
      tooltip: string;
    }
  > = {
    [AudioPlugin.key]: {
      accept: [
        ".mp3",
        ".flac",
        ".wav",
        ".aac",
        ".ogg",
        ".wma",
        ".aiff",
        ".aif",
        ".alac",
        ".m4a",
        ".mqa",
        ".dsd",
        ".aiff",
      ],
      icon: <AudioLinesIcon className="size-4" />,
      title: t("insertAudio"),
      tooltip: t("audio"),
    },
    [FilePlugin.key]: {
      accept: ["*"],
      icon: <FileUpIcon className="size-4" />,
      title: t("insertFile"),
      tooltip: t("file"),
    },
    [ImagePlugin.key]: {
      accept: [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".tiff",
        ".bmp",
        ".svg",
        ".webp",
        ".psd",
        ".ai",
        ".eps",
        ".ico",
        ".heic",
        ".heif",
        ".tif",
        ".raw",
        ".pdf",
        ".avif",
      ],
      icon: <ImageIcon className="size-4" />,
      title: t("insertImage"),
      tooltip: t("image"),
    },
    [VideoPlugin.key]: {
      accept: [".mp4", ".mov", ".avi", ".flv"],
      icon: <FilmIcon className="size-4" />,
      title: t("insertVideo"),
      tooltip: t("video"),
    },
  };
  const currentConfig = MEDIA_CONFIG[nodeType];

  const editor = useEditorRef();
  const openState = useOpenState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { openFilePicker } = useFilePicker({
    accept: currentConfig.accept,
    multiple: true,
    onFilesSelected: ({ plainFiles: updatedFiles }) => {
      (editor as any).tf.insert.media(updatedFiles);
    },
  });

  return (
    <>
      <ToolbarSplitButton
        onClick={() => {
          openFilePicker();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            openState.onOpenChange(true);
          }
        }}
        pressed={openState.open}
      >
        <ToolbarSplitButtonPrimary tooltip={currentConfig.tooltip}>
          {currentConfig.icon}
        </ToolbarSplitButtonPrimary>

        <DropdownMenu {...openState} modal={false} {...props}>
          <DropdownMenuTrigger asChild>
            <ToolbarSplitButtonSecondary />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            onClick={(e) => e.stopPropagation()}
            align="start"
            alignOffset={-32}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => openFilePicker()}>
                {currentConfig.icon}
                {t("uploadFromComputer")}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
                <LinkIcon />
                {t("insertViaUrl")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ToolbarSplitButton>

      <AlertDialog
        open={dialogOpen}
        onOpenChange={(value) => {
          setDialogOpen(value);
        }}
      >
        <AlertDialogContent className="gap-6">
          <MediaUrlDialogContent
            currentConfig={currentConfig}
            nodeType={nodeType}
            setOpen={setDialogOpen}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function MediaUrlDialogContent({
  currentConfig,
  nodeType,
  setOpen,
}: {
  currentConfig: {
    accept: string[];
    icon: React.ReactNode;
    title: string;
    tooltip: string;
  };
  nodeType: string;
  setOpen: (value: boolean) => void;
}) {
  const editor = useEditorRef();
  const [url, setUrl] = useState("");
  const { t } = useTranslation();
  const embedMedia = useCallback(() => {
    if (!isUrl(url)) return toast.error(t("invalidUrl"));

    setOpen(false);
    editor.tf.insertNodes({
      children: [{ text: "" }],
      name: nodeType === FilePlugin.key ? url.split("/").pop() : undefined,
      type: nodeType,
      url,
    });
  }, [url, editor, nodeType, setOpen]);

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{currentConfig.title}</AlertDialogTitle>
      </AlertDialogHeader>

      <AlertDialogDescription className="group relative w-full">
        <FloatingInput
          id="url"
          className="w-full"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") embedMedia();
          }}
          label="URL"
          placeholder=""
          type="url"
          autoFocus
        />
      </AlertDialogDescription>

      <AlertDialogFooter>
        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
        <AlertDialogAction
          onClick={(e) => {
            e.preventDefault();
            embedMedia();
          }}
        >
          {t("accept")}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
