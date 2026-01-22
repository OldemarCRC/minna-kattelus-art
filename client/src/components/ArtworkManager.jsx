'use client';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import axios from '@/lib/axios';
import '@/styles/ArtworkManager.css';

const CATEGORIES = {
  THEMES: {
    en: 'Themes',
    es: 'Temas',
    fi: 'Aiheet',
    sv: 'Teman',
    so: 'Mawduucyada'
  },
  LANDSCAPES: {
    en: 'Landscapes',
    es: 'Paisajes',
    fi: 'Maisemat',
    sv: 'Landskap',
    so: 'Landscapes'
  },
  ABSTRACT: {
    en: 'Abstract',
    es: 'Abstracto',
    fi: 'Abstrakti',
    sv: 'Abstrakt',
    so: 'Abstract'
  },
  PORTRAITS: {
    en: 'Portraits',
    es: 'Retratos',
    fi: 'Muotokuvat',
    sv: 'Porträtt',
    so: 'Portraits'
  },
  NATURE: {
    en: 'Nature',
    es: 'Naturaleza',
    fi: 'Luonto',
    sv: 'Natur',
    so: 'Dabeecadda'
  }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const ArtworkManager = () => {
  const locale = useLocale();
  const t = useTranslations();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
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
  }, []);

  const fetchArtworks = async () => {
    try {
      const response = await axios.get('/api/artworks');
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

      if (editingId) {
        await axios.put(`/api/artworks/${editingId}`, formDataToSend, config);
        toast.success('Artwork updated', {
          description: 'The artwork has been updated successfully.',
        });
      } else {
        await axios.post('/api/artworks', formDataToSend, config);
        toast.success('Artwork created', {
          description: 'The new artwork has been added to the gallery.',
        });
      }

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

  const handleEdit = (artwork) => {
    setFormData({
      title: artwork.title,
      description: artwork.description,
      technique: artwork.technique,
      category: artwork.category,
      year: artwork.year,
      dimensions: artwork.dimensions,
      price: artwork.price,
      currency: artwork.currency,
      available: artwork.available,
      featured: artwork.featured,
      displayOrder: artwork.displayOrder
    });
    setImagePreview(`${API_URL}/uploads/artworks/${artwork.image}`);
    setEditingId(artwork._id);
    setShowForm(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setEditingId(null);
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

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="artwork-form-container">
          <h3>{editingId ? 'Edit Artwork' : 'Create New Artwork'}</h3>
          <form onSubmit={handleSubmit} className="artwork-form">
            {/* Image Upload */}
            <div className="form-group full-width">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!editingId}
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
                {editingId ? 'Update Artwork' : 'Create Artwork'}
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
        <h3>All Artworks ({artworks.length})</h3>
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
                  onClick={() => handleEdit(artwork)}
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
    </div>
  );
};

export default ArtworkManager;