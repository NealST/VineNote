"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import type { TPlaceholderElement } from "@udecode/plate-media";

import { cn } from "@udecode/cn";
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  PlaceholderPlugin,
  PlaceholderProvider,
  updateUploadHistory,
  VideoPlugin,
} from "@udecode/plate-media/react";
import {
  PlateElement,
  useEditorPlugin,
  withHOC,
  withRef,
} from "@udecode/plate/react";
import { AudioLines, FileUp, Film, ImageIcon } from "lucide-react";
import { useFilePicker } from "use-file-picker";
import { useTranslation } from "react-i18next";
import { useUploadFile } from "@/hooks/use-upload-file";
import { Spinner } from "./spinner";

export const MediaPlaceholderElement = withHOC(
  PlaceholderProvider,
  withRef<typeof PlateElement>(
    ({ children, className, nodeProps, ...props }, ref) => {
      const editor = props.editor;
      const element = props.element as TPlaceholderElement;
      const { t } = useTranslation();
      const CONTENT: Record<
        string,
        {
          accept: string[];
          content: ReactNode;
          icon: ReactNode;
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
          content: t("addAudioFile"),
          icon: <AudioLines />,
        },
        [FilePlugin.key]: {
          accept: ["*"],
          content: t("addFile"),
          icon: <FileUp />,
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
          content: t("addImage"),
          icon: <ImageIcon />,
        },
        [VideoPlugin.key]: {
          accept: [".mp4", ".mov", ".avi", ".flv"],
          content: t("addVideo"),
          icon: <Film />,
        },
      };

      const { api } = useEditorPlugin(PlaceholderPlugin);

      const { isUploading, progress, uploadedFile, uploadFile, uploadingFile } =
        useUploadFile();

      const loading = isUploading && uploadingFile;

      const currentContent = CONTENT[element.mediaType];

      const isImage = element.mediaType === ImagePlugin.key;

      const imageRef = useRef<HTMLImageElement>(null);

      const { openFilePicker } = useFilePicker({
        accept: currentContent.accept,
        multiple: true,
        onFilesSelected: ({ plainFiles: updatedFiles }) => {
          const firstFile = updatedFiles[0];
          const restFiles = updatedFiles.slice(1);

          replaceCurrentPlaceholder(firstFile);

          restFiles.length > 0 && (editor as any).tf.insert.media(restFiles);
        },
      });

      const replaceCurrentPlaceholder = useCallback(
        (file: File) => {
          void uploadFile(file);
          api.placeholder.addUploadingFile(element.id as string, file);
        },
        [api.placeholder, element.id, uploadFile]
      );

      useEffect(() => {
        if (!uploadedFile) return;

        const path = editor.api.findPath(element);

        editor.tf.withoutSaving(() => {
          editor.tf.removeNodes({ at: path });

          const node = {
            children: [{ text: "" }],
            initialHeight: imageRef.current?.height,
            initialWidth: imageRef.current?.width,
            isUpload: true,
            name: element.mediaType === FilePlugin.key ? uploadedFile.name : "",
            placeholderId: element.id as string,
            type: element.mediaType!,
            url: uploadedFile.url,
          };

          editor.tf.insertNodes(node, { at: path });

          updateUploadHistory(editor, node);
        });

        api.placeholder.removeUploadingFile(element.id as string);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [uploadedFile, element.id]);

      // React dev mode will call useEffect twice
      const isReplaced = useRef(false);

      /** Paste and drop */
      useEffect(() => {
        if (isReplaced.current) return;

        isReplaced.current = true;
        const currentFiles = api.placeholder.getUploadingFile(
          element.id as string
        );

        if (!currentFiles) return;

        replaceCurrentPlaceholder(currentFiles);

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isReplaced]);

      return (
        <PlateElement ref={ref} className={cn(className, "my-1")} {...props}>
          {(!loading || !isImage) && (
            <div
              className={cn(
                "flex cursor-pointer items-center rounded-sm bg-muted p-3 pr-9 select-none hover:bg-primary/10"
              )}
              onClick={() => !loading && openFilePicker()}
              contentEditable={false}
            >
              <div className="relative mr-3 flex text-muted-foreground/80 [&_svg]:size-6">
                {currentContent.icon}
              </div>
              <div className="text-sm whitespace-nowrap text-muted-foreground">
                <div>
                  {loading ? uploadingFile?.name : currentContent.content}
                </div>

                {loading && !isImage && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <div>{formatBytes(uploadingFile?.size ?? 0)}</div>
                    <div>–</div>
                    <div className="flex items-center">
                      <Spinner className="mr-1 size-3.5" />
                      {progress ?? 0}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {isImage && loading && (
            <ImageProgress
              file={uploadingFile}
              imageRef={imageRef}
              progress={progress}
            />
          )}

          {children}
        </PlateElement>
      );
    }
  )
);

export function ImageProgress({
  className,
  file,
  imageRef,
  progress = 0,
}: {
  file: File;
  className?: string;
  imageRef?: React.LegacyRef<HTMLImageElement> | undefined;
  progress?: number;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!objectUrl) {
    return null;
  }

  return (
    <div className={cn("relative", className)} contentEditable={false}>
      <img
        ref={imageRef}
        className="h-auto w-full rounded-sm object-cover"
        alt={file.name}
        src={objectUrl}
      />
      {progress < 100 && (
        <div className="absolute right-1 bottom-1 flex items-center space-x-2 rounded-full bg-black/50 px-1 py-0.5">
          <Spinner />
          <span className="text-xs font-medium text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];

  if (bytes === 0) return "0 Byte";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}
