import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { image, filename } = req.body;
    
    // In production, upload to cloud storage (Cloudinary, S3, etc.)
    // For now, return a placeholder URL
    const imageUrl = `/images/${filename || 'product-' + Date.now() + '.jpg'}`;
    
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
}
