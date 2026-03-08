import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-03-04';
const token = import.meta.env.SANITY_API_TOKEN;

// Log to confirm token is loading (remove this after testing)
console.log('🔑 Token loaded:', token ? 'Yes' : 'No');

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,  // This must be here for write operations
  useCdn: false, // Important: false for write operations
  withCredentials: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);