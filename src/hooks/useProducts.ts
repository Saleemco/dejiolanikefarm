import { useEffect, useState } from 'react';
import { client } from '../sanity';

export interface Product {
  _id: string;
  title: string;
  description: string;
  image: any;
  price?: number;
  unit?: string;
  productType?: string;
  featured?: boolean;
  inStock?: boolean;
  order?: number;
  mainImage?: any;
}

// Enhanced fallback products
const fallbackProducts = [
  {
    _id: '1',
    title: 'Catfish Fingerlings',
    description: 'Strong, active juveniles ready for pond stocking.',
    price: 150,
    unit: 'piece',
    productType: 'fingerlings',
    featured: true,
    inStock: true,
  },
  {
    _id: '2',
    title: 'Table-Size Catfish',
    description: 'Fresh, mature fish for markets and kitchens.',
    price: 2500,
    unit: 'kg',
    productType: 'table-size',
    featured: true,
    inStock: true,
  },
  {
    _id: '3',
    title: 'Farming Supplies',
    description: 'Feeds, water tools, and practical guidance.',
    price: 5000,
    unit: 'set',
    productType: 'supplies',
    inStock: true,
  },
];

export const useProducts = (limit?: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check if Sanity is configured
        if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
          console.log('Sanity not configured, using fallback products');
          let data = [...fallbackProducts];
          if (limit) data = data.slice(0, limit);
          setProducts(data);
          setLoading(false);
          return;
        }

        // Try to fetch from Sanity
        console.log('Fetching from Sanity...');
        const query = `*[_type == "product"] | order(_createdAt desc)`;
        const data = await client.fetch(query);
        
        console.log('Sanity response:', data);
        
        if (data && Array.isArray(data) && data.length > 0) {
          // We have real products from Sanity
          let productsData = data;
          if (limit) productsData = productsData.slice(0, limit);
          setProducts(productsData);
        } else {
          // No products in Sanity, use fallback
          console.log('No products in Sanity, using fallback');
          let fallbackData = [...fallbackProducts];
          if (limit) fallbackData = fallbackData.slice(0, limit);
          setProducts(fallbackData);
        }
      } catch (err) {
        console.error('Error fetching from Sanity:', err);
        // Use fallback products on error
        let fallbackData = [...fallbackProducts];
        if (limit) fallbackData = fallbackData.slice(0, limit);
        setProducts(fallbackData);
        setError('Using sample products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  return { products, loading, error };
};