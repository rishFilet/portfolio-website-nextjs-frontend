'use client';

import clsx from 'clsx';
import Link from 'next/link';

import { visibleLinks } from '../navbar/Navbar.constants';
import { NavbarLink } from '../navbar/Navbar.types';

import styles from './Sidebar.module.css';

type SidebarProps = {
  isSidebarOpen?: boolean,
  sidebarVisibility: boolean,
  toggleSidebar: () => void,
};

const Sidebar = (props: SidebarProps) => {
  const { sidebarVisibility, isSidebarOpen } = props;

  return (
    <div
      className={clsx(
        styles.sidebarContainer,
        sidebarVisibility ? styles.sidebarVisible : styles.sidebarHidden,
        isSidebarOpen && styles.sidebarOpen,
      )}
    >
      <div className={styles.childSidebarContainer}>
        {visibleLinks.map((link: NavbarLink, idx) => (
          <div key={`${idx + link.name}`}>
            <Link
              href={link.path}
              className={clsx(styles.menuItemsContainer)}
              onClick={props.toggleSidebar}
            >
              <div className={styles.innerLinkContainer}> {link.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;