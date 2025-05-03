'use client'

import { useState } from 'react';
import Navigation from './navigations';
import FolderList from './folder-list';
import TagList from './tag-list';
import styles from './index.module.css';

const NavigationBar = function() {
  
  const [activeNav, setActiveNav] = useState('notes');

  const handleNavSelect = function(navId: string) {
    setActiveNav(navId);
  }
  
  return (
    <div className={styles.navigation_bar}>
      <Navigation onSelect={handleNavSelect} />
      
      {
        activeNav === 'notes' && <FolderList />
      }
      {
        activeNav === 'tags' && <TagList />
      }
    </div>
  )
};

export default NavigationBar;
