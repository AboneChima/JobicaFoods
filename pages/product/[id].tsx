import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Product } from '@/types/product';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <Link href="/" className="text-emerald-600 underline">Go back</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} - JOBICA FOODS</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-4 flex items-center gap-3 shadow-lg">
          <button onClick={() => router.back()} className="text-2xl text-white font-bold">←</button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg font-black text-emerald-600">JF</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Product Details</h1>
              <p className="text-xs text-emerald-100">JOBICA FOODS</p>
            </div>
          </div>
        </header>

        <main className="p-4 max-w-2xl mx-auto">
          {/* Image */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
            <div className="aspect-[3/4] relative bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
              {product.brand && (
                <p className="text-gray-600 mt-1">Brand: {product.brand}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Unit</p>
                <p className="font-medium capitalize">{product.unit}</p>
              </div>
              {product.size && (
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-medium">{product.size}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Selling Price</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {product.sellingPrice > 0 ? `₦${product.sellingPrice}` : 'Not set'}
                </span>
              </div>
              {product.costPrice && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Cost Price</span>
                  <span className="text-gray-700">₦{product.costPrice}</span>
                </div>
              )}
            </div>

            {product.tags.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.notes && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700">{product.notes}</p>
              </div>
            )}

            <div className="text-xs text-gray-400 border-t pt-3">
              Last updated: {new Date(product.updatedAt).toLocaleString()}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            <Link
              href={`/admin/edit/${product.id}`}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg text-center font-medium active:bg-emerald-700"
            >
              Edit Product
            </Link>
            <Link
              href="/"
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg text-center font-medium active:bg-gray-300"
            >
              Back to List
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
