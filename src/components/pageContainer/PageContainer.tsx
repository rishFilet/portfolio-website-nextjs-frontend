'use client';

import clsx from 'clsx';

import { useScroll } from '../scrollProvider/ScrollProvider';

import styles from './PageContainer.module.css';

function pageContainer({
  children,
  className,
}: {
  children: React.ReactNode,
  className?: string,
}) {
  const { setIsScrolled } = useScroll();

  interface ScrollEvent extends React.UIEvent<HTMLElement> {
    target: HTMLElement &
      EventTarget & {
        clientHeight: number,
        scrollHeight: number,
        scrollTop: number,
      };
  }

  const handleScroll = (e: ScrollEvent) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const position = Math.ceil(
      (scrollTop / (scrollHeight - clientHeight)) * 100,
    );
    setIsScrolled(position > 0);
  };

  return (
    <section onScroll={handleScroll} className={clsx(styles.container)}>
      <div className={clsx(styles.innerContainer, className)}>{children}</div>
    </section>
  );
}

export default pageContainer;