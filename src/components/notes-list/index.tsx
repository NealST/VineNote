import { useState } from 'react';
import { Plus, Search } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Empty from './empty';
import { useTranslation } from 'react-i18next';
import type { IArticleItem } from './types';
import styles from './index.module.css';

const NotesList = function() {
  
  const [dataSource, setDataSource] = useState<IArticleItem[]>([]);
  const { t } = useTranslation();

  return (
    <div className={styles.notes_list}>
      <div className={styles.list_header}>
        <span className={styles.header_label}>{t('allNotes')}</span>
        <Plus className='cursor-pointer' size={14} />
      </div>
      <Separator />
      <div className={styles.list_search}>
        <Search size={14} style={{marginRight: '4px'}} />
        <Input className='border-0 outline-0 focus-visible:border-0' type="text" placeholder={t('searchNotes')} />
      </div>
      <Separator />
      <div className={styles.list_display}>
        {
          dataSource.length > 0 ? dataSource.map(item => {
            const { id, name, action, metadata } = item;
            return (
              <Button key={id}>
                {
                  action === 'input' ? (
                    <Input defaultValue={name} />
                  ) : (
                    <div className={styles.item_name}>{name}</div>
                  )
                }
                <div className={styles.item_time}>{metadata.modified || metadata.created}</div>
              </Button>
            )
          }) : (
            <Empty />
          )
        }
      </div>
    </div>
  )
};

export default NotesList;
