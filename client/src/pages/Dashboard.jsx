import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';
import ArtworkManager from '../components/ArtworkManager';

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
            <section className="dashboard-section">
                <ArtworkManager />
            </section>
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

// Formulario de Gestión de Obras
const ArtworkForm = ({ t }) => {
    const initialFormState = {
        title: '',
        description: '',
        category: '',
        price: '',
        dimensions: '',
        status: 'available',
        stock: 1,
        isAvailable: true,
        imageFile: null,
        imageUrlPreview: null,
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                imageFile: file,
                imageUrlPreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Artwork data to save/update:', formData);
        console.log(isEditing ? 'Artwork updated successfully (simulation).' : 'New artwork saved successfully (simulation).');
    };

    const handleDelete = () => {
        console.log('Simulating artwork deletion. A real confirmation modal would be required.');
        setFormData(initialFormState);
        setIsEditing(false);
        console.log('Artwork deleted successfully (simulation).');
    };

    const handleNewArtwork = () => {
        setFormData(initialFormState);
        setIsEditing(false);
    };

    const statusClasses = isEditing ? 'status-tag editing' : 'status-tag new';

    return (
        <div className="artwork-form">
            <h3 className="form-main-title">
                {t('admin.formTitle')}
            </h3>

            <div className="form-header-actions">
                <p className={statusClasses}>
                    {isEditing ? t('form.modeEditing') : t('form.modeNew')}
                </p>
                <button
                    type="button"
                    onClick={handleNewArtwork}
                    className="btn-new-artwork"
                >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    {t('form.newButton')}
                </button>
            </div>

            <form onSubmit={handleSubmit}>

                {/* Título y Categoría */}
                <div className="form-grid-2">
                    <InputField
                        label={t('form.titleLabel')}
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder={t('form.titlePlaceholder')}
                        required
                    />
                    <div>
                        <label htmlFor="category" className="form-label">{t('form.categoryLabel')}</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">{t('form.categoryPlaceholder')}</option>
                            <option value="landscape">{t('form.categoryLandscape')}</option>
                            <option value="abstract">{t('form.categoryAbstract')}</option>
                            <option value="portrait">{t('form.categoryPortrait')}</option>
                            <option value="nature">{t('form.categoryNature')}</option>
                        </select>
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="form-label">{t('form.descriptionLabel')}</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder={t('form.descriptionPlaceholder')}
                        className="form-textarea"
                    ></textarea>
                </div>

                {/* Precio, Dimensiones y Stock */}
                <div className="form-grid-3">
                    <InputField
                        label={t('form.priceLabel')}
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        step="0.01"
                        icon="€"
                    />
                    <InputField
                        label={t('form.dimensionsLabel')}
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleChange}
                        placeholder={t('form.dimensionsPlaceholder')}
                    />
                    <InputField
                        label={t('form.stockLabel')}
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        min="1"
                    />
                </div>

                {/* Estado y Checkbox */}
                <div className="form-status-bar">
                    <div className="checkbox-wrapper">
                        <input
                            id="isAvailable"
                            name="isAvailable"
                            type="checkbox"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                        />
                        <label htmlFor="isAvailable">
                            {t('form.availableLabel')}
                        </label>
                    </div>

                    <div>
                        <label htmlFor="status" className="sr-only">{t('form.statusLabel')}</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="available">{t('form.statusAvailable')}</option>
                            <option value="sold">{t('form.statusSold')}</option>
                            <option value="transit">{t('form.statusTransit')}</option>
                            <option value="pending_ship">{t('form.statusPending')}</option>
                        </select>
                    </div>
                </div>

                {/* Subida de Imagen */}
                <ImageUploadField
                    label={t('form.imageLabel')}
                    imageUrlPreview={formData.imageUrlPreview}
                    handleFileChange={handleFileChange}
                />

                {/* Botones de Acción */}
                <div className="form-action-buttons">
                    <button type="submit" className="btn-save btn-base">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                        </svg>
                        {t('form.saveButton')}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="btn-delete btn-base"
                        >
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            {t('form.deleteButton')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

const Dashboard = () => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Obtener usuario actual de sessionStorage
    const userStr = sessionStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        console.log('Logging out...');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        window.location.href = '/';
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

                    <section id="artworks">
                        <ArtworkForm t={t} />
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;