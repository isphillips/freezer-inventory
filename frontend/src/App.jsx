import { useState, useEffect } from 'react';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import ItemModal from './components/ItemModal';
import CategoryModal from './components/CategoryModal';
import CategoryManagementModal from './components/CategoryManagementModal';

const API_URL = '/api';

function App() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCategoryManagementModal, setShowCategoryManagementModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/items?status=${activeTab}`),
      ]);

      const categoriesData = await categoriesRes.json();
      const itemsData = await itemsRes.json();

      setCategories(categoriesData);
      setItems(itemsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleSaveItem = async (itemData) => {
    try {
      const url = editingItem
        ? `${API_URL}/items/${editingItem.id}`
        : `${API_URL}/items`;
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save item');
      }

      await loadData();
      setShowItemModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${API_URL}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      await loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggleItemStatus = async (item) => {
    try {
      const newStatus = item.status === 'active' ? 'consumed' : 'active';
      const response = await fetch(`${API_URL}/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update item');

      await loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      const url = editingCategory
        ? `${API_URL}/categories/${editingCategory.id}`
        : `${API_URL}/categories`;
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save category');
      }

      await loadData();
      setShowCategoryModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReorderCategories = async (reorderedCategories) => {
    try {
      const response = await fetch(`${API_URL}/categories/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: reorderedCategories }),
      });

      if (!response.ok) throw new Error('Failed to reorder categories');

      await loadData();
      setShowCategoryManagementModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMoveItemUp = async (item, categoryItems) => {
    const currentIndex = categoryItems.findIndex((i) => i.id === item.id);
    if (currentIndex <= 0) return;

    const newItems = [...categoryItems];
    [newItems[currentIndex - 1], newItems[currentIndex]] = [newItems[currentIndex], newItems[currentIndex - 1]];

    const updates = newItems.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }));

    try {
      const response = await fetch(`${API_URL}/items/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updates }),
      });

      if (!response.ok) throw new Error('Failed to reorder items');

      await loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMoveItemDown = async (item, categoryItems) => {
    const currentIndex = categoryItems.findIndex((i) => i.id === item.id);
    if (currentIndex >= categoryItems.length - 1) return;

    const newItems = [...categoryItems];
    [newItems[currentIndex], newItems[currentIndex + 1]] = [newItems[currentIndex + 1], newItems[currentIndex]];

    const updates = newItems.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }));

    try {
      const response = await fetch(`${API_URL}/items/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updates }),
      });

      if (!response.ok) throw new Error('Failed to reorder items');

      await loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const getFilteredItems = () => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getItemsByCategory = (categoryId) => {
    return getFilteredItems().filter((item) => item.categoryId === categoryId);
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    const date = new Date(expirationDate);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 30 && daysUntilExpiration >= 0;
  };

  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    const date = new Date(expirationDate);
    return date < new Date();
  };

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onManageCategories={() => setShowCategoryManagementModal(true)}
      />

      <div className="main-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : getFilteredItems().length === 0 ? (
          <div className="empty-state">
            <h3>
              {activeTab === 'consumed' ? 'No consumed items' : 'No items found'}
            </h3>
            <p>
              {searchQuery
                ? 'Try a different search term'
                : activeTab === 'consumed'
                ? 'Items you mark as consumed will appear here'
                : 'Add your first item to get started'}
            </p>
          </div>
        ) : (
          categories.map((category) => {
            const categoryItems = getItemsByCategory(category.id);
            if (categoryItems.length === 0) return null;

            return (
              <CategorySection
                key={category.id}
                category={category}
                items={categoryItems}
                onToggleItem={handleToggleItemStatus}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onMoveItemUp={(item) => handleMoveItemUp(item, categoryItems)}
                onMoveItemDown={(item) => handleMoveItemDown(item, categoryItems)}
                isExpiringSoon={isExpiringSoon}
                isExpired={isExpired}
              />
            );
          })
        )}
      </div>

      {activeTab === 'active' && (
        <button className="fab" onClick={handleAddItem} title="Add Item">
          +
        </button>
      )}

      {showItemModal && (
        <ItemModal
          item={editingItem}
          categories={categories}
          onSave={handleSaveItem}
          onClose={() => setShowItemModal(false)}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {showCategoryManagementModal && (
        <CategoryManagementModal
          categories={categories}
          onSave={handleReorderCategories}
          onClose={() => setShowCategoryManagementModal(false)}
        />
      )}
    </>
  );
}

export default App;
