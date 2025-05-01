import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const Empty = function() {
  
  const { t } = useTranslation();

  return (
    <div className={styles.empty}>
      <div className={styles.empty_content}>
        <p className={styles.empty_content_title}>
          {t('emptyFileTitle')}
        </p>
        <p className={styles.empty_content_subtitle}>
          {t('emptyFileSubTitle')}
        </p>
      </div>
    </div>
  )

};

export default Empty;
