import { useState } from 'react';
import ItemRow from './ItemRow';

function CategorySection({
  category,
  items,
  onToggleItem,
  onEditItem,
  onDeleteItem,
  onMoveItemUp,
  onMoveItemDown,
  isExpiringSoon,
  isExpired,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [localItems, setLocalItems] = useState(items);

  // Update local items when props change
  useState(() => {
    setLocalItems(items);
  }, [items]);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...localItems];
    const draggedItem = newItems[draggedIndex];

    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setLocalItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);

    // Save the new order
    const updates = localItems.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }));

    // Call the reorder API
    fetch('/api/items/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: updates }),
    }).catch(error => {
      console.error('Failed to reorder items:', error);
      // Revert to original order on error
      setLocalItems(items);
    });
  };

  return (
    <div className="category-section">
      <div className="category-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h2>{category.name}</h2>
        <span className="category-count">{items.length}</span>
      </div>

      {isExpanded && (
        <div className="item-list">
          {localItems.map((item, index) => (
            <ItemRow
              key={item.id}
              item={item}
              index={index}
              onToggle={onToggleItem}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              isDragging={draggedIndex === index}
              isExpiringSoon={isExpiringSoon}
              isExpired={isExpired}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategorySection;
