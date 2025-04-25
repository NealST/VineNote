import { useState } from "react";
import { FilePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Empty from "./empty";
import { useTranslation } from "react-i18next";
import { useSelectedFolder } from "../side-bar/controllers/selected-folder";
import { uid } from "uid";
import { createTimeStamp } from './controllers/create-time-format';
import type { IArticleItem } from "./types";
import styles from "./index.module.css";

const NotesList = function () {
  const [dataSource, setDataSource] = useState<IArticleItem[]>([]);
  const selectedFolder = useSelectedFolder((state) => state.folder);
  const { t } = useTranslation();

  const handleAddFile = function () {
    const newDataSource = [{
      id: uid(),
      name: t('untitled'),
      path: '',
      metadata: {
        is_file: true,
        is_dir: false,
        len: 0,
        created: createTimeStamp()
      },
      action: 'input',
    } as IArticleItem].concat(dataSource);
    setDataSource(newDataSource);
  };

  const handleInputBlur = function(index: number) {

  }

  return (
    <div className={styles.notes_list}>
      <div className={styles.list_header}>
        <span className={styles.header_label}>
          {selectedFolder?.name || t("allNotes")}
        </span>
        <FilePlus
          className="cursor-pointer text-ring"
          size={16}
          onClick={handleAddFile}
        />
      </div>
      <Separator />
      <div className={styles.list_search}>
        <Search size={14} />
        <Input
          className="border-0 outline-0 focus-visible:border-0"
          type="text"
          placeholder={t("searchNotes")}
        />
      </div>
      <Separator />
      <div className={styles.list_display}>
        {dataSource.length > 0 ? (
          dataSource.map((item, index) => {
            const { id, name, action, metadata } = item;
            return (
              <div className={styles.file_item} key={id}>
                {action === "input" ? (
                  <Input defaultValue={name} onBlur={() => handleInputBlur(index)} />
                ) : (
                  <div className={styles.item_name}>{name}</div>
                )}
                <div className={styles.item_time}>
                  {metadata.modified || metadata.created}
                </div>
              </div>
            );
          })
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};

export default NotesList;
