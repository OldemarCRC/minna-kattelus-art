'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import axios from '@/lib/axios';
import ArtworkModal from '@/components/ArtworkModal';
import '../../styles/Home.css';

export default function Home() {
  const t = useTranslations();
  const currentLang = useLocale();

  const heroImages = [
    '/hero/home_hero_1.jpg',
    '/hero/home_hero_2.jpg',
    '/hero/home_hero_3.jpg',
    '/hero/home_hero_4.jpg',
    '/hero/home_hero_5.jpg',
    '/hero/home_hero_6.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredWorks, setFeaturedWorks] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchFeaturedWorks = async () => {
      try {
        const response = await axios.get('/api/artworks/featured');
        setFeaturedWorks(response.data.data);
      } catch (error) {
        console.error('Error fetching featured works:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedWorks();
  }, []);

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
            <Link href={`/${currentLang}/gallery`}>
              <button className="btn-primary">{t('home.hero.viewGallery')}</button>
            </Link>
            <Link href={`/${currentLang}/about-me`}>
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
            {loadingFeatured ? (
              <p>{t('gallery.loading')}</p>
            ) : featuredWorks.length > 0 ? (
              featuredWorks.map((work) => (
                <div
                  key={work._id}
                  className="work-card"
                  onClick={() => setSelectedArtwork(work)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="work-image-container">
                    <img
                      src={`${API_URL}/uploads/artworks/${work.image}`}
                      alt={work.title[currentLang] || work.title.en}
                      className="work-image"
                    />
                  </div>
                  <div className="work-info">
                    <h3 className="work-title">{work.title[currentLang] || work.title.en}</h3>
                    <p className="work-medium">
                      {work.technique[currentLang] || work.technique.en}, {work.year}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>{t('home.featured.noWorks')}</p>
            )}
          </div>

          <div className="view-all-container">
            <Link href={`/${currentLang}/gallery`}>
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
            <Link href={`/${currentLang}/about-me`}>
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
          <Link href={`/${currentLang}/shop`}>
            <button className="btn-primary">{t('home.cta.button')}</button>
          </Link>
        </div>
      </section>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
}