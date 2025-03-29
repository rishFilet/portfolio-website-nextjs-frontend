'use client';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useWindowWidth } from '@/lib/hooks/useWindowWidth';

import ImageComponent from '../image/Image';
import { links as allMenuLinks } from '../navbar/Navbar.constants';
import { useScroll } from '../scrollProvider/ScrollProvider';
import { useTheme } from '../themeProvider/ThemeProvider';
import { ThemeSwitcher } from '../themeSwitcher/ThemeSwitcher';

import styles from './Navbar.module.css';

import type { NavbarLink } from './Navbar.types';

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
  const { isScrolled } = useScroll();

  const { themes, currentTheme, setCurrentTheme } = useTheme();

  const logo = currentTheme.logo;

  // Update state when props change
  useEffect(() => {
    if (props && Object.entries(props).length > 0) {
      setPropsData(props);
      props.setSideBarVisibility && props.setSideBarVisibility(isMobile);
    }
  }, [props, isMobile]);

  return (
    <nav>
      {!isMobile && (
        <div
          className={clsx(
            styles.navbar,
            styles.desktopNavbar,
            isScrolled && styles.navbarColorChange,
          )}
        >
          <Link
            className={clsx(styles.logoContainer, isScrolled && styles.logoContainerChange)}
            href="/"
          >
            <ImageComponent
              alt={logo.name}
              src={logo.formats.small.url}
              height={logo.formats.small.height}
              width={logo.formats.small.width}
            />
          </Link>
          <div className={styles.menuItemsContainer}>
            {allMenuLinks.map((link: NavbarLink, idx) => (
              <div key={`${idx + link.name}`}>
                <Link
                  href={link.path}
                  className={clsx(styles.menuItemsContainer)}
                  onClick={props.toggleSidebar}
                >
                  <div className={styles.innerLinkContainer}>{link.name}</div>
                </Link>
              </div>
            ))}
            <ThemeSwitcher />
          </div>
        </div>
      )}
      {isMobile && (
        <div
          className={clsx(
            styles.navbar,
            styles.mobileNavbar,
            isScrolled && styles.navbarColorChange,
          )}
        >
          <Link className={styles.logoContainer} href="/">
            <ImageComponent
              alt={logo.name}
              src={logo.formats.small.url}
              height={logo.formats.small.height}
              width={logo.formats.small.width}
            />
          </Link>
          <ThemeSwitcher />
          <button onClick={props.toggleSidebar} className={styles.hamburgerMenuButton}>
            <HamburgerMenuIcon className={styles.hamburgerMenuIcon} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;