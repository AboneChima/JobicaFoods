import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Product } from '@/types/product';

const productsPath = path.join(process.cwd(), 'data', 'products.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const products: Product[] = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  const index = products.findIndex(p => p.id === id);

  if (req.method === 'GET') {
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(products[index]);
  } else if (req.method === 'PUT') {
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    products[index] = { ...products[index], ...req.body, updatedAt: new Date().toISOString() };
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.status(200).json(products[index]);
  } else if (req.method === 'DELETE') {
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    products.splice(index, 1);
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
