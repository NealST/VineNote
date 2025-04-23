'use client'

import Navigation from './navigations';
import styles from './index.module.css';

const SideBar = function() {

  const handleNavSelect = function() {

  }
  
  return (
    <div className={styles.side_bar}>
      <Navigation onSelect={handleNavSelect} />

    </div>
  )

};

export default SideBar;
