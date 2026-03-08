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

// High-quality Unsplash images for each product category
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
  ]
};

// 30 products for DejiOlanike Farm with image references
const products = [
  // FINGERLINGS (10 products)
  {
    _type: 'product',
    title: 'Premium Catfish Fingerlings (Week 1)',
    description: 'Healthy, active 1-week old catfish fingerlings. Perfect for starting your farm. Vaccinated and ready for pond stocking.',
    price: 50,
    unit: 'piece',
    productType: 'fingerlings',
    featured: true,
    inStock: true,
    order: 1,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-fingerlings-1' // Will be replaced with actual asset
      },
      alt: 'Premium catfish fingerlings in tank'
    }
  },
  {
    _type: 'product',
    title: 'Premium Catfish Fingerlings (Week 2)',
    description: 'Strong 2-week old fingerlings with excellent survival rate. Already feeding actively and disease-resistant.',
    price: 70,
    unit: 'piece',
    productType: 'fingerlings',
    featured: false,
    inStock: true,
    order: 2,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-fingerlings-2'
      },
      alt: 'Growing catfish fingerlings'
    }
  },
  {
    _type: 'product',
    title: 'Premium Catfish Fingerlings (Week 3)',
    description: 'Well-developed 3-week old fingerlings. Ready for transition to grow-out ponds. High uniformity and vigor.',
    price: 90,
    unit: 'piece',
    productType: 'fingerlings',
    featured: true,
    inStock: true,
    order: 3,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-fingerlings-3'
      },
      alt: 'Healthy catfish fingerlings'
    }
  },
  {
    _type: 'product',
    title: 'Premium Catfish Fingerlings (Week 4)',
    description: 'Juvenile catfish at 4 weeks. Perfect for farmers who want to skip the delicate early stage.',
    price: 120,
    unit: 'piece',
    productType: 'fingerlings',
    featured: false,
    inStock: true,
    order: 4,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-fingerlings-1'
      },
      alt: 'Juvenile catfish'
    }
  },
  {
    _type: 'product',
    title: 'Mixed Size Fingerlings (50-100g)',
    description: 'Assorted sizes of healthy fingerlings. Great for diversity in your pond.',
    price: 150,
    unit: 'piece',
    productType: 'fingerlings',
    featured: false,
    inStock: true,
    order: 5,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-fingerlings-2'
      },
      alt: 'Mixed size fingerlings'
    }
  },
  {
    _type: 'product',
    title: 'Clarias Gariepinus Fingerlings',
    description: 'Pure breed African catfish fingerlings. Known for fast growth and hardiness.',
    price: 80,
    unit: 'piece',
    productType: 'fingerlings',
    featured: true,
    inStock: true,
    order: 6,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-fingerlings-3'
      },
      alt: 'Clarias gariepinus fingerlings'
    }
  },
  {
    _type: 'product',
    title: 'Heterobranchus Fingerlings',
    description: 'Hybrid catfish fingerlings. Excellent growth rate and feed conversion ratio.',
    price: 100,
    unit: 'piece',
    productType: 'fingerlings',
    featured: false,
    inStock: true,
    order: 7,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-fingerlings-1'
      },
      alt: 'Heterobranchus fingerlings'
    }
  },
  {
    _type: 'product',
    title: 'Sex-Reversed Fingerlings',
    description: 'All-male fingerlings for faster, more uniform growth. Perfect for commercial operations.',
    price: 120,
    unit: 'piece',
    productType: 'fingerlings',
    featured: true,
    inStock: true,
    order: 8,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-fingerlings-2'
      },
      alt: 'Sex-reversed fingerlings'
    }
  },
  {
    _type: 'product',
    title: 'Vaccinated Fingerlings',
    description: 'Fingerlings that have received full vaccination protocol. Health guaranteed.',
    price: 110,
    unit: 'piece',
    productType: 'fingerlings',
    featured: false,
    inStock: true,
    order: 9,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-fingerlings-3'
      },
      alt: 'Vaccinated fingerlings'
    }
  },
  {
    _type: 'product',
    title: 'Premium Starter Pack (100 fingerlings)',
    description: 'Bundle of 100 premium fingerlings with free starter feed and stocking guide.',
    price: 4500,
    unit: 'pack',
    productType: 'bundles',
    featured: true,
    inStock: true,
    order: 10,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-bundles-1'
      },
      alt: 'Starter pack for fish farmers'
    }
  },

  // TABLE-SIZE FISH (8 products)
  {
    _type: 'product',
    title: 'Small Table-Size Catfish (300-500g)',
    description: 'Fresh catfish perfect for family meals. Cleaned and ready for cooking.',
    price: 1200,
    unit: 'kg',
    productType: 'table-size',
    featured: false,
    inStock: true,
    order: 11,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-table-1'
      },
      alt: 'Fresh small catfish'
    }
  },
  {
    _type: 'product',
    title: 'Medium Table-Size Catfish (500-800g)',
    description: 'Ideal size for restaurants and catering. Fresh from our ponds.',
    price: 1500,
    unit: 'kg',
    productType: 'table-size',
    featured: true,
    inStock: true,
    order: 12,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-table-2'
      },
      alt: 'Medium fresh catfish'
    }
  },
  {
    _type: 'product',
    title: 'Large Table-Size Catfish (800g-1.2kg)',
    description: 'Premium large catfish. Perfect for celebrations and events.',
    price: 2000,
    unit: 'kg',
    productType: 'table-size',
    featured: true,
    inStock: true,
    order: 13,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-table-3'
      },
      alt: 'Large fresh catfish'
    }
  },
  {
    _type: 'product',
    title: 'Jumbo Catfish (1.5kg+)',
    description: 'Extra large catfish for special occasions. Impressive size and quality.',
    price: 2500,
    unit: 'kg',
    productType: 'table-size',
    featured: false,
    inStock: true,
    order: 14,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-table-1'
      },
      alt: 'Jumbo catfish'
    }
  },
  {
    _type: 'product',
    title: 'Live Table-Size Fish',
    description: 'Live catfish delivered to your location. Perfect for those who prefer to process themselves.',
    price: 1800,
    unit: 'kg',
    productType: 'table-size',
    featured: false,
    inStock: true,
    order: 15,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-table-2'
      },
      alt: 'Live catfish'
    }
  },
  {
    _type: 'product',
    title: 'Dressed Catfish (Cleaned & Gutted)',
    description: 'Ready-to-cook catfish. Cleaned, gutted, and packed hygienically.',
    price: 2200,
    unit: 'kg',
    productType: 'table-size',
    featured: true,
    inStock: true,
    order: 16,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-table-3'
      },
      alt: 'Dressed catfish ready to cook'
    }
  },
  {
    _type: 'product',
    title: 'Smoked Catfish',
    description: 'Traditionally smoked catfish. Long shelf life, rich flavor.',
    price: 3000,
    unit: 'kg',
    productType: 'table-size',
    featured: true,
    inStock: true,
    order: 17,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-special-1'
      },
      alt: 'Smoked catfish'
    }
  },
  {
    _type: 'product',
    title: 'Catfish Fillets (Boneless)',
    description: 'Premium boneless catfish fillets. Perfect for high-end restaurants.',
    price: 3500,
    unit: 'kg',
    productType: 'table-size',
    featured: false,
    inStock: true,
    order: 18,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-table-1'
      },
      alt: 'Boneless catfish fillets'
    }
  },

  // FARMING SUPPLIES (7 products)
  {
    _type: 'product',
    title: 'Premium Floating Fish Feed (2mm)',
    description: 'High-protein floating feed for fingerlings. 45% protein content.',
    price: 8500,
    unit: 'bag',
    productType: 'supplies',
    featured: true,
    inStock: true,
    order: 19,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-supplies-1'
      },
      alt: 'Floating fish feed'
    }
  },
  {
    _type: 'product',
    title: 'Grower Fish Feed (4mm)',
    description: 'Specially formulated feed for growing fish. 40% protein.',
    price: 7500,
    unit: 'bag',
    productType: 'supplies',
    featured: false,
    inStock: true,
    order: 20,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-supplies-2'
      },
      alt: 'Grower fish feed'
    }
  },
  {
    _type: 'product',
    title: 'Finisher Fish Feed (6mm)',
    description: 'Final stage feed for table-size fish. Promotes rapid growth.',
    price: 7000,
    unit: 'bag',
    productType: 'supplies',
    featured: false,
    inStock: true,
    order: 21,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-supplies-3'
      },
      alt: 'Finisher fish feed'
    }
  },
  {
    _type: 'product',
    title: 'Pond Liner (10x10m)',
    description: 'High-quality HDPE pond liner. Durable and fish-safe.',
    price: 45000,
    unit: 'piece',
    productType: 'supplies',
    featured: true,
    inStock: true,
    order: 22,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-supplies-1'
      },
      alt: 'Pond liner for fish farming'
    }
  },
  {
    _type: 'product',
    title: 'Water Test Kit',
    description: 'Complete kit for testing pH, ammonia, nitrites, and oxygen levels.',
    price: 12500,
    unit: 'kit',
    productType: 'supplies',
    featured: false,
    inStock: true,
    order: 23,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-supplies-2'
      },
      alt: 'Water testing kit'
    }
  },
  {
    _type: 'product',
    title: 'Air Pump & Aeration Kit',
    description: 'Complete aeration system for medium-sized ponds.',
    price: 35000,
    unit: 'set',
    productType: 'supplies',
    featured: true,
    inStock: true,
    order: 24,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-supplies-3'
      },
      alt: 'Air pump and aeration system'
    }
  },
  {
    _type: 'product',
    title: 'Fish Harvesting Net',
    description: 'Professional-grade harvesting net. Gentle on fish.',
    price: 8500,
    unit: 'piece',
    productType: 'supplies',
    featured: false,
    inStock: true,
    order: 25,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-supplies-1'
      },
      alt: 'Fish harvesting net'
    }
  },

  // VALUE BUNDLES (5 products)
  {
    _type: 'product',
    title: 'Starter Farmer Bundle',
    description: 'Everything to start: 50 fingerlings + 2 bags feed + water test kit + guide',
    price: 35000,
    unit: 'bundle',
    productType: 'bundles',
    featured: true,
    inStock: true,
    order: 26,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-bundles-1'
      },
      alt: 'Starter bundle for new farmers'
    }
  },
  {
    _type: 'product',
    title: 'Commercial Starter Pack',
    description: '200 fingerlings + 5 bags feed + aeration system + full consultation',
    price: 95000,
    unit: 'bundle',
    productType: 'bundles',
    featured: true,
    inStock: true,
    order: 27,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-bundles-2'
      },
      alt: 'Commercial starter pack'
    }
  },
  {
    _type: 'product',
    title: 'Table-Fish Combo (5kg)',
    description: '5kg mixed size table fish. Perfect for family consumption.',
    price: 9000,
    unit: 'bundle',
    productType: 'bundles',
    featured: false,
    inStock: true,
    order: 28,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-bundles-1'
      },
      alt: 'Table fish combo pack'
    }
  },
  {
    _type: 'product',
    title: 'Family Feast Pack',
    description: '3kg smoked fish + 2kg fresh fillets + 1kg dried fish',
    price: 15000,
    unit: 'bundle',
    productType: 'bundles',
    featured: true,
    inStock: true,
    order: 29,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-special-1'
      },
      alt: 'Family feast fish pack'
    }
  },
  {
    _type: 'product',
    title: 'Pond Setup Package',
    description: 'Complete pond setup: liner + aeration + test kit + 100 fingerlings',
    price: 75000,
    unit: 'bundle',
    productType: 'bundles',
    featured: true,
    inStock: true,
    order: 30,
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-bundles-2'
      },
      alt: 'Complete pond setup package'
    }
  }
];

