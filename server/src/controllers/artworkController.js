import Artwork from '../models/Artwork.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { sanitizeInput } from '../utils/sanitizer.js';
import { hasActiveOrderForArtwork } from '../utils/orderValidation.js';

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
    // Parsear campos JSON
    const title = JSON.parse(req.body.title);
    const description = JSON.parse(req.body.description);
    const category = JSON.parse(req.body.category);
    const technique = JSON.parse(req.body.technique);
    const dimensions = JSON.parse(req.body.dimensions);

    // SANITIZAR campos multiidioma
    const sanitizedData = {
      title: {
        en: sanitizeInput(title.en),
        es: sanitizeInput(title.es),
        fi: sanitizeInput(title.fi),
        sv: sanitizeInput(title.sv),
        so: sanitizeInput(title.so)
      },
      description: {
        en: sanitizeInput(description.en),
        es: sanitizeInput(description.es),
        fi: sanitizeInput(description.fi),
        sv: sanitizeInput(description.sv),
        so: sanitizeInput(description.so)
      },
      technique: {
        en: sanitizeInput(technique.en),
        es: sanitizeInput(technique.es),
        fi: sanitizeInput(technique.fi),
        sv: sanitizeInput(technique.sv),
        so: sanitizeInput(technique.so)
      },
      category: {
        en: sanitizeInput(category.en),
        es: sanitizeInput(category.es),
        fi: sanitizeInput(category.fi),
        sv: sanitizeInput(category.sv),
        so: sanitizeInput(category.so)
      },
      year: parseInt(req.body.year),
      dimensions: {
        width: parseFloat(dimensions.width),
        height: parseFloat(dimensions.height),
        unit: dimensions.unit || 'cm'
      },
      price: parseFloat(req.body.price),
      currency: req.body.currency || 'EUR',
      available: req.body.available === 'true',
      featured: req.body.featured === 'true',
      displayOrder: parseInt(req.body.displayOrder) || 0,
      createdBy: req.user.id
    };

    // Agregar imagen si existe
    if (req.file) {
      sanitizedData.image = req.file.filename;
    }

    const artwork = await Artwork.create(sanitizedData);

    res.status(201).json({
      success: true,
      message: 'Artwork created successfully',
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
      message: 'Error creating artwork',
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
        message: 'Artwork not found'
      });
    }

    const oldImage = artwork.image;

    // If reactivating an artwork that was unavailable, make sure it's not
    // already claimed by another active order before allowing it
    if (req.body.available === 'true' && artwork.available === false) {
      const conflictingOrder = await hasActiveOrderForArtwork(artwork._id);

      if (conflictingOrder) {
        console.log(`⚠️ Cannot mark artwork ${artwork._id} as available - claimed by order ${conflictingOrder.orderNumber}`);
        return res.status(409).json({
          success: false,
          message: 'Artwork already reserved by another active order',
          errorCode: 'ARTWORK_HAS_ACTIVE_ORDER',
          errorData: { orderNumber: conflictingOrder.orderNumber, orderStatus: conflictingOrder.status }
        });
      }
    }

    // Parsear campos JSON
    const title = JSON.parse(req.body.title);
    const description = JSON.parse(req.body.description);
    const category = JSON.parse(req.body.category);
    const technique = JSON.parse(req.body.technique);
    const dimensions = JSON.parse(req.body.dimensions);

    // SANITIZAR campos multiidioma
    const updateData = {
      title: {
        en: sanitizeInput(title.en),
        es: sanitizeInput(title.es),
        fi: sanitizeInput(title.fi),
        sv: sanitizeInput(title.sv),
        so: sanitizeInput(title.so)
      },
      description: {
        en: sanitizeInput(description.en),
        es: sanitizeInput(description.es),
        fi: sanitizeInput(description.fi),
        sv: sanitizeInput(description.sv),
        so: sanitizeInput(description.so)
      },
      technique: {
        en: sanitizeInput(technique.en),
        es: sanitizeInput(technique.es),
        fi: sanitizeInput(technique.fi),
        sv: sanitizeInput(technique.sv),
        so: sanitizeInput(technique.so)
      },
      category: {
        en: sanitizeInput(category.en),
        es: sanitizeInput(category.es),
        fi: sanitizeInput(category.fi),
        sv: sanitizeInput(category.sv),
        so: sanitizeInput(category.so)
      },
      year: parseInt(req.body.year),
      dimensions: {
        width: parseFloat(dimensions.width),
        height: parseFloat(dimensions.height),
        unit: dimensions.unit || 'cm'
      },
      price: parseFloat(req.body.price),
      currency: req.body.currency || 'EUR',
      available: req.body.available === 'true',
      featured: req.body.featured === 'true',
      displayOrder: parseInt(req.body.displayOrder) || 0
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
      message: 'Artwork updated successfully',
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
      message: 'Error updating artwork',
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
        message: 'Artwork not found'
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
      message: 'Artwork deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting artwork',
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
      message: 'Display order updated successfully'
    });
  } catch (error) {
    console.error('Error reordering artworks:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating display order',
      error: error.message
    });
  }
};


export const getFeaturedArtworks = async (req, res) => {
  try {
    const featuredArtworks = await Artwork.find({ 
      featured: true,
    })
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(6)
    .select('-__v');

    res.status(200).json({
      success: true,
      count: featuredArtworks.length,
      data: featuredArtworks
    });
  } catch (error) {
    console.error('Error fetching featured artworks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured artworks',
      error: error.message
    });
  }
};