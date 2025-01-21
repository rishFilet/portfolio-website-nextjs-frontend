import styles from './PageContainer.module.css';

async function pageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={className ? className : styles.container}>{children}</section>;
}

export default pageContainer;