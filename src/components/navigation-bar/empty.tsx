import { useTranslation } from 'react-i18next';

interface IProps {
  tipKey: string;
}

const Empty = function ({ tipKey }: IProps) {

  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4 mt-16">
      <div>
        <p className="text-sm text-muted-foreground text-center">{t(tipKey)}</p>
      </div>
    </div>
  );
};

export default Empty;
