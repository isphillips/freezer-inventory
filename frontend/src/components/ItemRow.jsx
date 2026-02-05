function ItemRow({ item, index, onToggle, onEdit, onDelete, onDragStart, onDragOver, onDragEnd, isDragging, isExpiringSoon, isExpired }) {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatQuantity = () => {
    if (!item.quantity) return null;
    return item.unit ? `${item.quantity} ${item.unit}` : `Qty: ${item.quantity}`;
  };

  const getExpirationClass = () => {
    if (!item.expirationDate) return '';
    if (isExpired(item.expirationDate)) return 'expired';
    if (isExpiringSoon(item.expirationDate)) return 'expiring-soon';
    return '';
  };

  return (
    <div
      className={`item ${item.status === 'consumed' ? 'consumed-item' : ''} ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
    >
      <span className="drag-handle">⋮⋮</span>

      <input
        type="checkbox"
        className="item-checkbox"
        checked={item.status === 'consumed'}
        onChange={() => onToggle(item)}
      />

      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="item-image"
          onClick={() => onEdit(item)}
        />
      )}

      <div className="item-content">
        <div className="item-name">{item.name}</div>
        <div className="item-meta">
          {formatQuantity() && <span className="item-tag">{formatQuantity()}</span>}
          {item.packagedDate && (
            <span className="item-tag">
              Pkg: {formatDate(item.packagedDate)}
            </span>
          )}
          {item.expirationDate && (
            <span className={`item-tag ${getExpirationClass()}`}>
              Exp: {formatDate(item.expirationDate)}
            </span>
          )}
          {item.notes && <span className="item-tag">{item.notes}</span>}
        </div>
      </div>

      <div className="item-actions">
        <button
          className="icon-btn"
          onClick={() => onEdit(item)}
          title="Edit"
          aria-label="Edit item"
        >
          ✏️
        </button>
        <button
          className="icon-btn"
          onClick={() => onDelete(item.id)}
          title="Delete"
          aria-label="Delete item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default ItemRow;
