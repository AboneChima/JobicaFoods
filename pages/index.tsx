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
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

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

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 sticky top-0 z-10 shadow-lg">
          <div className="px-4 sm:px-6 py-3 max-w-7xl mx-auto">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                <span className="text-lg sm:text-xl font-black text-emerald-600">JF</span>
              </div>
              <div className="flex-1">
                <h1 className="text-lg sm:text-xl font-black text-white leading-tight">JOBICA FOODS</h1>
                <p className="text-xs sm:text-sm font-semibold text-emerald-100 uppercase tracking-wide">Wholesale & Retail</p>
              </div>
            </div>
            
            {/* Search Bar with Voice */}
            <div className="relative max-w-2xl">
              <input
                type="search"
                placeholder="Search products, brands, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pl-9 sm:pl-11 pr-12 rounded-lg text-gray-900 text-sm sm:text-base border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-white transition"
              />
              <svg className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                onClick={startVoiceSearch}
                className={`absolute right-2 top-2 sm:top-2.5 p-1.5 rounded-lg transition ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                }`}
                title="Voice Search"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b sticky top-[112px] sm:top-[120px] z-10 px-4 sm:px-6 py-2 sm:py-3 flex gap-2 overflow-x-auto shadow-sm max-w-7xl mx-auto">
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
        <main className="p-4 sm:p-6 pb-24 max-w-7xl mx-auto flex-1">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
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
        <footer className="bg-gray-900 text-white py-4 px-4 border-t border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs text-gray-400 mb-1">© {new Date().getFullYear()} JOBICA FOODS. All rights reserved.</p>
            <p className="text-xs text-gray-500">
              Developed by <span className="text-emerald-400 font-semibold">Oracle Studio</span>
            </p>
          </div>
        </footer>

        {/* WhatsApp Contact Button */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES.general)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 bg-green-500 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:scale-95 transition hover:shadow-xl z-40"
          title="Contact us on WhatsApp"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
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
    <button onClick={onClick} className="w-full text-left group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 active:scale-98 overflow-hidden border border-gray-100 h-full flex flex-col">
        <div className="aspect-[3/4] relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full shadow-lg">
            ₦{product.sellingPrice.toLocaleString()}
          </div>
        </div>
        
        <div className="p-2.5 sm:p-3 flex-1 flex flex-col">
          <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-tight mb-1 flex-1">{product.name}</h3>
          
          <div className="flex items-center justify-between mt-1.5 gap-2">
            {product.brand && (
              <p className="text-xs text-gray-500 font-medium truncate">{product.brand}</p>
            )}
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
              {product.unit}
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
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-3 sm:px-4 sm:py-4 flex items-center justify-between sm:rounded-t-2xl rounded-t-2xl shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
              <span className="text-base sm:text-lg font-black text-emerald-600">JF</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">Product Details</h2>
              <p className="text-xs text-emerald-100 hidden sm:block">JOBICA FOODS</p>
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
        <div className="p-3 sm:p-4">
          {/* Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-3">
            <div className="aspect-[4/3] sm:aspect-[3/4] relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{product.name}</h3>
              {product.brand && (
                <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-semibold text-xs sm:text-sm">{product.category}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Unit</p>
                <p className="font-semibold text-xs sm:text-sm capitalize">{product.unit}</p>
              </div>
              {product.size && (
                <div className="bg-gray-50 rounded-lg p-2 col-span-2">
                  <p className="text-xs text-gray-500">Size</p>
                  <p className="font-semibold text-xs sm:text-sm">{product.size}</p>
                </div>
              )}
            </div>

            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700 font-semibold">Pricing</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Pack/Carton</span>
                  <span className="text-lg sm:text-xl font-bold text-emerald-600">
                    ₦{product.sellingPrice.toLocaleString()}
                  </span>
                </div>
                
                {product.pricePerRow && (
                  <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                    <span className="text-xs text-gray-600">Per Row</span>
                    <span className="text-base font-bold text-emerald-700">₦{product.pricePerRow.toLocaleString()}</span>
                  </div>
                )}
                
                {product.pricePerHalfRow && (
                  <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                    <span className="text-xs text-gray-600">Half Row</span>
                    <span className="text-base font-bold text-emerald-700">₦{product.pricePerHalfRow.toLocaleString()}</span>
                  </div>
                )}
                
                {product.pricePerUnit && (
                  <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                    <span className="text-xs text-gray-600">Per Unit (By 1)</span>
                    <span className="text-sm font-bold text-emerald-700">₦{product.pricePerUnit.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {product.notes && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold mb-1">📝 Important Note</p>
                <p className="text-sm text-gray-700 leading-relaxed">{product.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-3 space-y-2 pb-2">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES.product(product.name))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-600 active:bg-green-700 transition"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order on WhatsApp
            </a>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold active:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
