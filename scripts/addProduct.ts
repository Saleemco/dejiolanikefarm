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

async function addProduct() {
  console.log('\n📝 Add New Product to Sanity\n');

  try {
    // Get product details
    const title = await question('Product Title: ');
    const description = await question('Description: ');
    const price = await question('Price (in Naira): ');
    const unit = await question('Unit [piece/kg/set/dozen]: ') || 'unit';
    const productType = await question('Type [fingerlings/table-size/supplies/bundles/specials]: ') || 'fingerlings';
    const featured = await question('Featured? (yes/no): ') === 'yes';
    const inStock = await question('In Stock? (yes/no): ') !== 'no';

    // Create slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create product object
    const product = {
      _type: 'product',
      title,
      slug: {
        _type: 'slug',
        current: slug,
      },
      description,
      price: parseFloat(price),
      unit,
      productType,
      featured,
      inStock,
    };

    console.log('\n📋 Product to add:');
    console.log(JSON.stringify(product, null, 2));

    const confirm = await question('\nAdd this product? (yes/no): ');
    
    if (confirm === 'yes') {
      const result = await client.create(product);
      console.log(`\n✅ Product added successfully!`);
      console.log(`   ID: ${result._id}`);
    } else {
      console.log('\n❌ Product not added');
    }

  } catch (error) {
    console.error('\n❌ Error adding product:', error);
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

addProduct();