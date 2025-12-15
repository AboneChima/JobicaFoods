import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { CATEGORIES, UNITS } from '@/types/product';

export default function AdminAdd() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: CATEGORIES[0],
    unit: UNITS[0],
    size: '',
    sellingPrice: '',
    pricePerUnit: '',
    costPrice: '',
    imageUrl: '/images/placeholder.png',
    tags: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('/images/placeholder.png');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const product = {
      ...formData,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      pricePerUnit: formData.pricePerUnit ? parseFloat(formData.pricePerUnit) : undefined,
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        router.push('/');
      }
    } catch (error) {
      alert('Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Product - JOBICA FOODS Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-4 flex items-center gap-3 shadow-lg">
          <Link href="/" className="text-2xl text-white font-bold">←</Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg font-black text-emerald-600">JF</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Add New Product</h1>
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
              <label className="block text-sm font-medium mb-1">Size (e.g., Big Tin, 1L)</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Selling Price (₦)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Pack/Carton price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price Per Unit (₦)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="By 1 price"
                />
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
                placeholder="e.g., tomato, paste, sachet"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-400 active:bg-emerald-700"
              >
                {saving ? 'Saving...' : 'Add Product'}
              </button>
              <Link
                href="/"
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg text-center font-medium active:bg-gray-300"
              >
                Cancel
              </Link>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
