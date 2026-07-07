'use client';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import axios from '@/lib/axios';
import ArtworkEditModal from '@/components/ArtworkEditModal';
import { CATEGORIES } from '@/constants/artworkCategories';
import '@/styles/ArtworkManager.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const ARTWORK_FILTER_LABELS = {
  all: 'All Artworks',
  available: 'Available Artworks',
  sold: 'Sold Artworks',
  featured: 'Featured Artworks'
};

const ArtworkManager = () => {
  const locale = useLocale();
  const t = useTranslations();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [artworkFilter, setArtworkFilter] = useState('all');

  const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = currentUser?.role === 'admin';
  
  const [formData, setFormData] = useState({
    title: { en: '', es: '', fi: '', sv: '', so: '' },
    description: { en: '', es: '', fi: '', sv: '', so: '' },
    category: { en: '', es: '', fi: '', sv: '', so: '' },
    technique: { en: '', es: '', fi: '', sv: '', so: '' },
    year: new Date().getFullYear(),
    dimensions: { width: '', height: '', unit: 'cm' },
    price: '',
    currency: 'EUR',
    available: true,
    featured: false,
    displayOrder: 0
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchArtworks();
  }, [artworkFilter]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);

      const params = {};
      if (artworkFilter === 'available') params.available = true;
      if (artworkFilter === 'sold') params.available = false;
      if (artworkFilter === 'featured') params.featured = true;

      const response = await axios.get('/api/artworks', { params });
      setArtworks(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching artworks:', err);
      setError('Error loading artworks');
      toast.error('Error loading artworks', {
        description: 'Please try refreshing the page.',
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseFloat(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedKey = e.target.value;
    const selectedCategory = CATEGORIES[selectedKey];
    
    setFormData(prev => ({
      ...prev,
      category: selectedCategory
    }));
  };

  const getCurrentCategoryKey = () => {
    if (!formData.category.en) return '';
    
    for (const [key, value] of Object.entries(CATEGORIES)) {
      if (value.en === formData.category.en) {
        return key;
      }
    }
    return '';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formDataToSend = new FormData();

      // Add image if exists
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      formDataToSend.append('title', JSON.stringify(formData.title));
      formDataToSend.append('description', JSON.stringify(formData.description));
      formDataToSend.append('category', JSON.stringify(formData.category));
      formDataToSend.append('technique', JSON.stringify(formData.technique));
      formDataToSend.append('dimensions', JSON.stringify(formData.dimensions));
      
      // Simple fields
      formDataToSend.append('year', formData.year);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('currency', formData.currency);
      formDataToSend.append('available', formData.available);
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('displayOrder', formData.displayOrder);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      };

      await axios.post('/api/artworks', formDataToSend, config);
      toast.success('Artwork created', {
        description: 'The new artwork has been added to the gallery.',
      });

      resetForm();
      fetchArtworks();
      setShowForm(false);
    } catch (err) {
      console.error('Error saving artwork:', err);
      const errorMsg = err.response?.data?.message || 'Error saving artwork';
      setError(errorMsg);
      toast.error('Error saving artwork', {
        description: errorMsg,
      });
    }
  };

  const handleEditClick = (artwork) => {
    setEditingArtwork(artwork);
    setEditModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    // Use AlertDialog for confirmation
    const confirmed = await confirm({
      title: 'Delete Artwork',
      description: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      await axios.delete(`/api/artworks/${id}`);
      toast.success('Artwork deleted', {
        description: 'The artwork has been permanently removed.',
      });
      fetchArtworks();
    } catch (err) {
      console.error('Error deleting artwork:', err);
      const errorMsg = err.response?.data?.message || 'Error deleting artwork';
      setError(errorMsg);
      toast.error('Error deleting artwork', {
        description: errorMsg,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: { en: '', es: '', fi: '', sv: '', so: '' },
      description: { en: '', es: '', fi: '', sv: '', so: '' },
      technique: { en: '', es: '', fi: '', sv: '', so: '' },
      category: { en: '', es: '', fi: '', sv: '', so: '' },
      year: new Date().getFullYear(),
      dimensions: { width: '', height: '', unit: 'cm' },
      price: '',
      currency: 'EUR',
      available: true,
      featured: false,
      displayOrder: 0
    });
    setImageFile(null);
    setImagePreview('');
  };

  if (loading) {
    return <div className="loading">Loading artworks...</div>;
  }

  return (
    <div className="artwork-manager">
      <div className="manager-header">
        <h2>Artwork Management</h2>
        <button
          className="btn-primary btn-new-artwork"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : '+ New Artwork'}
        </button>
      </div>

      <div className="artwork-filter-tabs">
        <button
          type="button"
          className={`filter-tab ${artworkFilter === 'all' ? 'active' : ''}`}
          onClick={() => setArtworkFilter('all')}
        >
          All
        </button>
        <button
          type="button"
          className={`filter-tab ${artworkFilter === 'available' ? 'active' : ''}`}
          onClick={() => setArtworkFilter('available')}
        >
          Available
        </button>
        <button
          type="button"
          className={`filter-tab ${artworkFilter === 'sold' ? 'active' : ''}`}
          onClick={() => setArtworkFilter('sold')}
        >
          Sold
        </button>
        <button
          type="button"
          className={`filter-tab ${artworkFilter === 'featured' ? 'active' : ''}`}
          onClick={() => setArtworkFilter('featured')}
        >
          Featured
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="artwork-form-container">
          <h3>Create New Artwork</h3>
          <form onSubmit={handleSubmit} className="artwork-form">
            {/* Image Upload */}
            <div className="form-group full-width">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            {/* Titles in all languages */}
            <div className="form-section">
              <h4>Title (All Languages)</h4>
              <div className="language-fields">
                {['en', 'es', 'fi', 'sv', 'so'].map(lang => (
                  <div key={`title-${lang}`} className="form-group">
                    <label>{lang.toUpperCase()}</label>
                    <input
                      type="text"
                      name={`title.${lang}`}
                      value={formData.title[lang]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Descriptions */}
            <div className="form-section">
              <h4>Description (All Languages)</h4>
              <div className="language-fields">
                {['en', 'es', 'fi', 'sv', 'so'].map(lang => (
                  <div key={`desc-${lang}`} className="form-group">
                    <label>{lang.toUpperCase()}</label>
                    <textarea
                      name={`description.${lang}`}
                      value={formData.description[lang]}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Technique */}
            <div className="form-section">
              <h4>Technique (All Languages)</h4>
              <div className="language-fields">
                {['en', 'es', 'fi', 'sv', 'so'].map(lang => (
                  <div key={`tech-${lang}`} className="form-group">
                    <label>{lang.toUpperCase()}</label>
                    <input
                      type="text"
                      name={`technique.${lang}`}
                      value={formData.technique[lang]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={getCurrentCategoryKey()}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select category</option>
                  {Object.keys(CATEGORIES).map(key => (
                    <option key={key} value={key}>
                      {CATEGORIES[key].en}
                    </option>
                  ))}
                </select>
                {/* Show category in all languages (preview only) */}
                {formData.category.en && (
                  <div className="category-preview">
                    <small>
                      EN: {formData.category.en} | 
                      ES: {formData.category.es} | 
                      FI: {formData.category.fi} | 
                      SV: {formData.category.sv} |
                      SO: {formData.category.so}
                    </small>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="form-row">
              <div className="form-group">
                <label>Width</label>
                <input
                  type="number"
                  name="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Height</label>
                <input
                  type="number"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select
                  name="dimensions.unit"
                  value={formData.dimensions.unit}
                  onChange={handleInputChange}
                >
                  <option value="cm">cm</option>
                  <option value="in">inches</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="form-row">
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="form-row">
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                  />
                  Available for sale
                </label>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  Featured artwork
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Create Artwork
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Artworks List */}
      <div className="artworks-list">
        <h3>{ARTWORK_FILTER_LABELS[artworkFilter]} ({artworks.length})</h3>
        <div className="artworks-grid">
          {artworks.map(artwork => (
            <div key={artwork._id} className="artwork-card">
              <div className="artwork-image">
                <img
                  src={`${API_URL}/uploads/artworks/${artwork.image}`}
                  alt={artwork.title[locale] || artwork.title.en}
                />
                {artwork.featured && <span className="badge-featured">Featured</span>}
                {!artwork.available && <span className="badge-sold">Sold</span>}
              </div>
              <div className="artwork-info">
                <h4>{artwork.title[locale] || artwork.title.en}</h4>
                <p className="category">{artwork.category[locale] || artwork.category.en}</p>
                <p className="price">
                  {artwork.currency === 'EUR' ? '€' : '$'}{artwork.price}
                </p>
                <p className="dimensions">
                  {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
                </p>
                <p className="year">{artwork.year}</p>
              </div>
              <div className="artwork-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditClick(artwork)}
                >
                  Edit
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(artwork._id, artwork.title[locale] || artwork.title.en)} 
                    className="btn-delete"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Render the ConfirmDialog */}
      {ConfirmDialog}

      <ArtworkEditModal
        artwork={editingArtwork}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={fetchArtworks}
      />
    </div>
  );
};

export default ArtworkManager;