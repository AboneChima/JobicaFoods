import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Product } from '@/types/product';

const productsPath = path.join(process.cwd(), 'data', 'products.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { id } = req.query;

  try {
    const products: Product[] = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const index = products.findIndex(p => p.id === id);

    if (req.method === 'GET') {
      if (index === -1) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(products[index]);
    } 
    
    if (req.method === 'PUT') {
      if (index === -1) return res.status(404).json({ error: 'Product not found' });
      
      // Update product with new data
      products[index] = { 
        ...products[index], 
        ...req.body, 
        id: products[index].id, // Preserve ID
        updatedAt: new Date().toISOString() 
      };
      
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      return res.status(200).json({ success: true, product: products[index] });
    } 
    
    if (req.method === 'DELETE') {
      if (index === -1) return res.status(404).json({ error: 'Product not found' });
      products.splice(index, 1);
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      return res.status(200).json({ success: true, message: 'Product deleted' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
