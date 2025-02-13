import * as RadixSeparator from '@radix-ui/react-separator';
import clsx from 'clsx';

import styles from './Separator.module.css';

export type SeparatorProps = {
  className?: string;
  decorative?: boolean;
  orientation?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
};

const Separator = (props: SeparatorProps) => {
  const { className, decorative, orientation, style } = props;
  return (
    <RadixSeparator.Root
      className={clsx(styles.SeparatorRoot, className)}
      decorative={decorative}
      orientation={orientation}
      style={style}
    />
  );
};

export default Separator;