'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import axios from '@/lib/axios';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { getErrorMessage } from '@/lib/apiErrors';
import { CATEGORIES } from '@/constants/artworkCategories';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/AlertDialog';
import '@/styles/ArtworkManager.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Admin-only editing modal - fields are intentionally not translated (see ArtworkManager.jsx)
export default function ArtworkEditModal({ artwork, open, onOpenChange, onSuccess }) {
  const t = useTranslations();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const [formData, setFormData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load the artwork being edited whenever the modal opens for it
  useEffect(() => {
    if (open && artwork) {
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
      setImageFile(null);
      setImagePreview(`${API_URL}/uploads/artworks/${artwork.image}`);
      setIsDirty(false);
    }
  }, [open, artwork]);

  if (!open || !artwork || !formData) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setIsDirty(true);

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
    const selectedCategory = CATEGORIES[e.target.value];
    setIsDirty(true);
    setFormData(prev => ({ ...prev, category: selectedCategory }));
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
      setIsDirty(true);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Any attempt to close (Cancel button or Escape) must go through this,
  // so unsaved changes are never lost silently
  const requestClose = async () => {
    if (isDirty) {
      const confirmed = await confirm({
        title: 'Discard changes?',
        description: 'You have unsaved changes to this artwork. Are you sure you want to discard them?',
        confirmText: 'Discard changes',
        cancelText: 'Keep editing',
        variant: 'danger',
      });
      if (!confirmed) return;
    }
    onOpenChange(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      formDataToSend.append('title', JSON.stringify(formData.title));
      formDataToSend.append('description', JSON.stringify(formData.description));
      formDataToSend.append('category', JSON.stringify(formData.category));
      formDataToSend.append('technique', JSON.stringify(formData.technique));
      formDataToSend.append('dimensions', JSON.stringify(formData.dimensions));

      formDataToSend.append('year', formData.year);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('currency', formData.currency);
      formDataToSend.append('available', formData.available);
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('displayOrder', formData.displayOrder);

      await axios.put(`/api/artworks/${artwork._id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      toast.success('Artwork updated', {
        description: 'The artwork has been updated successfully.',
      });
      setIsDirty(false);
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error('Error saving artwork:', err);
      const fallback = err.response?.data?.message || 'Error saving artwork';
      const errorMsg = getErrorMessage(t, err, { fallback });
      toast.error('Error saving artwork', {
        description: errorMsg,
      });
      // Keep the modal open with whatever the admin already typed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={(next) => { if (!next) requestClose(); }}>
        <AlertDialogContent className="artwork-edit-modal-content">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Artwork</AlertDialogTitle>
            <AlertDialogDescription>
              Update the artwork details below.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit} className="artwork-form">
            {/* Image Upload */}
            <div className="form-group full-width">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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

            <AlertDialogFooter>
              <button
                type="button"
                className="alert-dialog-cancel"
                onClick={requestClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              {/* Plain button (not AlertDialogAction) so a failed submit doesn't
                  auto-close the dialog - Radix's AlertDialogAction wraps Dialog.Close */}
              <button
                type="submit"
                className="alert-dialog-action"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Update Artwork'}
              </button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
      {ConfirmDialog}
    </>
  );
}
