"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useRef,
  useLayoutEffect
} from "react";

// import { cn } from '@udecode/cn';
//import { CopilotPlugin } from '@udecode/plate-ai/react';
//import { useEditorPlugin } from '@udecode/plate/react';
import {
  // ExternalLinkIcon,
  // Eye,
  // EyeOff,
  // Wand2Icon,
  // Upload,
  SunMoon,
  BookA,
  Type
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/plate-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/plate-ui/dialog";
// import { Input } from "@/components/plate-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setTheme, type Theme } from "@/utils/set-theme";
import { setFont, type Font } from "@/utils/set-font";
import { setConfig, getConfig } from "@/utils/store-config";
import i18n from "@/i18n";

export type Language = "en" | "zh";

interface Model {
  label: string;
  value: string;
}

export interface ISettings {
  theme: Theme;
  language: Language;
  font: Font;
  model: string;
  modelApiKey: string;
  uploadThingApiKey: string;
}

export const models: Model[] = [
  { label: "gpt-4o-mini", value: "gpt-4o-mini" },
  { label: "gpt-4o", value: "gpt-4o" },
  { label: "gpt-4-turbo", value: "gpt-4-turbo" },
  { label: "gpt-4", value: "gpt-4" },
  { label: "gpt-3.5-turbo", value: "gpt-3.5-turbo" },
  { label: "gpt-3.5-turbo-instruct", value: "gpt-3.5-turbo-instruct" },
];

const languages = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "简体中文",
    value: "zh",
  },
];

export const defaultSettings = {
  theme: "system" as Theme,
  language: (window.navigator.language === "zh-CN" ? "zh" : "en") as Language,
  font: "cangerJinkai" as Font,
  model: "",
  modelApiKey: "",
  uploadThingApiKey: "",
};

type SettingsProviderState = {
  settings: ISettings;
  setSettings: (config: ISettings) => void;
};

const initialState: SettingsProviderState = {
  settings: defaultSettings,
  setSettings: () => null,
};

export const SettingsProviderContext =
  createContext<SettingsProviderState>(initialState);

