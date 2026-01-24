'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import '@/styles/Dashboard.css';
import ArtworkManager from '@/components/ArtworkManager';
import { useParams } from 'next/navigation';

// --- MOCK DATA ---
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

// --- AUXILIARY COMPONENTS ---
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

const ChartPlaceholder = ({ title, data }) => {
  const t = useTranslations();
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

// --- MAIN COMPONENT ---
export default function DashboardPage() {
  const t = useTranslations();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShow404, setShouldShow404] = useState(false);
  const { locale } = useParams();

  useEffect(() => {
    const userStr = sessionStorage.getItem('user');

    if (!userStr) {
      setShouldShow404(true);
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(userStr);

    if (user.role !== 'admin' && user.role !== 'editor') {
      setShouldShow404(true);
      setIsLoading(false);
      return;
    }

    setCurrentUser(user);
    setIsLoading(false);
  }, []);


  // Show nothing while loading to prevent flash
  if (isLoading) {
    return null;
  }

  // Show 404 if not authorized
  if (shouldShow404) {
    notFound();
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">{t('admin.dashboardTitle')}</h1>
        </header>

        <section className="dashboard-section">
          <h2 className="section-title">{t('admin.sectionVisits')}</h2>
          <div className="stats-grid-3">
            <StatCard title={t('admin.statsVisitors')} value={mockStats.totalVisitors} color="blue" />
            <StatCard title={t('admin.statsVisitorsMonth')} value={mockStats.visitorsLastMonth} color="green" />
            <StatCard title={t('admin.statsVisitorsDay')} value={mockStats.visitorsToday} color="purple" />
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">{t('admin.sectionArtworks')}</h2>
          <div className="stats-grid-4">
            <StatCard title={t('admin.statsPaintingsAvailable')} value={mockStats.paintingsAvailable} color="amber" />
            <StatCard title={t('admin.statsPaintingsSoldMonth')} value={mockStats.paintingsSoldMonth} color="pink" />
            <StatCard title={t('admin.statsPaintingsTransit')} value={mockStats.paintingsTransit} color="indigo" />
            <StatCard title={t('admin.statsPaintingsPendingShip')} value={mockStats.paintingsPendingShip} color="teal" />
          </div>
        </section>

        <div className="chart-section">
          <ChartPlaceholder title={t('admin.chartTitle')} data={mockChartData} />
        </div>

        <section className="dashboard-section">
          <ArtworkManager />
        </section>

        {currentUser?.role === 'admin' && (
          <section className="dashboard-section admin-actions">
            <a href={`/${locale}/user-register`} className="btn-secondary">
              {t('admin.registerUser')}
            </a>
          </section>
        )}
      </div>
    </div>
  );
}