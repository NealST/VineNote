"use client";

import { useTranslation } from "react-i18next";
import { Notebook, Tag, Settings, CircleHelp } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from '@/lib/utils';
import { useSelectedNav } from './controllers/selected-nav';
import { SettingsDialog } from "../settings";
import openIssue from "./controllers/open-issue";
import styles from "./index.module.css";

const Navigation = function () {
  const { t } = useTranslation();
  const { selectedNav, setSelectedNav } = useSelectedNav();
  const dataSource = [
    {
      id: "notes",
      name: t("notes"),
      Icon: Notebook,
    },
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
    setSelectedNav(id);
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
        if (id === 'help') {
          return (
            <Button
              key={id}
              variant="ghost"
              className="w-full justify-start cursor-pointer"
              style={{ fontSize: "12px" }}
              onClick={() => openIssue()}
            >
              <Icon className="text-muted-foreground" size={14} />
              <span className="text-muted-foreground">{name}</span>
            </Button>
          )
        }
        return (
          <Button
            key={id}
            variant="ghost"
            className={cn("w-full justify-start cursor-pointer", selectedNav === id ? 'bg-accent' : '')}
            style={{ fontSize: "12px" }}
            onClick={() => setSelectedNav(id)}
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
