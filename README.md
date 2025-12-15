# JOBICA FOODS - Wholesale & Retail Management System

A modern, mobile-first inventory and product management system for wholesale and retail food businesses.

![JOBICA FOODS](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

- 📱 **Mobile-First Design** - Optimized for mobile devices with responsive layout
- 🎨 **Modern UI** - Clean, professional interface with gradient headers and smooth animations
- 🔍 **Advanced Search** - Search products by name, brand, category, or tags
- 🏷️ **Product Management** - Add, edit, and delete products with ease
- 💰 **Flexible Pricing** - Support for bulk pricing and per-unit pricing
- 🖼️ **Image Management** - Upload and preview product images
- 📊 **Category Filtering** - Filter products by category and unit type
- 🎯 **Modal Details** - View product details in a beautiful overlay modal
- 📦 **Inventory Tracking** - Track selling price, cost price, and profit margins

## 🚀 Tech Stack

- **Framework:** Next.js 14 (React)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Deployment:** Vercel
- **Data Storage:** JSON-based (easily upgradeable to database)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/AboneChima/JobicaFoods.git
cd JobicaFoods
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
JobicaFoods/
├── pages/
│   ├── index.tsx              # Home page with product grid
│   ├── admin/
│   │   ├── index.tsx          # Add new product
│   │   └── edit/[id].tsx      # Edit product
│   ├── product/[id].tsx       # Product detail page
│   └── api/
│       └── products/          # API routes for CRUD operations
├── types/
│   └── product.ts             # TypeScript interfaces
├── data/
│   └── products.json          # Product data storage
├── public/
│   └── images/                # Product images
└── styles/
    └── globals.css            # Global styles
```

## 📝 Usage

### Adding Products
1. Click the **+** button (bottom right)
2. Fill in product details:
   - Name, Brand, Category
   - Unit type and size
   - Selling price and price per unit
   - Upload product image
   - Add tags and notes
3. Click **Add Product**

### Editing Products
1. Click on any product to view details
2. Click **Edit Product**
3. Update information
4. Click **Update Product**

### Searching & Filtering
- Use the search bar to find products
- Filter by category or unit type
- Results update in real-time

## 🎨 Features Showcase

### Product Categories
- Tomato Products
- Seasoning & Spices
- Noodles & Pasta
- Cooking Oil
- Grains & Foodstuff
- Eggs & Protein
- Condiments
- Non-Food Items

### Pricing Options
- **Bulk Pricing:** For packs, cartons, and wholesale
- **Per-Unit Pricing:** Individual item pricing (e.g., "by 1")
- **Cost Price Tracking:** Monitor profit margins

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy to Vercel:
```bash
npm install -g vercel
vercel
```

## 🔮 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and roles
- [ ] Sales tracking and analytics
- [ ] Invoice generation
- [ ] Stock level alerts
- [ ] Barcode scanning
- [ ] Multi-store support
- [ ] Export to Excel/PDF

## 👨‍💻 Developer

**Oracle**
- GitHub: [@AboneChima](https://github.com/AboneChima)
- Repository: [JobicaFoods](https://github.com/AboneChima/JobicaFoods.git)

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For suggestions or issues, please contact the developer.

## 📞 Support

For support or inquiries, please open an issue on GitHub.

---

Made with ❤️ by Oracle
