import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Product } from '@/types/product';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      alert('Failed to delete product');
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Inventory</h2>
            <p className="text-gray-600">Total: {products.length} products</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading products...</div>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {products.map(product => (
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
