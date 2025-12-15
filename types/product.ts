export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: string;
  unit: 'sachet' | 'tin' | 'bottle' | 'carton' | 'pack' | 'crate' | 'bowl' | 'nylon' | 'bag';
  size?: string;
  sellingPrice: number;
  pricePerUnit?: number;
  costPrice?: number;
  imageUrl: string;
  tags: string[];
  notes?: string;
  updatedAt: string;
}

export const CATEGORIES = [
  'Tomato Products',
  'Seasoning & Spices',
  'Noodles & Pasta',
  'Cooking Oil',
  'Grains & Foodstuff',
  'Eggs & Protein',
  'Condiments',
  'Non-Food',
  'Others'
];

export const UNITS = ['sachet', 'tin', 'bottle', 'carton', 'pack', 'crate', 'bowl', 'nylon', 'bag'];
