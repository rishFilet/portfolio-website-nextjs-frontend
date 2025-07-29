/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';

import HeroImage from '@/components/heroImage/HeroImage';
import ImageComponent from '@/components/image/Image';
import PageContainer from '@/components/pageContainer/PageContainer';
import Separator from '@/components/separator/Separator';
import { convertDateToHumanReadable } from '@/lib/utils/date.helpers';

import styles from './page.module.css';

export type Params = Promise<{
  slug: string,
}>;

// Mock project data - in a real app, this would come from your API
const mockProjects = {
  'climate-data-analytics': {
    title: 'Climate Data Analytics Platform',
    description: 'Real-time climate monitoring system with predictive analytics for renewable energy optimization.',
    content: `
# Climate Data Analytics Platform

A comprehensive climate monitoring and analytics platform designed for renewable energy optimization. This system provides real-time weather data analysis, predictive modeling, and energy forecasting capabilities.

## Features

- **Real-time Weather Monitoring**: Live data collection from multiple weather stations
- **Predictive Analytics**: Machine learning algorithms for weather pattern analysis
- **Energy Forecasting**: Advanced models for renewable energy production prediction
- **Interactive Dashboards**: Beautiful data visualization with charts and maps
- **Data Integration**: Seamless connection with weather APIs and IoT sensors
- **Mobile Responsive**: Optimized for all devices and screen sizes

## Technologies Used

- **Frontend**: React, Chart.js, D3.js for data visualization
- **Backend**: Node.js with Express framework
- **Database**: PostgreSQL with TimescaleDB for time-series data
- **Real-time**: WebSocket connections for live data updates
- **Deployment**: Docker containers on cloud infrastructure

## Architecture Overview

The platform follows a microservices architecture with clear separation of concerns:

\`\`\`
├── frontend/        # React dashboard application
├── api/            # Node.js REST API
├── analytics/      # Python ML models
├── database/       # PostgreSQL with TimescaleDB
└── monitoring/     # Real-time data collection
\`\`\`

## Key Features Implementation

### Real-time Data Processing
\`\`\`javascript
const processWeatherData = async (data) => {
  const processedData = {
    timestamp: new Date(),
    temperature: data.temp,
    humidity: data.humidity,
    windSpeed: data.wind_speed,
    windDirection: data.wind_direction,
    pressure: data.pressure
  };
  
  await db.weather.insert(processedData);
  await updateAnalytics(processedData);
};
\`\`\`

### Predictive Analytics
\`\`\`python
from sklearn.ensemble import RandomForestRegressor
import pandas as pd

def train_energy_model(historical_data):
    model = RandomForestRegressor(n_estimators=100)
    features = ['temperature', 'humidity', 'wind_speed', 'solar_radiation']
    model.fit(historical_data[features], historical_data['energy_output'])
    return model

def predict_energy_production(weather_forecast, model):
    predictions = model.predict(weather_forecast)
    return predictions
\`\`\`

### Interactive Dashboard
\`\`\`javascript
const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Adelaide');
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getWeatherData(selectedLocation);
      setWeatherData(data);
    };
    
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [selectedLocation]);
  
  return (
    <div className="dashboard">
      <LocationSelector value={selectedLocation} onChange={setSelectedLocation} />
      <WeatherCharts data={weatherData} />
      <EnergyForecast location={selectedLocation} />
    </div>
  );
};
\`\`\`

## Data Visualization

The platform includes several types of visualizations:

- **Line Charts**: Historical weather trends and energy production
- **Heat Maps**: Geographic weather patterns across Australia
- **Bar Charts**: Comparative analysis of different locations
- **Real-time Gauges**: Current weather conditions

## Performance Optimizations

- **Database Indexing**: Optimized queries for time-series data
- **Caching**: Redis for frequently accessed weather data
- **CDN**: Global content delivery for static assets
- **Lazy Loading**: Progressive loading of dashboard components

## Security & Reliability

- **Data Encryption**: All sensitive data encrypted in transit and at rest
- **API Rate Limiting**: Protection against abuse and overload
- **Backup Systems**: Automated daily backups with point-in-time recovery
- **Monitoring**: Comprehensive logging and alerting systems

## Results & Impact

- **Accuracy**: 95% accuracy in energy production forecasting
- **Performance**: Sub-1 second dashboard load times
- **Scalability**: Handles 10,000+ concurrent users
- **Reliability**: 99.9% uptime with automated failover

## Future Enhancements

- **AI Integration**: Advanced machine learning for pattern recognition
- **Mobile App**: Native iOS and Android applications
- **API Marketplace**: Public API for third-party integrations
- **Blockchain**: Decentralized data sharing and verification
    `,
    createdAt: '2024-01-15',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    tags: ['Data Analytics', 'Machine Learning', 'Renewable Energy'],
    githubUrl: 'https://github.com/yourusername/climate-data-analytics',
    liveDemoUrl: 'https://climate-analytics-demo.com',
    image: {
      url: 'https://via.placeholder.com/1200x675/2bb1a5/ffffff?text=Climate+Data+Analytics',
      width: 1200,
      height: 675,
    },
  },
  'portfolio-website': {
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website built with Next.js, TypeScript, and Strapi CMS.',
    content: `
# Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Strapi CMS. This project showcases my skills in full-stack development and modern web technologies.

## Features

- **Dynamic Theming**: Custom theme system with multiple color schemes
- **Blog Functionality**: Full-featured blog with markdown support
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Performance Optimized**: Next.js Image optimization and code splitting
- **SEO Friendly**: Meta tags, Open Graph, and structured data
- **CMS Integration**: Strapi headless CMS for content management

## Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: CSS Modules, CSS Custom Properties
- **CMS**: Strapi with REST API
- **Deployment**: Vercel
- **Version Control**: Git with GitHub

## Development Process

The project started with a focus on creating a modern, performant website that could showcase my work effectively. I chose Next.js for its excellent developer experience and built-in optimizations.

### Key Challenges

1. **Dynamic Theming**: Implementing a theme system that could be easily extended
2. **CMS Integration**: Setting up Strapi with proper content types and relationships
3. **Performance**: Ensuring fast loading times with proper image optimization
4. **Responsive Design**: Creating a layout that works well on all devices

### Solutions

- Used CSS Custom Properties for theme management
- Implemented proper TypeScript types for all API responses
- Leveraged Next.js Image component for automatic optimization
- Created a mobile-first responsive design system

## Code Highlights

\`\`\`typescript
// Theme management with CSS Custom Properties
const ThemeProvider = ({ children, theme }: ThemeProviderProps) => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--color-accent',
      theme.accentColorHexCode
    );
  }, [theme]);
  
  return <>{children}</>;
};
\`\`\`

## Results

- **Performance**: 95+ Lighthouse score across all metrics
- **Accessibility**: WCAG 2.1 AA compliant
- **SEO**: Optimized for search engines with proper meta tags
- **User Experience**: Smooth animations and intuitive navigation

## Future Enhancements

- Add dark mode support
- Implement search functionality
- Add project filtering and sorting
- Integrate analytics and performance monitoring
    `,
    createdAt: '2024-01-15',
    technologies: ['React', 'Next.js', 'TypeScript', 'Strapi', 'CSS Modules'],
    tags: ['Web Development', 'Full Stack', 'CMS'],
    githubUrl: 'https://github.com/yourusername/portfolio-website',
    liveDemoUrl: 'https://your-portfolio.com',
    image: {
      url: 'https://via.placeholder.com/1200x675/2bb1a5/ffffff?text=Portfolio+Website',
      width: 1200,
      height: 675,
    },
  },
  'ecommerce-platform': {
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with user authentication, product management, shopping cart, and payment integration.',
    content: `
# E-Commerce Platform

A comprehensive e-commerce solution built with modern web technologies, featuring user authentication, product management, shopping cart functionality, and secure payment processing.

## Features

- **User Authentication**: JWT-based authentication with role-based access
- **Product Management**: Admin panel for managing products, categories, and inventory
- **Shopping Cart**: Persistent cart with real-time updates
- **Payment Integration**: Secure payment processing with Stripe
- **Order Management**: Complete order lifecycle management
- **Responsive Design**: Mobile-optimized shopping experience

## Technologies Used

- **Frontend**: React, Redux Toolkit, Material-UI
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT, bcrypt
- **Payments**: Stripe API
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Docker, AWS

## Architecture

The application follows a microservices architecture pattern with clear separation of concerns:

\`\`\`
├── client/          # React frontend
├── server/          # Node.js backend
├── admin/           # Admin dashboard
└── shared/          # Shared utilities and types
\`\`\`

## Key Features Implementation

### Shopping Cart
\`\`\`javascript
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = calculateTotal(state.items);
    }
  }
});
\`\`\`

### Payment Processing
\`\`\`javascript
const createPaymentIntent = async (amount, currency = 'usd') => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return paymentIntent;
};
\`\`\`

## Security Considerations

- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection with proper content encoding
- CSRF protection for state-changing operations
- Secure payment handling with Stripe

## Performance Optimizations

- Database indexing for faster queries
- Image optimization and lazy loading
- Code splitting and lazy loading
- Redis caching for frequently accessed data
- CDN for static assets

## Results

- **Scalability**: Handles 1000+ concurrent users
- **Security**: Zero security vulnerabilities in production
- **Performance**: Sub-2 second page load times
- **User Experience**: 95% user satisfaction score
    `,
    createdAt: '2023-11-20',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    tags: ['E-Commerce', 'Full Stack', 'Payment Integration'],
    githubUrl: 'https://github.com/yourusername/ecommerce-platform',
    liveDemoUrl: 'https://your-ecommerce-demo.com',
    image: {
      url: 'https://via.placeholder.com/1200x675/2bb1a5/ffffff?text=E-Commerce+Platform',
      width: 1200,
      height: 675,
    },
  },
};

const ProjectDetailPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const project = mockProjects[slug as keyof typeof mockProjects];

  if (!project) {
    return (
      <PageContainer className={styles.projectDetailContainer}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>Project not found</h3>
          <p>The project you&apos;re looking for doesn&apos;t exist or is not available.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className={styles.projectDetailContainer}>
      <h3>{project.title}</h3>
      <div className={styles.projectMetaDataContainer}>
        <HeroImage className={styles.heroImageContainer} />
        <div className={styles.subHeaderInfo}>
          <h5>Rishi Khan</h5>
          <div className={styles.subHeaderInfoDetails}>
            <h6>{convertDateToHumanReadable(project.createdAt)}</h6>
            <p dangerouslySetInnerHTML={{ __html: '&#x00B7;' }} />
            <h6>{project.technologies.length} technologies</h6>
          </div>
        </div>
      </div>
      {project.image && (
        <div className={styles.aspectRatioContainer}>
          <div className={styles.projectImageContainer}>
            <ImageComponent
              src={project.image.url}
              alt={project.title}
              height={project.image.height}
              width={project.image.width}
              style={{ borderRadius: '0.5rem' }}
            />
          </div>
        </div>
      )}
      <Separator
        orientation="horizontal"
        style={{ marginBottom: '1.5rem' }}
      />
      <div className={styles.projectContentContainer}>
        <div className={styles.projectLinks}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              <i className="fab fa-github"></i>
              View on GitHub
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              <i className="fas fa-external-link-alt"></i>
              Live Demo
            </a>
          )}
        </div>
        <div className={styles.technologiesContainer}>
          <h4>Technologies Used</h4>
          <div className={styles.technologyTags}>
            {project.technologies.map((tech) => (
              <span key={tech} className={styles.technologyTag}>
                {tech}
              </span>
            ))}
          </div>
        </div>
        <ReactMarkdown
          disallowedElements={[]}
          unwrapDisallowed
          remarkPlugins={[remarkGfm]}
          components={{
            code({
              node: _node,
              inline,
              className,
              children,
              ...props
            }: any) {
              const match = (className || '').match(/language-(\w+)/);
              return !inline && match ? (
                <SyntaxHighlighter
                  customStyle={{
                    backgroundColor: 'var(--color-codeblock)',
                    borderRadius: '0.5rem',
                  }}
                  language={match[1]}
                  PreTag="div"
                  showLineNumbers
                  codeTagProps={{ className: styles.codeTag }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={styles.inlineCodeTag} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {project.content}
        </ReactMarkdown>
        <Separator
          orientation="horizontal"
          style={{ marginBottom: '1.5rem' }}
        />
      </div>
    </PageContainer>
  );
};

export default ProjectDetailPage;

// Force dynamic rendering to prevent build failures
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return Object.keys(mockProjects).map((slug) => ({
    slug,
  }));
} 