export const useSettings = () => {
  const context = useContext(SettingsProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

type ConfigProviderProps = {
  children: React.ReactNode
}

export function SettingsProvider({
  children
}: ConfigProviderProps) {
  const [settings, setSettings] = useState<ISettings>(defaultSettings);

  useLayoutEffect(() => {
    getConfig().then((config: ISettings) => {
      if (config.theme) {
        console.log("config.language", config.language);
        i18n.changeLanguage(config.language);
        setTheme(config.theme);
        setSettings(config);
      }
    });
  }, []);

  const value = {
    settings,
    setSettings,
  };

  return (
    <SettingsProviderContext.Provider value={value}>
      {children}
    </SettingsProviderContext.Provider>
  )
}

export function SettingsDialog({ children }: { children: ReactNode }) {
  const { settings, setSettings } = useSettings();
  // const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const modelApiKeyRef = useRef("");
  const uploadApiKeyRef = useRef("");
  // const { getOptions, setOption } = useEditorPlugin(CopilotPlugin);

  const handleThemeChange = function (value: Theme) {
    console.log('theme value', value);
    setTheme(value);
    const newSettings = {
      ...settings,
      theme: value,
    };
    setSettings(newSettings);
    setConfig(JSON.stringify(newSettings));
  };

  const handleLanguageChange = function (value: Language) {
    i18n.changeLanguage(value);
    // if set language to en, then set the font to default
    if (value === 'en') {
      setFont('system');
    }
    const newSettings = {
      ...settings,
      language: value,
      font: value === 'en' ? 'system' : settings.font,
    };
    setSettings(newSettings);
    setConfig(JSON.stringify(newSettings));
  };

  const handleFontChange = function (value: Font) {
    setFont(value);
    const newSettings = {
      ...settings,
      font: value,
    };
    setSettings(newSettings);
    setConfig(JSON.stringify(newSettings));
  };

  // const handleModelChange = function (value: string) {
  //   const newSettings = {
  //     ...settings,
  //     model: value,
  //   };
  //   setSettings(newSettings);
  // };

  // const handleModelApiKeyChange = function (value: string) {
  //   modelApiKeyRef.current = value;
  // };

  // const handleUploadApiKeyChange = function (value: string) {
  //   uploadApiKeyRef.current = value;
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(
      JSON.stringify({
        ...settings,
        modelApiKey: modelApiKeyRef.current,
        uploadThingApiKey: uploadApiKeyRef.current,
      })
    );
    setOpen(false);

    // Update AI options if needed
    // const completeOptions = getOptions().completeOptions ?? {};
    // setOption('completeOptions', {
    //   ...completeOptions,
    //   body: {
    //     ...completeOptions.body,
    //     apiKey: tempKeys.openai,
    //     model: model.value,
    //   },
    // });
  };

  // const toggleKeyVisibility = (key: string) => {
  //   setShowKey((prev) => ({ ...prev, [key]: !prev[key] }));
  // };

  const renderThemeMode = () => {
    return (
      <div className="group relative">
        <Select defaultValue={settings.theme} onValueChange={handleThemeChange}>
          <SelectTrigger id="select-theme" className="w-full">
            <SelectValue className="w-full" role="combobox" />
          </SelectTrigger>
          <SelectContent className="w-full p-0">
            <SelectItem value="light">{t("lightTheme")}</SelectItem>
            <SelectItem value="dark">{t("darkTheme")}</SelectItem>
            <SelectItem value="system">{t("systemTheme")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderLanguageMode = () => {
    return (
      <div className="group relative">
        <Select
          defaultValue={settings.language}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger id="select-language" className="w-full">
            <SelectValue className="w-full" role="combobox" />
          </SelectTrigger>
          <SelectContent className="w-full p-0">
            {languages.map((item) => {
              const { label, value } = item;
              return (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderFont = () => {
    return (
      <div className="group relative">
        <Select value={settings.font} onValueChange={handleFontChange}>
          <SelectTrigger id="select-font" className="w-full">
            <SelectValue className="w-full" role="combobox" />
          </SelectTrigger>
          <SelectContent className="w-full p-0">
            <SelectItem value="system">{t("systemFont")}</SelectItem>
            <SelectItem value="cangerJinkai">{t("cangerJinkai")}</SelectItem>
            <SelectItem value="cangerXuansan">{t("cangerXuansan")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  // const renderModel = () => {
  //   return (
  //     <div className="group relative">
  //       <label
  //         className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50"
  //         htmlFor="select-model"
  //       >
  //         {t("model")}
  //       </label>
  //       <Select
  //         defaultValue={settings.language}
  //         onValueChange={handleModelChange}
  //       >
  //         <SelectTrigger id="select-model" className="w-full">
  //           <SelectValue className="w-full" role="combobox" />
  //         </SelectTrigger>
  //         <SelectContent className="w-full p-0">
  //           {models.map((item) => {
  //             const { label, value } = item;
  //             return (
  //               <SelectItem key={value} value={value}>
  //                 {label}
  //               </SelectItem>
  //             );
  //           })}
  //         </SelectContent>
  //       </Select>
  //     </div>
  //   );
  // };

  // const renderApiKeyInput = (service: string, label: string) => {
  //   const defaultValue =
  //     settings[service === "ai" ? "modelApiKey" : "uploadThingApiKey"];
  //   const handleChange =
  //     service === "ai" ? handleModelApiKeyChange : handleUploadApiKeyChange;
  //   return (
  //     <div className="group relative">
  //       <div className="flex items-center justify-between">
  //         <label
  //           className="absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
  //           htmlFor={label}
  //         >
  //           <span className="inline-flex bg-background px-2">{label}</span>
  //         </label>
  //         <Button
  //           asChild
  //           size="icon"
  //           variant="ghost"
  //           className="absolute top-0 right-[28px] h-full"
  //         >
  //           <a
  //             className="flex items-center"
  //             href={
  //               service === "openai"
  //                 ? "https://platform.openai.com/api-keys"
  //                 : "https://uploadthing.com/dashboard"
  //             }
  //             rel="noopener noreferrer"
  //             target="_blank"
  //           >
  //             <ExternalLinkIcon className="size-4" />
  //             <span className="sr-only">{t('get')} {label}</span>
  //           </a>
  //         </Button>
  //       </div>

  //       <Input
  //         id={label}
  //         defaultValue={defaultValue}
  //         onChange={(e) => handleChange(e.target.value)}
  //         placeholder=""
  //         data-1p-ignore
  //         type={showKey[service] ? "text" : "password"}
  //       />
  //       <Button
  //         size="icon"
  //         variant="ghost"
  //         className="absolute top-0 right-0 h-full"
  //         onClick={() => toggleKeyVisibility(service)}
  //         type="button"
  //       >
  //         {showKey[service] ? (
  //           <EyeOff className="size-4" />
  //         ) : (
  //           <Eye className="size-4" />
  //         )}
  //         <span className="sr-only">
  //           {showKey[service] ? t("hide") : t("show")} {label}
  //         </span>
  //       </Button>
  //     </div>
  //   );
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">{t("settings")}</DialogTitle>
          <DialogDescription>{t("configurationTip")}</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* theme Settings Group */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <SunMoon className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold">{t("theme")}</h4>
            </div>

            <div className="space-y-2">{renderThemeMode()}</div>
          </div>

          {/* language Settings Group */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-orange-100 p-2 dark:bg-orange-900">
                <BookA className="size-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold">{t("language")}</h4>
            </div>

            <div className="space-y-2">{renderLanguageMode()}</div>
          </div>

          {/* theme Settings Group */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <Type className="size-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold">{t("font")}</h4>
            </div>

            <div className="space-y-2">{renderFont()}</div>
          </div>

          {/* AI Settings Group */}
          {/* <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <Wand2Icon className="size-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold">{t('ai')}</h4>
            </div>

            <div className="space-y-2">
              {renderModel()}
              {renderApiKeyInput("openai", "OpenAI API key")}
            </div>
          </div> */}

          {/* Upload Settings Group */}
          {/* <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-red-100 p-2 dark:bg-red-900">
                <Upload className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <h4 className="font-semibold">{t('upload')}</h4>
            </div>

            <div className="space-y-2">
              {renderApiKeyInput("uploadthing", "Uploadthing API key")}
            </div>
          </div> */}

          <Button size="lg" className="w-full" type="submit">
            {t('saveChanges')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
