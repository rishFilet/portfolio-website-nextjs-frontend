import clsx from 'clsx';

import { API_IDS } from '@/lib/api/api.constants';
import { getStrapiData } from '@/lib/api/api.helpers';
import type { SocialLinkDataType } from '@/lib/api/api.types';

import styles from './SocialLinks.module.css';

export type SocialLinksProps = {
  className?: string,
};

const SocialLinks = async (props: SocialLinksProps) => {
  const { className } = props;

  const socialLinks = await getStrapiData<SocialLinkDataType[]>({
    endpoint: API_IDS.socialLinks,
  });

  return (
    <div className={clsx(styles.socialLinksContainer, className)}>
      {socialLinks.map((link: SocialLinkDataType) => {
        return (
          <a
            key={link.displayName}
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <i className={link.iconShortcode} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;