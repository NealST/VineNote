"use client";

import i18n from "@/i18n";
import { Notebook, Rss, Tag, Settings, CircleHelp } from "lucide-react";
import { Button } from "../ui/button";
import styles from "./index.module.css";

const dataSource = [
  {
    id: "notes",
    name: i18n.t("notes"),
    Icon: Notebook,
  },
  {
    id: "read",
    name: i18n.t("rss"),
    Icon: Rss,
  },
  {
    id: "tags",
    name: i18n.t("tags"),
    Icon: Tag,
  },
  {
    id: "settings",
    name: i18n.t("settings"),
    Icon: Settings,
  },
  {
    id: "help",
    name: i18n.t("help"),
    Icon: CircleHelp,
  },
];

interface IProps {
  onSelect: (navId: string) => void;
}

const Navigation = function ({ onSelect }: IProps) {
  return (
    <div className={styles.navigation}>
      {dataSource.map((item) => {
        const { id, name, Icon } = item;
        return (
          <Button
            key={id}
            variant="ghost"
            className="w-full justify-start cursor-pointer"
            style={{ color: "var(--sidebar-foreground)", fontSize: "12px" }}
            onClick={() => onSelect(id)}
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
