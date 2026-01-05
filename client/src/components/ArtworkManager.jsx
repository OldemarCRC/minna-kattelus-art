import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import './ArtworkManager.css';

const CATEGORIES = ['TEMAS', 'PAISAJES', 'ABSTRACTO', 'RETRATOS', 'NATURALEZA'];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ArtworkManager = () => {
  const { t } = useTranslation();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const userStr = sessionStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = currentUser?.role === 'admin';
  const [formData, setFormData] = useState({
    title: { en: '', es: '', fi: '', sv: '' },
    description: { en: '', es: '', fi: '', sv: '' },
    technique: { en: '', es: '', fi: '', sv: '' },
    category: '',
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
    setSuccess('');

    try {
      const formDataToSend = new FormData();

      // Agregar imagen si existe
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      // Agregar todos los campos
      formDataToSend.append('title', JSON.stringify(formData.title));
      formDataToSend.append('description', JSON.stringify(formData.description));
      formDataToSend.append('technique', JSON.stringify(formData.technique));
      formDataToSend.append('category', formData.category);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('dimensions', JSON.stringify(formData.dimensions));
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
        setSuccess('Artwork updated successfully');
      } else {
        await axios.post('/api/artworks', formDataToSend, config);
        setSuccess('Artwork created successfully');
      }

      resetForm();
      fetchArtworks();
      setShowForm(false);
    } catch (err) {
      console.error('Error saving artwork:', err);
      setError(err.response?.data?.message || 'Error saving artwork');
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) {
      return;
    }

    try {
      await axios.delete(`/api/artworks/${id}`);
      setSuccess('Artwork deleted successfully');
      fetchArtworks();
    } catch (err) {
      console.error('Error deleting artwork:', err);
      setError(err.response?.data?.message || 'Error deleting artwork');
    }
  };

  const resetForm = () => {
    setFormData({
      title: { en: '', es: '', fi: '', sv: '' },
      description: { en: '', es: '', fi: '', sv: '' },
      technique: { en: '', es: '', fi: '', sv: '' },
      category: '',
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
      {success && <div className="alert alert-success">{success}</div>}

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
                {['en', 'es', 'fi', 'sv'].map(lang => (
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
                {['en', 'es', 'fi', 'sv'].map(lang => (
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
                {['en', 'es', 'fi', 'sv'].map(lang => (
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

            {/* Category & Year */}
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                  alt={artwork.title.en}
                />
                {artwork.featured && <span className="badge-featured">Featured</span>}
                {!artwork.available && <span className="badge-sold">Sold</span>}
              </div>
              <div className="artwork-info">
                <h4>{artwork.title.en}</h4>
                <p className="category">{artwork.category}</p>
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
                  <button onClick={() => handleDelete(artwork._id)} className="btn-delete">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtworkManager;