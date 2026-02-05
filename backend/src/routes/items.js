import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'item-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// POST /api/items/upload - Upload an image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
});

// GET /api/items - Get all items with filters
router.get('/', async (req, res) => {
  try {
    const { categoryId, status, search } = req.query;

    const where = {};

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (status) {
      where.status = status; // 'active' or 'consumed'
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { expirationDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items', message: error.message });
  }
});

// POST /api/items - Create a new item
router.post('/', async (req, res) => {
  try {
    const { name, categoryId, quantity, unit, packagedDate, expirationDate, imageUrl, notes } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }

    if (!categoryId) {
      return res.status(400).json({ error: 'Category is required' });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const item = await prisma.item.create({
      data: {
        name: name.trim(),
        categoryId: parseInt(categoryId),
        quantity: quantity ? parseFloat(quantity) : null,
        unit: unit || null,
        packagedDate: packagedDate ? new Date(packagedDate) : null,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        imageUrl: imageUrl || null,
        notes: notes || null,
        status: 'active',
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item', message: error.message });
  }
});

// PUT /api/items/:id - Update an item (including toggle consumed)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId, quantity, unit, packagedDate, expirationDate, imageUrl, notes, status } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);
    if (quantity !== undefined) updateData.quantity = quantity ? parseFloat(quantity) : null;
    if (unit !== undefined) updateData.unit = unit || null;
    if (packagedDate !== undefined) {
      updateData.packagedDate = packagedDate ? new Date(packagedDate) : null;
    }
    if (expirationDate !== undefined) {
      updateData.expirationDate = expirationDate ? new Date(expirationDate) : null;
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;
    if (notes !== undefined) updateData.notes = notes || null;

    // Handle status toggle
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'consumed') {
        updateData.consumedAt = new Date();
      } else if (status === 'active') {
        updateData.consumedAt = null;
      }
    }

    const item = await prisma.item.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: true,
      },
    });

    res.json(item);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(500).json({ error: 'Failed to update item', message: error.message });
  }
});

// DELETE /api/items/:id - Delete an item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.item.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(500).json({ error: 'Failed to delete item', message: error.message });
  }
});

// POST /api/items/reorder - Batch update item order
router.post('/reorder', async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    // Update each item's sortOrder
    await Promise.all(
      items.map((item) =>
        prisma.item.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    res.json({ message: 'Items reordered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder items', message: error.message });
  }
});

export default router;
