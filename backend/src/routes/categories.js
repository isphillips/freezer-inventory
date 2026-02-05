import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/categories - Get all categories with item counts
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
  }
});

// POST /api/categories - Create a new category
router.post('/', async (req, res) => {
  try {
    const { name, sortOrder } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        sortOrder: sortOrder || 0,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to create category', message: error.message });
  }
});

// PUT /api/categories/:id - Update a category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sortOrder } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.json(category);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to update category', message: error.message });
  }
});

// DELETE /api/categories/:id - Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has items
    const itemCount = await prisma.item.count({
      where: { categoryId: parseInt(id) },
    });

    if (itemCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with items',
        itemCount
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(500).json({ error: 'Failed to delete category', message: error.message });
  }
});

// POST /api/categories/reorder - Batch update category order
router.post('/reorder', async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: 'Categories must be an array' });
    }

    // Update each category's sortOrder
    await Promise.all(
      categories.map((category) =>
        prisma.category.update({
          where: { id: category.id },
          data: { sortOrder: category.sortOrder },
        })
      )
    );

    res.json({ message: 'Categories reordered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder categories', message: error.message });
  }
});

export default router;
