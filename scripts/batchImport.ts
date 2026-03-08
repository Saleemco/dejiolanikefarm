#!/usr/bin/env node
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-03-04',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Default products to import
const defaultProducts = [
  {
    _type: 'product',
    title: 'Catfish Fingerlings',
    description: 'Strong, active juveniles ready for pond stocking.',
    price: 150,
    unit: 'piece',
    productType: 'fingerlings',
    featured: true,
    inStock: true,
  },
  {
    _type: 'product',
    title: 'Table-Size Catfish',
    description: 'Fresh, mature fish for markets and kitchens.',
    price: 2500,
    unit: 'kg',
    productType: 'table-size',
    featured: true,
    inStock: true,
  },
  {
    _type: 'product',
    title: 'Farming Supplies',
    description: 'Feeds, water tools, and practical guidance.',
    price: 5000,
    unit: 'set',
    productType: 'supplies',
    inStock: true,
  },
  {
    _type: 'product',
    title: 'Premium Broodstock',
    description: 'High-quality breeding fish for hatcheries.',
    price: 15000,
    unit: 'pair',
    productType: 'table-size',
    featured: true,
    inStock: true,
  },
  {
    _type: 'product',
    title: 'Fish Feed - Starter',
    description: 'High-protein starter feed for fingerlings.',
    price: 8500,
    unit: 'bag',
    productType: 'supplies',
    inStock: true,
  },
];

async function importProducts() {
  console.log('\n📦 Batch Import Products\n');

  try {
    // Check if products already exist
    const count = await client.fetch(`count(*[_type == "product"])`);
    console.log(`📊 Existing products: ${count}`);

    if (count > 0) {
      const answer = await question(`There are already ${count} products. Continue? (yes/no): `);
      if (answer !== 'yes') {
        console.log('❌ Import cancelled');
        rl.close();
        return;
      }
    }

    console.log('\n🔄 Starting import...\n');

    const transaction = client.transaction();
    
    for (const product of defaultProducts) {
      // Create slug
      const slug = product.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const productWithSlug = {
        ...product,
        slug: {
          _type: 'slug',
          current: slug,
        },
      };

      transaction.create(productWithSlug);
      console.log(`   ✓ Queued: ${product.title}`);
    }

    const result = await transaction.commit();
    console.log(`\n✅ Successfully imported ${result.results.length} products!`);

  } catch (error) {
    console.error('\n❌ Error importing products:', error);
  } finally {
    rl.close();
  }
}

// Check if token exists
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN not found in .env file');
  console.log('\nTo fix:');
  console.log('1. Go to https://manage.sanity.io');
  console.log('2. Select your project');
  console.log('3. Settings → API → Tokens');
  console.log('4. Create a new token with Editor permissions');
  console.log('5. Add it to your .env file as SANITY_API_TOKEN=your_token_here\n');
  process.exit(1);
}

importProducts();