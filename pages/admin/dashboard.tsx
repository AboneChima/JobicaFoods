import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Product } from '@/types/product';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.brand?.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm('⚠️ Are you sure you want to delete this product? This action cannot be undone.')) return;

    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        setSuccess('✅ Product deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(`❌ Failed to delete: ${data.error || 'Unknown error'}`);
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      setError('❌ Network error. Please try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - JOBICA FOODS</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 shadow-lg border-b-2 border-emerald-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-black text-emerald-600">JF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight">Admin Dashboard</h1>
                <p className="text-sm text-emerald-100">JOBICA FOODS Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="bg-white text-emerald-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-50 transition shadow-md flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                Add Product
              </Link>
              <Link
                href="/"
                target="_blank"
                className="text-white bg-white bg-opacity-20 px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-30 transition"
              >
                View Store →
              </Link>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border-2 border-green-500 text-green-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Product Inventory</h2>
                <p className="text-gray-600">
                  {filteredProducts.length} of {products.length} products
                </p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <input
                type="search"
                placeholder="Search products by name, brand, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 pl-11 rounded-lg text-gray-900 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-2">No products found</p>
              <p className="text-sm text-gray-400">Try adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden group">
                  <div className="aspect-[3/4] relative bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      ₦{product.sellingPrice.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight mb-1">{product.name}</h3>
                    {product.brand && (
                      <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                    )}
                    
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                        {product.category}
                      </span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                        {product.unit}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/edit/${product.id}`}
                        className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-red-600 text-white text-xs py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