async function importProductsWithImages() {
  console.log('\n📦 Importing 30 Products with Images to DejiOlanike Farm\n');
  console.log('📊 Using project:', process.env.VITE_SANITY_PROJECT_ID);

  try {
    // Check if products already exist
    const count = await client.fetch(`count(*[_type == "product"])`);
    console.log(`📊 Existing products: ${count}`);

    if (count > 0) {
      const answer = await question(`There are already ${count} products. Do you want to ADD these 30 products to the existing ones? (yes/no): `);
      if (answer !== 'yes') {
        console.log('❌ Import cancelled');
        rl.close();
        return;
      }
    }

    console.log('\n🔄 Starting import...\n');

    const transaction = client.transaction();
    
    for (const product of products) {
      // Create slug from title
      const slug = product.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Remove the temporary image reference - we'll add real images in a separate step
      const { mainImage, ...productWithoutImage } = product;
      
      const productWithSlug = {
        ...productWithoutImage,
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
    
    console.log('\n📋 Summary:');
    console.log('   - Fingerlings: 10 products');
    console.log('   - Table-Size Fish: 8 products');
    console.log('   - Farming Supplies: 7 products');
    console.log('   - Value Bundles: 5 products');
    console.log('   Total: 30 products');
    
    console.log('\n✨ Next step:');
    console.log('   Run the image upload script to add product images:');
    console.log('   npm run add-product-images\n');

  } catch (error) {
    console.error('\n❌ Error importing products:', error);
  } finally {
    rl.close();
  }
}

// Check if token exists
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN not found in .env file');
  process.exit(1);
}

// Run import
importProductsWithImages();