import { useState, useEffect } from 'react';

function CategoryManagementModal({ categories: initialCategories, onSave, onClose }) {
  const [categories, setCategories] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    // Sort categories by sortOrder when modal opens
    const sorted = [...initialCategories].sort((a, b) => a.sortOrder - b.sortOrder);
    setCategories(sorted);
  }, [initialCategories]);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedIndex === null || draggedIndex === index) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[draggedIndex];

    newCategories.splice(draggedIndex, 1);
    newCategories.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setCategories(newCategories);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    // Update sortOrder for all categories based on their current position
    const updatedCategories = categories.map((cat, index) => ({
      id: cat.id,
      sortOrder: index,
    }));

    await onSave(updatedCategories);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Categories</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="drag-hint">💡 Drag and drop to reorder categories</p>
          <div className="category-management-list">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`category-management-item ${draggedIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <span className="drag-handle">⋮⋮</span>
                <div className="category-management-content">
                  <span className="category-management-name">{category.name}</span>
                  <span className="category-management-count">
                    {category._count?.items || 0} items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryManagementModal;
