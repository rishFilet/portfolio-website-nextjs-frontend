import {
  faBook,
  faHiking,
  faMusic,
  faCamera,
  faGamepad,
  faPalette,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PageContainer from '@/components/pageContainer/PageContainer';
import { PageVisibilityGuard } from '@/components/pageVisibility/PageVisibilityGuard';

import styles from './page.module.css';

export default function AboutPage() {
  return (
    <PageVisibilityGuard pageKey="about">
      <PageContainer>
        <div className={styles.aboutPage}>
          {/* Header Section */}
          <section className={styles.headerSection}>
            <div className={styles.headerContainer}>
              <div className={styles.aboutHeader}>
                <h1>About Me</h1>
                <p>
                  A passionate software engineer and IT consultant with over 6
                  years of experience building innovative solutions for climate
                  technology, space exploration, and renewable energy sectors.
                </p>
                <div className={styles.actionButtons}>
                  <a href="/resume.pdf" className={styles.downloadButton}>
                    Download Resume
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Entrepreneurial Ventures Section */}
          <section className={styles.venturesSection}>
            <div className={styles.sectionContainer}>
              <h2>Entrepreneurial Ventures</h2>
              <p className={styles.sectionDescription}>
                A track record of building and scaling innovative businesses
                across diverse technology sectors.
              </p>

              <div className={styles.venturesGrid}>
                <div className={styles.ventureCard}>
                  <div className={styles.ventureHeader}>
                    <div className={styles.ventureTitleSection}>
                      <h3>TechStart Solutions</h3>
                    </div>
                    <p className={styles.venturePeriod}>2023 - Present</p>
                  </div>
                  <div className={styles.ventureContent}>
                    <p>
                      Founded and led a technology consulting firm specializing in
                      sustainable software solutions for climate tech companies.
                    </p>
                    <h4 className={styles.achievementsHeader}>
                      Key Achievements:
                    </h4>
                    <ul className={styles.achievementsList}>
                      <li>
                        Secured $500K in seed funding for climate monitoring
                        platform
                      </li>
                      <li>Built team of 12 engineers and designers</li>
                      <li>Developed 3 proprietary software solutions</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.ventureCard}>
                  <div className={styles.ventureHeader}>
                    <div className={styles.ventureTitleSection}>
                      <h3>GreenTech Innovations</h3>
                    </div>
                    <p className={styles.venturePeriod}>2021 - 2023</p>
                  </div>
                  <div className={styles.ventureContent}>
                    <p>
                      Co-founded a startup focused on renewable energy
                      optimization and smart grid management systems.
                    </p>
                    <h4 className={styles.achievementsHeader}>
                      Key Achievements:
                    </h4>
                    <ul className={styles.achievementsList}>
                      <li>
                        Reduced energy consumption by 30% through smart grid
                        implementations
                      </li>
                      <li>Developed AI-driven climate prediction models</li>
                      <li>Partnerships with 5 major utility companies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Freelance and Consulting Section */}
          <section className={styles.consultingSection}>
            <div className={styles.sectionContainer}>
              <h2>Freelance and Consulting Experience</h2>
              <p className={styles.sectionDescription}>
                Providing expert technical guidance and development services to
                organizations worldwide.
              </p>

              <div className={styles.consultingGrid}>
                <div className={styles.consultingCard}>
                  <div className={styles.consultingHeader}>
                    <div className={styles.consultingTitleSection}>
                      <h3>Senior IT Consultant</h3>
                      <p className={styles.companyName}>Climate Solutions Inc.</p>
                    </div>
                    <p className={styles.consultingPeriod}>2022 - Present</p>
                  </div>
                  <div className={styles.consultingContent}>
                    <p>
                      Leading development of climate monitoring and renewable
                      energy optimization platforms for enterprise clients.
                    </p>
                    <h4 className={styles.achievementsHeader}>
                      Key Achievements:
                    </h4>
                    <ul className={styles.achievementsList}>
                      <li>
                        Reduced energy consumption by 30% through smart grid
                        implementations
                      </li>
                      <li>Developed AI-driven climate prediction models</li>
                      <li>
                        Led team of 8 engineers on critical infrastructure
                        projects
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={styles.consultingCard}>
                  <div className={styles.consultingHeader}>
                    <div className={styles.consultingTitleSection}>
                      <h3>Software Architect</h3>
                      <p className={styles.companyName}>Space Technology Corp</p>
                    </div>
                    <p className={styles.consultingPeriod}>2020 - 2022</p>
                  </div>
                  <div className={styles.consultingContent}>
                    <p>
                      Designed and implemented satellite communication systems and
                      ground station software for space missions.
                    </p>
                    <h4 className={styles.achievementsHeader}>
                      Key Achievements:
                    </h4>
                    <ul className={styles.achievementsList}>
                      <li>
                        Built fault-tolerant communication protocols for deep
                        space missions
                      </li>
                      <li>
                        Optimized data processing pipelines for 50% faster
                        satellite imagery analysis
                      </li>
                      <li>
                        Established software engineering best practices across
                        organization
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={styles.consultingCard}>
                  <div className={styles.consultingHeader}>
                    <div className={styles.consultingTitleSection}>
                      <h3>Full Stack Developer</h3>
                      <p className={styles.companyName}>
                        Renewable Energy Systems
                      </p>
                    </div>
                    <p className={styles.consultingPeriod}>2018 - 2020</p>
                  </div>
                  <div className={styles.consultingContent}>
                    <p>
                      Developed smart grid management systems and energy
                      distribution platforms for renewable energy companies.
                    </p>
                    <h4 className={styles.achievementsHeader}>
                      Key Achievements:
                    </h4>
                    <ul className={styles.achievementsList}>
                      <li>
                        Created real-time monitoring dashboards for 100+ wind
                        farms
                      </li>
                      <li>
                        Implemented predictive maintenance algorithms reducing
                        downtime by 25%
                      </li>
                      <li>
                        Integrated IoT sensors for comprehensive energy network
                        visibility
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Experience Section */}
          <section className={styles.experienceSection}>
            <div className={styles.sectionContainer}>
              <h2>Professional Experience</h2>
              <p className={styles.sectionDescription}>
                A track record of delivering impactful solutions across diverse
                technology sectors.
              </p>

              <div className={styles.experienceGrid}>
                <div className={styles.experienceCard}>
                  <div className={styles.experienceHeader}>
                    <div className={styles.experienceTitleSection}>
                      <h3>Senior IT Consultant</h3>
                      <p className={styles.companyName}>Climate Solutions Inc.</p>
                    </div>
                    <p className={styles.experiencePeriod}>2022 - Present</p>
                  </div>
                  <div className={styles.experienceContent}>
                    <p>
                      Leading development of climate monitoring and renewable
                      energy optimization platforms.
                    </p>
                    <h4 className={styles.achievementsHeader}>
                      Key Achievements:
                    </h4>
                    <ul className={styles.achievementsList}>
                      <li>
                        Reduced energy consumption by 30% through smart grid
                        implementations
                      </li>
                      <li>Developed AI-driven climate prediction models</li>
                      <li>
                        Led team of 8 engineers on critical infrastructure
                        projects
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={styles.experienceCard}>
                  <div className={styles.experienceHeader}>
                    <div className={styles.experienceTitleSection}>
                      <h3>Software Architect</h3>
                      <p className={styles.companyName}>Space Technology Corp</p>
                    </div>
                    <p className={styles.experiencePeriod}>2020 - 2022</p>
                  </div>
                  <div className={styles.experienceContent}>
                    <p>
                      Designed and implemented satellite communication systems and
                      ground station software.
                    </p>
                    <h4 className={styles.achievementsHeader}>
                      Key Achievements:
                    </h4>
                    <ul className={styles.achievementsList}>
                      <li>
                        Built fault-tolerant communication protocols for deep
                        space missions
                      </li>
                      <li>
                        Optimized data processing pipelines for 50% faster
                        satellite imagery analysis
                      </li>
                      <li>
                        Established software engineering best practices across
                        organization
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={styles.experienceCard}>
                  <div className={styles.experienceHeader}>
                    <div className={styles.experienceTitleSection}>
                      <h3>Full Stack Developer</h3>
                      <p className={styles.companyName}>
                        Renewable Energy Systems
                      </p>
                    </div>
                    <p className={styles.experiencePeriod}>2018 - 2020</p>
                  </div>
                  <div className={styles.experienceContent}>
                    <p>
                      Developed smart grid management systems and energy
                      distribution platforms.
                    </p>
                    <h4 className={styles.achievementsHeader}>
                      Key Achievements:
                    </h4>
                    <ul className={styles.achievementsList}>
                      <li>
                        Created real-time monitoring dashboards for 100+ wind
                        farms
                      </li>
                      <li>
                        Implemented predictive maintenance algorithms reducing
                        downtime by 25%
                      </li>
                      <li>
                        Integrated IoT sensors for comprehensive energy network
                        visibility
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hobbies and Interests Section */}
          <section className={styles.hobbiesSection}>
            <div className={styles.sectionContainer}>
              <h2>Hobbies and Interests</h2>
              <p className={styles.sectionDescription}>
                Beyond technology, I enjoy exploring various creative and outdoor
                activities.
              </p>

              <div className={styles.hobbiesGrid}>
                <div className={styles.hobbyCard}>
                  <div className={styles.hobbyIcon}>
                    <FontAwesomeIcon icon={faBook} />
                  </div>
                  <div className={styles.hobbyContent}>
                    <h3>Reading</h3>
                    <p>
                      Avid reader of science fiction, technology books, and
                      philosophy. Currently exploring climate science literature
                      and space exploration history.
                    </p>
                  </div>
                </div>

                <div className={styles.hobbyCard}>
                  <div className={styles.hobbyIcon}>
                    <FontAwesomeIcon icon={faHiking} />
                  </div>
                  <div className={styles.hobbyContent}>
                    <h3>Hiking</h3>
                    <p>
                      Love exploring nature trails and mountains. Completed
                      several multi-day treks and always planning the next
                      adventure.
                    </p>
                  </div>
                </div>

                <div className={styles.hobbyCard}>
                  <div className={styles.hobbyIcon}>
                    <FontAwesomeIcon icon={faMusic} />
                  </div>
                  <div className={styles.hobbyContent}>
                    <h3>Music</h3>
                    <p>
                      Playing guitar and piano. Enjoy composing ambient electronic
                      music and exploring different musical genres.
                    </p>
                  </div>
                </div>

                <div className={styles.hobbyCard}>
                  <div className={styles.hobbyIcon}>
                    <FontAwesomeIcon icon={faCamera} />
                  </div>
                  <div className={styles.hobbyContent}>
                    <h3>Photography</h3>
                    <p>
                      Passionate about landscape and astrophotography. Capturing
                      the beauty of nature and the cosmos through the lens.
                    </p>
                  </div>
                </div>

                <div className={styles.hobbyCard}>
                  <div className={styles.hobbyIcon}>
                    <FontAwesomeIcon icon={faGamepad} />
                  </div>
                  <div className={styles.hobbyContent}>
                    <h3>Gaming</h3>
                    <p>
                      Enjoy strategy games and indie titles. Particularly
                      interested in games that explore environmental themes and
                      space exploration.
                    </p>
                  </div>
                </div>

                <div className={styles.hobbyCard}>
                  <div className={styles.hobbyIcon}>
                    <FontAwesomeIcon icon={faPalette} />
                  </div>
                  <div className={styles.hobbyContent}>
                    <h3>Digital Art</h3>
                    <p>
                      Creating digital illustrations and concept art. Focus on
                      sci-fi themes, environmental concepts, and futuristic
                      cityscapes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className={styles.valuesSection}>
            <div className={styles.sectionContainer}>
              <h2>Core Values</h2>
              <p className={styles.sectionDescription}>
                The principles that guide my work and drive meaningful impact.
              </p>

              <div className={styles.valuesGrid}>
                <div className={styles.valueCard}>
                  <h3>Sustainability First</h3>
                  <p>
                    Every solution I build considers environmental impact and
                    long-term sustainability.
                  </p>
                </div>

                <div className={styles.valueCard}>
                  <h3>Innovation Driven</h3>
                  <p>
                    Constantly exploring cutting-edge technologies to solve
                    complex challenges.
                  </p>
                </div>

                <div className={styles.valueCard}>
                  <h3>Collaborative Approach</h3>
                  <p>
                    Building strong partnerships with clients and teams to achieve
                    shared goals.
                  </p>
                </div>

                <div className={styles.valueCard}>
                  <h3>Technical Excellence</h3>
                  <p>
                    Committed to writing clean, efficient, and maintainable code.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </PageContainer>
    </PageVisibilityGuard>
  );
}