import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Home.css';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  const heroImages = [
    '/home_hero_1.jpg',
    '/home_hero_2.jpg',
    '/home_hero_3.jpg',
    '/home_hero_4.jpg',
    '/paint_1.jpg',
    '/paint_2.png',
    'https://images.pexels.com/photos/316018/pexels-photo-316018.jpeg?_gl=1*44bfzp*_ga*MTUxMjg0MzA3OS4xNzYyNjAzNTU0*_ga_8JE65Q40S6*czE3NjI2MDgwMTkkbzIkZzEkdDE3NjI2MDgwMjkkajUwJGwwJGgw',
    'https://images.pexels.com/photos/5563094/pexels-photo-5563094.jpeg?_gl=1*18d66qn*_ga*MTUxMjg0MzA3OS4xNzYyNjAzNTU0*_ga_8JE65Q40S6*czE3NjI2MDgwMTkkbzIkZzEkdDE3NjI2MDgwODMkajU5JGwwJGgw',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const featuredWorks = [
    {
      id: 1,
      title: 'Título de Obra 1',
      medium: 'Acrílico sobre lienzo',
      year: '2024',
      image: '/paint_1.jpg'
    },
    {
      id: 2,
      title: 'Título de Obra 2',
      medium: 'Acrílico sobre lienzo',
      year: '2024',
      image: '/paint_2.png'
    },
    {
      id: 3,
      title: 'Título de Obra 3',
      medium: 'Acrílico sobre lienzo',
      year: '2024',
      image: '/paint_1.jpg'
    }
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % heroImages.length
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [heroImages.length]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <img
            src={heroImages[currentImageIndex]}
            alt="Paisaje finlandés cambiante"
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            {t('home.hero.title')}
          </h1>
          <p className="hero-subtitle">
            {t('home.hero.subtitle')}
          </p>
          <div className="hero-buttons">
            <Link to="/gallery">
              <button className="btn-primary">{t('home.hero.viewGallery')}</button>
            </Link>
            <Link to="/about-me">
              <button className="btn-secondary">{t('home.hero.learnMore')}</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section className="section featured-works">
        <div className="container">
          <h2 className="section-title">{t('home.featured.title')}</h2>
          <p className="section-subtitle">
            {t('home.featured.subtitle')}
          </p>

          <div className="works-grid">
            {featuredWorks.map((work) => (
              <div key={work.id} className="work-card">
                <div className="work-image-container">
                  <img src={work.image} alt={work.title} className="work-image" />
                </div>
                <div className="work-info">
                  <h3 className="work-title">{work.title}</h3>
                  <p className="work-medium">{work.medium}, {work.year}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-container">
            <Link to="/gallery">
              <button className="btn-secondary">{t('home.featured.viewAll')}</button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section about-preview">
        <div className="container about-preview-content">
          <div className="about-preview-image">
            <img
              src="/minna-studio2.jpg"
              alt="Minna en su estudio"
            />
          </div>

          <div className="about-preview-text">
            <h2>{t('home.about.title')}</h2>
            <p>{t('home.about.text1')}</p>
            <p>{t('home.about.text2')}</p>
            <Link to="/about-me">
              <button className="btn-primary">{t('home.about.button')}</button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container cta-content">
          <h2>{t('home.cta.title')}</h2>
          <p>
            {t('home.cta.subtitle')}
          </p>
          <Link to="/shop">
            <button className="btn-primary">{t('home.cta.button')}</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;