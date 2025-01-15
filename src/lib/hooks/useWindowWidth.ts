import { useState, useEffect } from 'react';

// If this changes, update the media query in Navbar.module.scss and Footer.module.scss
export const DESKTOP_MIN_WIDTH = 1300;

interface UseWindowWidthProps {
  initialWidth?: number;
}

export const useWindowWidth = ({ initialWidth = 0 }: UseWindowWidthProps = {}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isMobile, setIsMobile] = useState(width < DESKTOP_MIN_WIDTH);

  const updateWidth = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
    setIsMobile(newWidth < DESKTOP_MIN_WIDTH);
  };

  useEffect(() => {
    updateWidth(); // Set initial width
    window.addEventListener('resize', updateWidth); // Add event listener for window resize

    return () => {
      window.removeEventListener('resize', updateWidth); // Clean up event listener on unmount
    };
  }, []);

  return { width, isMobile };
};
