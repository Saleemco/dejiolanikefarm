import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

console.log('🔍 Sanity config loading...');

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-03-04';

console.log('📊 Environment variables:', {
  VITE_SANITY_PROJECT_ID: projectId,
  VITE_SANITY_DATASET: dataset,
  VITE_SANITY_API_VERSION: apiVersion,
});

if (!projectId) {
  console.error('❌ VITE_SANITY_PROJECT_ID is missing!');
}

// Create Sanity client
export const client = createClient({
  projectId: projectId || 'd2kzxvey', // Fallback to your actual ID
  dataset,
  apiVersion,
  useCdn: true,
});

console.log('✅ Sanity client created:', !!client);

// Set up image builder
const builder = imageUrlBuilder(client);
console.log('✅ Image builder created:', !!builder);

// Helper function to get image URLs
export const urlFor = (source: any) => {
  console.log('📸 urlFor called with:', source);
  return builder.image(source);
};