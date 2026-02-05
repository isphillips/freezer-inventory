# 🧊 Freezer Inventory Web App

A mobile-friendly web application for managing items in your chest freezer. Built with Node.js, Express, SQLite (via Prisma), and React.

## Features

- 📱 Mobile-first responsive design
- 📂 Organize items by category
- ✅ Mark items as consumed with easy restore
- 🔍 Search functionality
- 📅 Track both packaged dates and expiration dates
- ⚠️ Visual warnings for items expiring soon
- 📊 Track quantity and units
- 📸 Attach images to items
- 📝 Add notes to items
- 🎯 Drag and drop to reorder categories and items
- 🍔 Hamburger menu navigation
- 💚 Clean green flat UI design
- 🚀 Fast and lightweight SQLite database

## Tech Stack

**Backend:**
- Node.js + Express
- SQLite database
- Prisma ORM
- Multer for image uploads
- RESTful API

**Frontend:**
- React 18
- Vite
- Vanilla CSS (mobile-first)

## Project Structure

```
freezer-inventory/
├── .nvmrc                      # Node version specification
├── README.md
├── backend/
│   ├── .nvmrc
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.js             # Seed data script
│   │   └── dev.db              # SQLite database (generated)
│   └── src/
│       ├── routes/
│       │   ├── categories.js   # Category API routes
│       │   └── items.js        # Items API routes
│       └── index.js            # Express server
└── frontend/
    ├── .nvmrc
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── components/
        │   ├── Header.jsx
        │   ├── CategorySection.jsx
        │   ├── ItemRow.jsx
        │   ├── ItemModal.jsx
        │   └── CategoryModal.jsx
        ├── App.jsx             # Main app component
        ├── main.jsx            # React entry point
        └── index.css           # Global styles
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- (Optional) [nvm](https://github.com/nvm-sh/nvm) for Node version management

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd /Users/iphillips/dev/freezer-inventory
   ```

2. **(Optional) Use the correct Node version with nvm:**
   ```bash
   nvm use
   # Or if you need to install Node 18:
   nvm install 18
   nvm use 18
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Set up the database:**
   ```bash
   npm run migrate
   ```

   This will:
   - Generate Prisma client
   - Create the SQLite database
   - Run migrations
   - **Automatically seed the database** with your freezer inventory

5. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

You have two options to run the app:

### Option 1: Run Backend and Frontend Separately (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server will start on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will start on http://localhost:3000

**Access the app:** Open http://localhost:3000 in your browser

### Option 2: Run Both Concurrently (Alternative)

You can use a tool like `concurrently` to run both servers from the project root:

1. In the project root, install concurrently:
   ```bash
   npm install -g concurrently
   ```

2. Run both servers:
   ```bash
   concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
   ```

## API Endpoints

### Categories

- `GET /api/categories` - Get all categories with item counts
- `POST /api/categories` - Create a new category
- `POST /api/categories/reorder` - Reorder categories
  - Body: { categories: [{ id, sortOrder }, ...] }
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category (must be empty)

### Items

- `GET /api/items` - Get all items
  - Query params: `?categoryId=1&status=active&search=chicken`
- `POST /api/items` - Create a new item
  - Body: name, categoryId, quantity, unit, packagedDate, expirationDate, imageUrl, notes
- `POST /api/items/upload` - Upload an item image
  - Form data: image file (max 5MB, formats: jpeg, jpg, png, gif, webp)
  - Returns: { imageUrl: "/uploads/filename.jpg" }
- `POST /api/items/reorder` - Reorder items
  - Body: { items: [{ id, sortOrder }, ...] }
- `PUT /api/items/:id` - Update an item (including toggle consumed status)
- `DELETE /api/items/:id` - Delete an item

## Database Management

**View/edit data in Prisma Studio:**
```bash
cd backend
npm run studio
```
Opens a web interface at http://localhost:5555

**Re-seed the database:**
```bash
cd backend
npm run seed
```

**Reset database (Warning: deletes all data):**
```bash
cd backend
npx prisma migrate reset
```

## Usage Guide

### Adding Items

1. Click the **+** floating action button
2. Fill in the item details:
   - Name (required)
   - Category (required)
   - Quantity and unit (optional)
   - Packaged date (optional) - when the item was packaged
   - Expiration date (optional) - when the item expires
   - Image (optional) - upload a photo of the item
   - Notes (optional)
3. Click **Add**

### Attaching Images

- Click the file input in the add/edit modal to select an image
- Supported formats: JPEG, JPG, PNG, GIF, WebP
- Maximum file size: 5MB
- Images are displayed as thumbnails in the item list
- Click the thumbnail to view/edit the item
- Remove an image by clicking the ✕ button on the preview

### Marking Items as Consumed

- Check the checkbox next to any item
- Item moves to the "Consumed" tab
- To restore, switch to "Consumed" tab and uncheck the item

### Searching

- Use the search bar at the top to filter items by name
- Search works across all categories

### Expiration Warnings

- Items expiring within 30 days show a **yellow badge**
- Expired items show a **red badge**

### Editing/Deleting

- Click the ✏️ icon to edit an item
- Click the 🗑️ icon to delete an item (with confirmation)

## Mobile Experience

The app is optimized for mobile devices:

- Sticky header with search always accessible
- Touch-friendly buttons and checkboxes
- Swipe-friendly category sections
- Floating action button for quick item addition
- Bottom sheet modals on mobile

## Development

**Backend hot reload:**
The backend uses Node's `--watch` flag for automatic restart on file changes.

**Frontend hot reload:**
Vite provides instant HMR (Hot Module Replacement).

**Code structure:**
- Backend routes follow RESTful conventions
- Frontend uses React hooks for state management
- No external state management library needed (kept simple)

## Troubleshooting

**Port already in use:**
- Backend default: 3001
- Frontend default: 3000
- Change ports in `backend/src/index.js` and `frontend/vite.config.js`

**Database issues:**
```bash
cd backend
npx prisma migrate reset
npm run migrate
```

**Missing dependencies:**
```bash
# In backend or frontend directory
rm -rf node_modules package-lock.json
npm install
```

**Prisma client errors:**
```bash
cd backend
npx prisma generate
```

## Production Deployment

For detailed deployment instructions to free hosting (Render.com), see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Quick deploy to Render:**
1. Push code to GitHub
2. Connect to Render.com
3. Create Web Service with:
   - Build: `npm install && npm run build && npm run migrate && npm run seed`
   - Start: `npm run start`
   - Add 1GB persistent disk at `/opt/render/project/src`
4. Access at: `https://your-app.onrender.com`

Note: Database seeds automatically on first deploy only.

**Manual deployment:**

### Build Frontend
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

### Build Production
```bash
# From project root
npm install
npm run build
npm run migrate
```

### Start Production Server
```bash
npm start
```
The backend will serve both API and frontend static files.

### Environment Variables
- `NODE_ENV=production` - Enables production mode
- `PORT=3001` - Server port (optional, defaults to 3001)

### Reordering Items and Categories

- Click the hamburger menu (☰) and select "Manage Categories"
- Drag and drop categories to reorder them
- Within each category, drag items by the handle (⋮⋮) to reorder
- Changes are saved automatically

## Future Enhancements

- [ ] Export/import data as JSON
- [ ] "Low effort tonight" filter for ready-to-eat meals
- [ ] Sort by expiration within categories
- [ ] Barcode scanning
- [ ] Shopping list generation
- [ ] Multi-freezer support

## License

MIT License - feel free to use and modify as needed.

---

Built with ❤️ for efficient freezer management
