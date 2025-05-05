import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { BellPlus, Sparkles, Newspaper, FolderPen, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Empty from "./empty";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  createRss,
  renameRss,
  getRssInfo,
  deleteRss,
  getRssList,
  useListen
} from "./controllers/rss-action";
import { produce } from "immer";
import { useSelectedRss } from "./controllers/selected-rss";
import type { IRssItem } from "./types";
import styles from "./index.module.css";

const RssList = function () {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState<IRssItem[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const { rss: selectedRss, setRss: setSelectedRss } = useSelectedRss();
  const rssUrlRef = useRef("");
  const rssFilePathRef = useRef("");
  const isSubmittingRef = useRef(false);
  const renameRssIndexRef = useRef<number>();

  const handleChange = (value: string) => {
    rssUrlRef.current = value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // verify the url first;
    const rssUrl = rssUrlRef.current;
    if (!rssUrl) {
      setErrMsg(t("submitEmptyRss"));
      return;
    }
    if (dataSource.some((item) => item.link === rssUrl)) {
      setErrMsg(t("submitExistRss"));
      return;
    }
    if (isSubmittingRef.current) {
      return
    }
    isSubmittingRef.current = true;
    console.log('exec submit');
    const rssFilePath = rssFilePathRef.current;
    const renameRssIndex = renameRssIndexRef.current;
    if (renameRssIndex !== undefined) {
      try {
        const rssChannel = await getRssInfo(rssUrl);
        // await renameRss(
        //   rssFilePathRef.current,
        //   dataSource[renameRssIndex].link,
        //   rssUrl
        // );
        // setDataSource(
        //   produce(dataSource, (draft) => {
        //     draft[renameRssIndex] = rssChannel;
        //   })
        // );
        //setSelectedRss(rssChannel);
      } catch (e) {
        console.error("rename rss error", e);
      }
    } else {
      try {
        const rssChannel = await getRssInfo(rssUrl);
        // await createRss(rssFilePath, rssUrl);
        // setDataSource(
        //   produce(dataSource, (draft) => {
        //     draft.push({
        //       title: rssChannel.title,
        //       link: rssChannel.link,
        //       description: rssChannel.description,
        //       items: rssChannel.items,
        //     });
        //   })
        // );
        // setSelectedRss(rssChannel);
      } catch (e) {
        console.error("create rss error", e);
      }
    }
    // reset
    rssUrlRef.current = "";
    renameRssIndexRef.current = undefined;
    isSubmittingRef.current = false;
  };

  const handleSelect = function (rss: IRssItem) {
    setSelectedRss(rss);
  };

  const handleRename = function (index: number) {
    renameRssIndexRef.current = index;
    rssUrlRef.current = dataSource[index].link;
    setOpen(true);
  };

  const handleDelete = function (index: number) {
    deleteRss(rssFilePathRef.current, dataSource[index].link).then(() => {
      setDataSource(
        produce(dataSource, (draft) => {
          draft.splice(index, 1);
        })
      );
    });
  };

  useListen();

  useEffect(() => {
    getRssList().then((ret) => {
      console.log("tags ret", ret);
      const { filePath, dataSource } = ret;
      rssFilePathRef.current = filePath;
      setDataSource(dataSource);
      if (dataSource.length > 0) {
        setSelectedRss(dataSource[0]);
      }
    });
  }, []);

  return (
    <div className={styles.data_list}>
      <div className={styles.list_header}>
        <span className={cn(styles.header_label, "text-muted-foreground")}>
          {t("folders")}
        </span>
        <BellPlus
          className="cursor-pointer text-foreground"
          size={16}
          onClick={() => setOpen(true)}
        />
      </div>
      <div className={styles.list_display}>
        {dataSource.length > 0 ? (
          dataSource.map((item, index) => {
            const { title, link } = item;
            const isSelected = link === selectedRss.link;
            return (
              <ContextMenu key={index}>
                <ContextMenuTrigger>
                  <div
                    className={cn(
                      styles.display_item,
                      "hover:bg-accent",
                      "text-sidebar-accent-foreground",
                      // 'text-muted-foreground hover:text-accent-foreground',
                      "dark:hover:bg-accent/50",
                      "h-8 rounded-md cursor-pointer",
                      isSelected ? "bg-accent" : ""
                    )}
                    onClick={() => handleSelect(item)}
                  >
                    <div className={styles.item_content}>
                      <Newspaper
                        style={{
                          marginRight: "8px",
                        }}
                        size={14}
                      />
                      <span
                        className={cn(
                          styles.item_name,
                          "text-sidebar-accent-foreground"
                        )}
                      >
                        {title}
                      </span>
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleRename(index)}>
                    <FolderPen size={12} />
                    <span className={styles.menu_item}>{t("rename")}</span>
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDelete(index)}>
                    <Trash2 size={12} />
                    <span className={styles.menu_item}>{t("delete")}</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })
        ) : (
          <Empty tip={t("emptyFolders")} />
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("newRssTitle")}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                  <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold">{t("rssUrl")}</h4>
              </div>

              <div className="space-y-2">
                <Input
                  defaultValue={rssUrlRef.current}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={t("newRssTip")}
                  type="url"
                />
                {errMsg && <p className="text-destructive">{errMsg}</p>}
              </div>
            </div>
            <Button size="lg" className="w-full" type="submit">
              {t("saveChanges")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RssList;
