import { useState, useEffect } from 'react';

function CategoryModal({ category, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    sortOrder: 0,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        sortOrder: category.sortOrder || 0,
      });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      sortOrder: parseInt(formData.sortOrder),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{category ? 'Edit Category' : 'Add Category'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="name">Category Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="sortOrder">Sort Order</label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {category ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;
