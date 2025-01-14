import PageContainer from 'frontend/src/components/pageContainer/PageContainer';
import Image from 'next/image';

import styles from './page.module.css';

export default async function Home() {
  return (
    <PageContainer className={styles.homePage}>
      <div className={styles.contentContainer}>
        <div className={styles.heroImage}>
          <Image
            src="/vercel.svg"
            alt="Logo"
            fill
            style={{
              objectFit: 'contain', // cover, contain, none
            }}
          />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.heroText}>
          <h1>Hi My name is Rishi Khan</h1>
          <h2>I am a full stack developer</h2>
          <p>
            I am a full stack developer with a passion for creating beautiful and functional web
            applications. I have experience with a variety of technologies including React, Node.js,
            Express, MongoDB, and more. I am always looking to learn new things and improve my
            skills.
          </p>
          <div className={styles.ctaButton}>
            <button>Check out my latest blog post</button>
            <button>Check out my latest project</button>
          </div>
          <div className={styles.socialLinks}></div>
        </div>
      </div>
    </PageContainer>
  );
}
