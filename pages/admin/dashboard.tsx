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
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                <span className="text-lg font-black text-emerald-600">JF</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">Admin Dashboard</h1>
                <p className="text-xs text-emerald-100">JOBICA FOODS Management</p>
              </div>
            </div>
            <Link
              href="/"
              className="text-white text-sm bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition"
            >
              View Store
            </Link>
          </div>
        </header>

        <main className="p-4 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <p className="text-gray-600">Manage your inventory</p>
              </div>
              <Link
                href="/admin"
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Add Product
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading products...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Unit</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            {product.brand && (
                              <p className="text-sm text-gray-500">{product.brand}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-emerald-600">₦{product.sellingPrice.toLocaleString()}</p>
                          {product.pricePerUnit && (
                            <p className="text-xs text-gray-500">₦{product.pricePerUnit}/unit</p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 capitalize">{product.unit}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/edit/${product.id}`}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
