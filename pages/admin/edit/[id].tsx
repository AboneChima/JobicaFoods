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
        router.push('/admin/dashboard');
      }
    } catch (error) {
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      alert('Failed to delete product');
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

        <main className="p-4 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-emerald-700">💰 Pricing Options</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Pack/Carton Price (₦) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Main price"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Per Row (₦)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pricePerRow}
                    onChange={(e) => setFormData({ ...formData, pricePerRow: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Row price"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Half Row (₦)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pricePerHalfRow}
                    onChange={(e) => setFormData({ ...formData, pricePerHalfRow: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Half row price"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Per Unit / By 1 (₦)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Single unit"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cost Price (₦)</label>
              <input
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Your buying price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Product Image</label>
              <div className="flex gap-3">
                <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Upload a product image (JPG, PNG)</p>
                  <p className="text-xs text-gray-400 mt-1">Or manually enter image path:</p>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="/images/product.jpeg"
                    className="w-full px-3 py-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
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

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Update Product'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 bg-red-600 text-white py-3 rounded-lg font-medium"
              >
                Delete
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
