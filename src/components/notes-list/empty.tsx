import { useTranslation } from 'react-i18next';

const Empty = function() {
  
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4 mt-16">
      <div>
        <p className="text-sm text-muted-foreground text-center">{t('emptyDocs')}</p>
      </div>
    </div>
  )

};

export default Empty;
