import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Product, CATEGORIES, UNITS } from '@/types/product';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGES } from '@/config/contact';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const searchLower = search.toLowerCase();
      const matchesSearch = !search || 
        product.name.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesUnit = !unitFilter || product.unit === unitFilter;
      
      return matchesSearch && matchesCategory && matchesUnit;
    });
  }, [products, search, categoryFilter, unitFilter]);

  return (
    <>
      <Head>
        <title>JOBICA FOODS - Wholesale & Retail</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 sticky top-0 z-10 shadow-lg">
          <div className="px-4 py-5">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-2xl font-black text-emerald-600">JF</span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-black text-white leading-tight tracking-tight">JOBICA FOODS</h1>
                <p className="text-sm font-semibold text-emerald-100 uppercase tracking-wider">Wholesale & Retail</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="search"
                placeholder="Search products, brands, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 pl-11 rounded-xl text-gray-900 text-base border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:shadow-lg transition"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b sticky top-[148px] z-10 px-4 py-3 flex gap-2 overflow-x-auto shadow-sm">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-white min-w-[140px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-white min-w-[120px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Units</option>
            {UNITS.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <main className="p-4 pb-24">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 px-4 mt-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-black text-white">JF</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">JOBICA FOODS</h3>
                <p className="text-xs text-gray-400">Wholesale & Retail</p>
              </div>
            </div>
            
            <div className="text-center space-y-2 mb-4">
              <p className="text-sm text-gray-300">Quality products at affordable prices</p>
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} JOBICA FOODS. All rights reserved.</p>
            </div>

            <div className="border-t border-gray-700 pt-4 text-center">
              <p className="text-xs text-gray-400 mb-2">Developed by Oracle</p>
              <a 
                href="https://github.com/AboneChima/JobicaFoods.git" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </footer>

        {/* WhatsApp Contact Button */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES.general)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:scale-95 transition group"
          title="Contact us on WhatsApp"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </div>
    </>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left">
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition active:scale-95 overflow-hidden">
        <div className="aspect-[3/4] relative bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-2">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight mb-1">{product.name}</h3>
          
          {product.brand && (
            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          )}
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
              {product.unit}
            </span>
            <span className="text-sm font-bold text-emerald-600">
              {product.sellingPrice > 0 ? `₦${product.sellingPrice.toLocaleString()}` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-4 flex items-center justify-between sm:rounded-t-2xl rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg font-black text-emerald-600">JF</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Product Details</h2>
              <p className="text-xs text-emerald-100">JOBICA FOODS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Image */}
          <div className="bg-gray-100 rounded-xl overflow-hidden mb-4">
            <div className="aspect-[3/4] relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
              {product.brand && (
                <p className="text-gray-600 mt-1">Brand: {product.brand}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="font-semibold text-sm">{product.category}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Unit</p>
                <p className="font-semibold text-sm capitalize">{product.unit}</p>
              </div>
              {product.size && (
                <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Size</p>
                  <p className="font-semibold text-sm">{product.size}</p>
                </div>
              )}
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Selling Price</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {product.sellingPrice > 0 ? `₦${product.sellingPrice.toLocaleString()}` : 'Not set'}
                </span>
              </div>
              {product.pricePerUnit && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-emerald-200">
                  <span className="text-sm text-gray-600">Price per unit</span>
                  <span className="text-lg font-bold text-emerald-700">₦{product.pricePerUnit.toLocaleString()}</span>
                </div>
              )}
              {product.costPrice && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-emerald-200">
                  <span className="text-sm text-gray-600">Cost Price</span>
                  <span className="text-sm font-semibold text-gray-700">₦{product.costPrice.toLocaleString()}</span>
                </div>
              )}
            </div>

            {product.tags.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.notes && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{product.notes}</p>
              </div>
            )}

            <div className="text-xs text-gray-400 pt-2 border-t">
              Last updated: {new Date(product.updatedAt).toLocaleString()}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 space-y-3 pb-2">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES.product(product.name))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-xl text-center font-semibold hover:bg-green-600 active:bg-green-700 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order on WhatsApp
            </a>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl text-center font-semibold active:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
