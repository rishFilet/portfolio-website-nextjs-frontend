import styles from './PageContainer.module.css';

const pageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={className ? className : styles.container}>{children}</div>;
};

export default pageContainer;
