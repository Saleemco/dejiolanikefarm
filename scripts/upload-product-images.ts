#!/usr/bin/env node
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-03-04',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const imageUrls = {
  fingerlings: [
    'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/7852357/pexels-photo-7852357.jpeg?w=600&h=400&fit=crop'
  ],
  'table-size': [
    'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3294109/pexels-photo-3294109.jpeg?w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/5665662/pexels-photo-5665662.jpeg?w=600&h=400&fit=crop'
  ],
  supplies: [
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/5855259/pexels-photo-5855259.jpeg?w=600&h=400&fit=crop'
  ],
  bundles: [
    'https://images.pexels.com/photos/6188829/pexels-photo-6188829.jpeg?w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/6188830/pexels-photo-6188830.jpeg?w=600&h=400&fit=crop'
  ],
  specials: [
    'https://images.unsplash.com/photo-1599084993091-aa0c74c2f39a?w=600&h=400&fit=crop'
  ]
};

async function uploadImage(url: string, filename: string) {
  try {
    console.log(`📥 Downloading: ${filename}`);
    const response = await fetch(url);
    const buffer = await response.buffer();
    
    console.log(`📤 Uploading to Sanity: ${filename}`);
    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
      contentType: 'image/jpeg',
    });
    
    console.log(`✅ Uploaded: ${asset._id}`);
    return asset;
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error);
    return null;
  }
}

async function addImagesToProducts() {
  console.log('\n🖼️ Adding images to imported products...\n');

  try {
    // Get all products without images
    const products = await client.fetch('*[_type == "product" && !defined(mainImage)] | order(order asc)');
    console.log(`📊 Found ${products.length} products needing images`);

    let updated = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`\n🔄 [${i+1}/${products.length}] Processing: ${product.title}`);

      // Pick an image based on product type
      const productType = product.productType || 'fingerlings';
      const images = imageUrls[productType] || imageUrls.fingerlings;
      const imageUrl = images[i % images.length];

      // Create filename
      const filename = `${productType}-${Date.now()}-${i}.jpg`;

      // Upload image
      const asset = await uploadImage(imageUrl, filename);
      
      if (asset) {
        // Update product with image reference
        await client
          .patch(product._id)
          .set({
            mainImage: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              },
              alt: product.title
            }
          })
          .commit();
        
        console.log(`✅ Updated ${product.title} with image`);
        updated++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - Updated: ${updated} products with images`);
    console.log(`\n✨ All images added successfully!`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Check if token exists
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN not found in .env file');
  process.exit(1);
}

// Run the script
addImagesToProducts();