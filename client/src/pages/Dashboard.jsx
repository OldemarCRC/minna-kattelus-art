import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';
import ArtworkManager from '../components/ArtworkManager';
import axios from '../utils/axios';

// Datos simulados
const mockStats = {
    totalVisitors: 154820,
    visitorsLastMonth: 12450,
    visitorsToday: 890,
    paintingsAvailable: 45,
    paintingsSoldMonth: 5,
    paintingsTransit: 2,
    paintingsPendingShip: 3,
};

const mockChartData = [
    { name: 'Ene', uv: 4000 }, { name: 'Feb', uv: 3000 }, { name: 'Mar', uv: 2000 },
    { name: 'Abr', uv: 2780 }, { name: 'May', uv: 1890 }, { name: 'Jun', uv: 2390 },
    { name: 'Jul', uv: 3490 }, { name: 'Ago', uv: 3000 }, { name: 'Sep', uv: 4200 },
    { name: 'Oct', uv: 3500 }, { name: 'Nov', uv: 4100 }, { name: 'Dic', uv: 4500 },
];

// Componente de Tarjeta de Estadísticas
const StatCard = ({ title, value, color }) => (
    <div className={`stat-card ${color}`}>
        <div>
            <p className="card-title">{title}</p>
            <p className="card-value">{value.toLocaleString('es-ES')}</p>
        </div>
        <div className="card-icon-wrapper">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        </div>
    </div>
);

// Componente Placeholder de Gráfica
const ChartPlaceholder = ({ title, data }) => {
    const { t } = useTranslation();

    return (
        <div className="chart-wrapper">
            <h3 className="chart-title">{title}</h3>
            <div className="chart-bars-container">
                {data.map((item) => (
                    <div key={item.name} className="chart-bar-item">
                        <div
                            className="chart-bar"
                            style={{ height: `${(item.uv / 5000) * 100}%` }}
                            title={`${item.name}: ${item.uv}`}
                        ></div>
                        <span className="chart-bar-label">{item.name}</span>
                    </div>
                ))}
            </div>
            <p className="chart-info">{t('dashboard.chartSimulated')}</p>
        </div>

    );
};

// Componente auxiliar para campos de entrada estándar
const InputField = ({ label, name, type = 'text', value, onChange, required = false, step, min, placeholder, icon }) => (
    <div>
        <label htmlFor={name} className="form-label">{label}</label>
        <div className={`input-wrapper ${icon ? 'with-icon' : ''}`}>
            {icon && (
                <div className="input-icon">
                    <span>{icon}</span>
                </div>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                step={step}
                min={min}
                placeholder={placeholder}
                className="form-input"
            />
        </div>
    </div>
);

// Componente auxiliar para la subida de imágenes
const ImageUploadField = ({ label, imageUrlPreview, handleFileChange }) => {
    const { t } = useTranslation();

    return (
        <div className="image-upload-field">
            <label className="form-label">{label}</label>
            <div className="dropzone">
                <div className="dropzone-content">
                    {imageUrlPreview ? (
                        <img src={imageUrlPreview} alt="Preview" className="image-preview" />
                    ) : (
                        <>
                            <svg className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 4v2a4 4 0 01-4 4h-4m-4-8l-4 4m4-4l4 4m-4-4v12"></path>
                            </svg>
                            <div className="upload-text-wrapper">
                                <label htmlFor="file-upload" className="upload-label">
                                    <span>{t('dashboard.uploadFile')}</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                </label>
                                <p>{t('dashboard.dragDrop')}</p>
                            </div>
                            <p className="upload-hint">{t('dashboard.fileHint')}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};



const Dashboard = () => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Obtener usuario actual de sessionStorage
    const userStr = sessionStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    const handleLogout = async () => {
        try {
            console.log('Logging out...');
            await axios.post('/api/auth/logout');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            // Logout local aunque falle el servidor
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            window.location.href = '/';
        }
    };

    return (
        <div className="dashboard-container">

            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <div className="sidebar-header">
                    {isSidebarOpen ? 'Admin Minna' : 'A'}
                </div>
                <nav>
                    <a href="#overview" className="sidebar-nav-link">
                        <svg className="sidebar-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"></path>
                        </svg>
                        {isSidebarOpen && <span>{t('dashboard.overview')}</span>}
                    </a>
                    <a href="#artworks" className="sidebar-nav-link">
                        <svg className="sidebar-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                        {isSidebarOpen && <span>{t('admin.formTitle')}</span>}
                    </a>
                    {currentUser?.role === 'admin' && (
                        <a href="/user-register" className="sidebar-nav-link">
                            <svg className="sidebar-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                            {isSidebarOpen && <span>Register User</span>}
                        </a>
                    )}
                </nav>

                {/* Botón de Cerrar Sesión */}
                <div className="logout-wrapper">
                    <button onClick={handleLogout} className="btn-logout">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        {isSidebarOpen && t('dashboard.logout')}
                    </button>
                </div>
            </div>

            {/* Contenido Principal */}
            <main className="main-content">

                {/* Barra Superior */}
                <header className="main-header">
                    <h1 className="main-title">{t('admin.dashboardTitle')}</h1>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="toggle-button"
                    >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </header>

                {/* Estadísticas de Visitas */}
                <section id="overview">
                    <h2 className="section-title">{t('admin.sectionVisits')}</h2>
                    <div className="stats-grid-3">
                        <StatCard
                            title={t('admin.statsVisitors')}
                            value={mockStats.totalVisitors}
                            color="blue"
                        />
                        <StatCard
                            title={t('admin.statsVisitorsMonth')}
                            value={mockStats.visitorsLastMonth}
                            color="green"
                        />
                        <StatCard
                            title={t('admin.statsVisitorsDay')}
                            value={mockStats.visitorsToday}
                            color="purple"
                        />
                    </div>
                </section>

                {/* Estadísticas de Obras */}
                <section>
                    <h2 className="section-title">{t('admin.sectionArtworks')}</h2>
                    <div className="stats-grid-4">
                        <StatCard
                            title={t('admin.statsPaintingsAvailable')}
                            value={mockStats.paintingsAvailable}
                            color="amber"
                        />
                        <StatCard
                            title={t('admin.statsPaintingsSoldMonth')}
                            value={mockStats.paintingsSoldMonth}
                            color="pink"
                        />
                        <StatCard
                            title={t('admin.statsPaintingsTransit')}
                            value={mockStats.paintingsTransit}
                            color="indigo"
                        />
                        <StatCard
                            title={t('admin.statsPaintingsPendingShip')}
                            value={mockStats.paintingsPendingShip}
                            color="teal"
                        />
                    </div>
                </section>

                {/* Gráfica y Gestión */}
                <div className="chart-form-grid">
                    <div>
                        <ChartPlaceholder
                            title={t('admin.chartTitle')}
                            data={mockChartData}
                        />
                    </div>
                </div>

                <section id="artworks" className="dashboard-section">
                    <ArtworkManager />
                </section>
            </main>
        </div>
    );
};

export default Dashboard;