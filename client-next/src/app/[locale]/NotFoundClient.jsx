'use client';
import { useTranslations } from 'next-intl';

export default function NotFound() {
    const t = useTranslations('error404');  // Namespace específico

    const imageUrl = '/error_page.png';

    return (
        <>
            <style>{`
                .not-found-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    text-align: center;
                    background-color: #f8f8f8;
                    padding: 20px;
                    color: #333;
                    font-family: 'Inter', sans-serif;
                }

                .error-code {
                    font-size: 8rem;
                    font-weight: 900;
                    color: #34495e;
                    line-height: 1;
                    margin-bottom: 10px;
                    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
                }

                .error-title {
                    font-size: 2rem;
                    color: #c0392b;
                    margin-bottom: 25px;
                }

                .error-image-wrapper {
                    width: 100%;
                    max-width: 600px;
                    margin: 30px 0;
                    overflow: hidden;
                    border-radius: 12px;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
                }

                .error-image {
                    width: 100%;
                    height: auto;
                    display: block;
                    object-fit: cover;
                }

                .error-message {
                    font-size: 1.1rem;
                    margin-bottom: 30px;
                    max-width: 700px;
                }

                .home-button {
                    padding: 12px 30px;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #fff;
                    background-color: #e67e22;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    text-decoration: none;
                    transition: background-color 0.3s ease, transform 0.1s ease;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .home-button:hover {
                    background-color: #d35400;
                    transform: translateY(-2px);
                }

                @media (max-width: 640px) {
                    .error-code {
                        font-size: 6rem;
                    }
                    .error-title {
                        font-size: 1.5rem;
                    }
                    .error-message {
                        font-size: 1rem;
                        padding: 0 10px;
                    }
                    .home-button {
                        padding: 10px 20px;
                        font-size: 0.9rem;
                    }
                }
            `}</style>

            <div className="not-found-container">
                <h1 className="error-code">404</h1>
                <h2 className="error-title">{t('title')}</h2>

                <div className="error-image-wrapper">
                    <img
                        src={imageUrl}
                        alt={t('imageAlt')}
                        className="error-image"
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = "https://placehold.co/600x400/34495e/ffffff?text=Imagen+No+Cargada" 
                        }}
                    />
                </div>

                <p className="error-message">
                    {t('message')}
                </p>

                <a href="/" className="home-button">
                    {t('homeButton')}
                </a>
            </div>
        </>
    );
}
