import Artwork from '../models/Artwork.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { sanitizeInput } from '../utils/sanitizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getArtworks = async (req, res) => {
  try {
    const { category, featured, available, limit } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (available !== undefined) filter.available = available === 'true';

    let query = Artwork.find(filter).sort({ displayOrder: 1, createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const artworks = await query;

    res.status(200).json({
      success: true,
      count: artworks.length,
      data: artworks
    });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las obras de arte'
    });
  }
};


export const getArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Obra de arte no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: artwork
    });
  } catch (error) {
    console.error('Error fetching artwork:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la obra de arte'
    });
  }
};


export const createArtwork = async (req, res) => {
  try {
    // Extraer y sanitizar campos
    const {
      title,
      description,
      artist,
      technique,
      category,
      dimensions,
      price,
      year,
      available
    } = req.body;

    // SANITIZAR campos de texto
    const sanitizedData = {
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      artist: sanitizeInput(artist),
      technique: sanitizeInput(technique),
      category: sanitizeInput(category),
      dimensions: sanitizeInput(dimensions),
      price: price, 
      year: year, 
      available: available, 
      createdBy: req.user._id
    };

    // Agregar imagen si existe
    if (req.file) {
      sanitizedData.image = req.file.filename;
    }

    const artwork = await Artwork.create(sanitizedData);

    res.status(201).json({
      success: true,
      message: 'Obra de arte creada exitosamente',
      data: artwork
    });
  } catch (error) {
    console.error('Error creating artwork:', error);

    // Si hay error y se subió archivo, eliminar la imagen
    if (req.file) {
      try {
        const imagePath = path.join(__dirname, '../../uploads/artworks', req.file.filename);
        await fs.unlink(imagePath);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear la obra de arte',
      error: error.message
    });
  }
};


export const updateArtwork = async (req, res) => {
  try {
    let artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Obra de arte no encontrada'
      });
    }

    const oldImage = artwork.image;

    // Extraer y sanitizar campos
    const {
      title,
      description,
      artist,
      technique,
      category,
      dimensions,
      price,
      year,
      available
    } = req.body;

    // SANITIZAR campos de texto
    const updateData = {
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      artist: sanitizeInput(artist),
      technique: sanitizeInput(technique),
      category: sanitizeInput(category),
      dimensions: sanitizeInput(dimensions),
      price: price,
      year: year,
      available: available
    };

    // Si se subió nueva imagen
    if (req.file) {
      updateData.image = req.file.filename;
    }

    artwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Si se actualizó la imagen, eliminar la anterior
    if (req.file && oldImage) {
      try {
        const oldImagePath = path.join(__dirname, '../../uploads/artworks', oldImage);
        await fs.unlink(oldImagePath);
      } catch (unlinkError) {
        console.error('Error deleting old image:', unlinkError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Obra de arte actualizada exitosamente',
      data: artwork
    });
  } catch (error) {
    console.error('Error updating artwork:', error);

    // Si hay error y se subió archivo, eliminar la nueva imagen
    if (req.file) {
      try {
        const imagePath = path.join(__dirname, '../../uploads/artworks', req.file.filename);
        await fs.unlink(imagePath);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar la obra de arte',
      error: error.message
    });
  }
};


export const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Obra de arte no encontrada'
      });
    }

    // Eliminar imagen del servidor
    if (artwork.image) {
      try {
        const imagePath = path.join(__dirname, '../../uploads/artworks', artwork.image);
        await fs.unlink(imagePath);
      } catch (unlinkError) {
        console.error('Error deleting image file:', unlinkError);
      }
    }

    await artwork.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Obra de arte eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la obra de arte',
      error: error.message
    });
  }
};


export const reorderArtworks = async (req, res) => {
  try {
    const { artworks } = req.body; // Array de { id, displayOrder }

    const updatePromises = artworks.map(({ id, displayOrder }) =>
      Artwork.findByIdAndUpdate(id, { displayOrder }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Orden actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error reordering artworks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el orden',
      error: error.message
    });
  }
};