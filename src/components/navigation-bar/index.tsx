'use client'

import Navigation from './navigations';
import FolderList from './folder-list';
import styles from './index.module.css';

const NavigationBar = function() {

  const handleNavSelect = function() {

  }
  
  return (
    <div className={styles.navigation_bar}>
      <Navigation onSelect={handleNavSelect} />
      
      <FolderList />
    </div>
  )
};

export default NavigationBar;
