import { useState, useEffect } from 'react';

function ItemModal({ item, categories, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    quantity: '',
    unit: '',
    packagedDate: '',
    expirationDate: '',
    imageUrl: '',
    notes: '',
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        categoryId: item.categoryId || '',
        quantity: item.quantity || '',
        unit: item.unit || '',
        packagedDate: item.packagedDate
          ? new Date(item.packagedDate).toISOString().split('T')[0]
          : '',
        expirationDate: item.expirationDate
          ? new Date(item.expirationDate).toISOString().split('T')[0]
          : '',
        imageUrl: item.imageUrl || '',
        notes: item.notes || '',
      });
      if (item.imageUrl) {
        setImagePreview(item.imageUrl);
      }
    } else if (categories.length > 0) {
      setFormData((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [item, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      categoryId: parseInt(formData.categoryId),
      quantity: formData.quantity ? parseFloat(formData.quantity) : null,
      unit: formData.unit || null,
      packagedDate: formData.packagedDate || null,
      expirationDate: formData.expirationDate || null,
      imageUrl: formData.imageUrl || null,
      notes: formData.notes || null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/items/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
      setImagePreview(data.imageUrl);
    } catch (error) {
      alert('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    setImagePreview('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Edit Item' : 'Add Item'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
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
              <label htmlFor="categoryId">Category *</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <input
                  id="unit"
                  name="unit"
                  type="text"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g. lbs, pcs"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="packagedDate">Packaged Date</label>
                <input
                  id="packagedDate"
                  name="packagedDate"
                  type="date"
                  value={formData.packagedDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="expirationDate">Expiration Date</label>
                <input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Image</label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Item preview" />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={handleRemoveImage}
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              )}
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <p className="upload-status">Uploading...</p>}
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional details..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {item ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemModal;
