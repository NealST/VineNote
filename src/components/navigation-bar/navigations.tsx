"use client";

import { useTranslation } from "react-i18next";
import { Notebook, Rss, Tag, Settings, CircleHelp } from "lucide-react";
import { Button } from "../ui/button";
import { useSelectedNav } from './controllers/selected-nav';
import { SettingsDialog } from "../settings";
import styles from "./index.module.css";

const Navigation = function () {
  const { t } = useTranslation();
  const setSelectedNav = useSelectedNav(state => state.setId);
  const dataSource = [
    {
      id: "notes",
      name: t("notes"),
      Icon: Notebook,
    },
    // {
    //   id: "rss",
    //   name: t("rss"),
    //   Icon: Rss,
    // },
    {
      id: "tags",
      name: t("tags"),
      Icon: Tag,
    },
    {
      id: "settings",
      name: t("settings"),
      Icon: Settings,
    },
    {
      id: "help",
      name: t("help"),
      Icon: CircleHelp,
    },
  ];

  const handleSelect = function(id: string) {
    if (['notes', 'rss', 'tags'].includes(id)) {
      setSelectedNav(id);
    }
  }

  return (
    <div className={styles.navigation}>
      {dataSource.map((item) => {
        const { id, name, Icon } = item;
        if (id === "settings") {
          return (
            <SettingsDialog key={id}>
              <Button
                variant="ghost"
                className="w-full justify-start cursor-pointer"
                style={{ fontSize: "12px" }}
              >
                <Icon className="text-muted-foreground" size={14} />
                <span className="text-muted-foreground">{name}</span>
              </Button>
            </SettingsDialog>
          );
        }
        return (
          <Button
            key={id}
            variant="ghost"
            className="w-full justify-start cursor-pointer"
            style={{ fontSize: "12px" }}
            onClick={() => handleSelect(id)}
          >
            <Icon className="text-muted-foreground" size={14} />
            <span className="text-muted-foreground">{name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default Navigation;
