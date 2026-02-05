import { useState } from 'react';

function Header({ searchQuery, onSearchChange, activeTab, onTabChange, onManageCategories }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuItemClick = (action) => {
    action();
    setMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-top">
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <h1>🧊 Grumpus Freezer Inventory</h1>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => onTabChange('active')}
          >
            Active Items
          </button>
          <button
            className={`tab ${activeTab === 'consumed' ? 'active' : ''}`}
            onClick={() => onTabChange('consumed')}
          >
            Consumed
          </button>
        </div>
      </header>

      {/* Side Menu */}
      {menuOpen && (
        <>
          <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
          <nav className={`side-menu ${menuOpen ? 'open' : ''}`}>
            <div className="menu-header">
              <h2>Menu</h2>
              <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                ✕
              </button>
            </div>
            <ul className="menu-list">
              <li>
                <button onClick={() => handleMenuItemClick(onManageCategories)}>
                  <span className="menu-icon">⚙️</span>
                  Manage Categories
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
}

export default Header;
