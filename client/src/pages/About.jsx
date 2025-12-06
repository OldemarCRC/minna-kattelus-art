import { useTranslation } from 'react-i18next';
import './About.css';

const About = () => {
  const { t } = useTranslation();

  const education = [
    {
      degree: t('about.education.mfa'),
      institution: t('about.education.mfaInstitution'),
      year: '2017'
    },
    {
      degree: t('about.education.bfa'),
      institution: t('about.education.bfaInstitution'),
      year: '2013'
    }
  ];

  const exhibitions = [
    {
      title: 'Luz del Norte',
      venue: 'Galería Moderna, Helsinki',
      year: '2024',
      type: t('about.exhibitions.solo')
    },
    {
      title: 'Paisajes Interiores',
      venue: 'Finlandia 2019, Tampere',
      year: '2023',
      type: t('about.exhibitions.solo')
    },
    {
      title: 'Colectiva Nórdica',
      venue: 'Museo de Arte Contemporáneo, Estocolmo',
      year: '2023',
      type: t('about.exhibitions.group')
    },
    {
      title: 'Elementos',
      venue: 'Galería Nacional de Finlandia, Helsinki',
      year: '2022',
      type: t('about.exhibitions.group')
    }
  ];

  const techniques = [
    t('about.techniques.acrylic'),
    t('about.techniques.oil'),
    t('about.techniques.layering'),
    t('about.techniques.mixed')
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <div className="about-hero-image">
              <img 
                src="/minna-studio.jpg" 
                alt="Minna Kattelus en su estudio"
              />
            </div>
            
            <div className="about-hero-text">
              <h1>{t('about.title')}</h1>
              <h2 className="about-subtitle">
                {t('about.subtitle')}
              </h2>
              <p className="about-intro">
                {t('about.intro')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="section about-biography">
        <div className="container">
          <div className="biography-content">
            <h2>{t('about.journey.title')}</h2>
            
            <div className="bio-text">
              <p>{t('about.journey.p1')}</p>
              <p>{t('about.journey.p2')}</p>
              <p>{t('about.journey.p3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Section */}
      <section className="section about-teaching">
        <div className="container">
          <div className="teaching-content">
            <div className="teaching-image">
              <img 
                src="/error_page.png" 
                alt="Minna enseñando arte"
              />
            </div>
            
            <div className="teaching-text">
              <h2>{t('about.teaching.title')}</h2>
              <p>{t('about.teaching.p1')}</p>
              <p>{t('about.teaching.p2')}</p>
              <p>{t('about.teaching.p3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="section about-education">
        <div className="container">
          <h2 className="section-title">{t('about.education.title')}</h2>
          
          <div className="education-grid">
            {education.map((edu, index) => (
              <div key={index} className="education-card">
                <h3>{edu.degree}</h3>
                <p className="institution">{edu.institution}</p>
                <p className="year">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions Section */}
      <section className="section about-exhibitions">
        <div className="container">
          <h2 className="section-title">{t('about.exhibitions.title')}</h2>
          
          <div className="exhibitions-list">
            {exhibitions.map((exhibition, index) => (
              <div key={index} className="exhibition-item">
                <div className="exhibition-year">{exhibition.year}</div>
                <div className="exhibition-details">
                  <h3>{exhibition.title}</h3>
                  <p className="exhibition-venue">{exhibition.venue}</p>
                  <span className="exhibition-type">{exhibition.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Techniques Section */}
      <section className="section about-techniques">
        <div className="container">
          <h2 className="section-title">{t('about.techniques.title')}</h2>
          
          <div className="techniques-grid">
            {techniques.map((technique, index) => (
              <div key={index} className="technique-card">
                <div className="technique-icon">🎨</div>
                <p>{technique}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section about-philosophy">
        <div className="container">
          <div className="philosophy-content">
            <h2>{t('about.philosophy.title')}</h2>
            <blockquote className="philosophy-quote">
              {t('about.philosophy.quote')}
            </blockquote>
            <p className="philosophy-text">
              {t('about.philosophy.text')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section about-cta">
        <div className="container cta-content">
          <h2>{t('about.cta.title')}</h2>
          <p>{t('about.cta.text')}</p>
          <div className="cta-buttons">
            <a href="/shop">
              <button className="btn-primary">{t('about.cta.viewWorks')}</button>
            </a>
            <a href="/contact">
              <button className="btn-secondary">{t('about.cta.contact')}</button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;