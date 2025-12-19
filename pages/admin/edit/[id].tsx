import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Product, CATEGORIES, UNITS } from '@/types/product';

export default function AdminEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    unit: '',
    size: '',
    sellingPrice: '',
    pricePerRow: '',
    pricePerHalfRow: '',
    pricePerUnit: '',
    costPrice: '',
    imageUrl: '',
    tags: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState('/images/placeholder.png');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setFormData({
          name: data.name,
          brand: data.brand || '',
          category: data.category,
          unit: data.unit,
          size: data.size || '',
          sellingPrice: data.sellingPrice.toString(),
          pricePerRow: data.pricePerRow?.toString() || '',
          pricePerHalfRow: data.pricePerHalfRow?.toString() || '',
          pricePerUnit: data.pricePerUnit?.toString() || '',
          costPrice: data.costPrice?.toString() || '',
          imageUrl: data.imageUrl,
          tags: data.tags.join(', '),
          notes: data.notes || '',
        });
        setImagePreview(data.imageUrl);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const updatedProduct = {
      ...formData,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      pricePerRow: formData.pricePerRow ? parseFloat(formData.pricePerRow) : undefined,
      pricePerHalfRow: formData.pricePerHalfRow ? parseFloat(formData.pricePerHalfRow) : undefined,
      pricePerUnit: formData.pricePerUnit ? parseFloat(formData.pricePerUnit) : undefined,
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        setSuccess('✅ Product updated successfully! Redirecting...');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        const data = await res.json();
        setError(`❌ Failed to update product: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError('❌ Network error. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('⚠️ Are you sure you want to delete this product? This action cannot be undone.')) return;

    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('✅ Product deleted successfully! Redirecting...');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        const data = await res.json();
        setError(`❌ Failed to delete product: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError('❌ Network error. Please check your connection and try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Product - JOBICA FOODS Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-4 flex items-center gap-3 shadow-lg">
          <button onClick={() => router.back()} className="text-2xl text-white font-bold">←</button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg font-black text-emerald-600">JF</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Edit Product</h1>
              <p className="text-xs text-emerald-100">JOBICA FOODS Admin</p>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-5xl mx-auto min-h-screen">
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border-2 border-green-500 text-green-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 animate-pulse">
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

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Unit *</label>
                    <select
                      required
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                    >
                      {UNITS.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g., Big Size, 500g, 1L"
                  />
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Product Image</h3>
                
                <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="/images/product.jpeg"
                    className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the image path or URL</p>
                </div>
              </div>
            </div>
            
            {/* Pricing Section - Full Width */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">💰 Pricing Options</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pack/Carton Price (₦) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="Main price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Per Row (₦)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pricePerRow}
                    onChange={(e) => setFormData({ ...formData, pricePerRow: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="Row price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Half Row (₦)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pricePerHalfRow}
                    onChange={(e) => setFormData({ ...formData, pricePerHalfRow: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="Half row price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Per Unit / By 1 (₦)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="Single unit"
                  />
                </div>
              </div>
            </div>

            {/* Tags and Notes - Full Width */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">🏷️ Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g., tomato, paste, sachet"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">💵 Cost Price (₦)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Your buying price"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">📝 Notes (Important Info)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="E.g., Sold in rows of 4, Available in different flavors, etc."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">This will be displayed to customers in product details</p>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-emerald-700 transition shadow-lg flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Product
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-8 bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
