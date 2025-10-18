import clsx from 'clsx';

import { getSocialLinks } from '@/lib/supabase/queries';

import styles from './SocialLinks.module.css';

export type SocialLinksProps = {
  className?: string,
};

const SocialLinks = async (props: SocialLinksProps) => {
  const { className } = props;

  const socialLinks = await getSocialLinks();

  return (
    <div className={clsx(styles.socialLinksContainer, className)}>
      {socialLinks.map((link) => {
        return (
          <a
            key={link.id}
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            title={link.display_name}
          >
            <i className={`fab fa-${link.icon_shortcode}`} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;