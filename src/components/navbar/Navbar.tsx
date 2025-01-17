'use client';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useWindowWidth } from '@/lib/hooks/useWindowWidth';

import styles from './Navbar.module.css';

type NavbarProps = {
  setSideBarVisibility: (visibility: boolean) => void;
  toggleSidebar: () => void;
};

const initialData: NavbarProps = {
  toggleSidebar: () => {},
  setSideBarVisibility: () => {},
};

const Navbar = (props: NavbarProps) => {
  const [propsData, setPropsData] = useState<NavbarProps>(initialData);

  const { width, isMobile } = useWindowWidth();
  // Update state when props change
  useEffect(() => {
    if (props && Object.entries(props).length > 0) {
      setPropsData(props);
      props.setSideBarVisibility && props.setSideBarVisibility(isMobile);
    }
  }, [props, isMobile]);

  return (
    <nav className={clsx(styles.navbar)}>
      {!isMobile && (
        <>
          <div className={styles.logo}>LOGO</div>
          <div className={styles.menuItemsContainer}>
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
          </div>
        </>
      )}
      {isMobile && (
        <div className={styles.hamburgerMenu}>
          <button onClick={props.toggleSidebar}>
            <HamburgerMenuIcon className={styles.hamburgerMenuIcon} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
