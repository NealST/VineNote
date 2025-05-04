'use client'

import Navigation from './navigations';
import FolderList from './folder-list';
import TagList from './tag-list';
import RssList from './rss-list';
import { useSelectedNav } from './controllers/selected-nav';
import styles from './index.module.css';

const NavigationBar = function() {
  
  const selectedNav = useSelectedNav(state => state.id);
  
  return (
    <div className={styles.navigation_bar}>
      <Navigation />
      
      {
        selectedNav === 'notes' && <FolderList />
      }
      {
        selectedNav === 'tags' && <TagList />
      }
      {
        selectedNav === 'rss' && <RssList />
      }
    </div>
  )
};

export default NavigationBar;
