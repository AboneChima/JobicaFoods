import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Product } from '@/types/product';

const productsPath = path.join(process.cwd(), 'data', 'products.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const products: Product[] = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    res.status(200).json(products);
  } else if (req.method === 'POST') {
    const products: Product[] = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const newProduct: Product = {
      ...req.body,
      id: Date.now().toString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(newProduct);
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
