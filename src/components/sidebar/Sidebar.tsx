'use client';

import clsx from 'clsx';
import Link from 'next/link';

import Separator from '@/components/separator/Separator';

import { links as allMenuLinks } from '../navbar/Navbar.constants';
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
        {allMenuLinks.map((link: NavbarLink, idx) => (
          <div key={`${idx + link.name}`}>
            <Link
              href={link.path}
              className={clsx(styles.menuItemsContainer)}
              onClick={props.toggleSidebar}
            >
              <div className={styles.innerLinkContainer}>
                {' '}
                <span>{link.icon}</span>
                {link.name}
              </div>
            </Link>
            <Separator orientation="horizontal" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;