// src/ProductsPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Fish, Droplets, Send, ArrowLeft, Search, Filter, 
  ChevronDown, Grid3X3, List, Star, Package, Truck,
  Shield, Leaf, TrendingUp, Award, Clock, RefreshCw
} from 'lucide-react';

// Product data with 30 items
const ALL_PRODUCTS = [
  // Fingerlings Category (1-10)
  {
    id: 1,
    image: '/images/product_fingerlings.jpg',
    title: 'Clarias Gariepinus Fingerlings',
    description: 'High-quality African Catfish fingerlings, 3-5cm, active and disease-resistant.',
    category: 'fingerlings',
    price: '₦50',
    priceUnit: 'per fingerling',
    minOrder: '100 pieces',
    inStock: true,
    rating: 4.8,
    reviews: 124,
    icon: Fish,
    tags: ['hatchery-bred', 'fast-growing']
  },
  {
    id: 2,
    image: '/images/product_fingerlings_2.jpg',
    title: 'Heterobranchus Fingerlings',
    description: 'Hybrid catfish fingerlings, known for faster growth and higher survival rate.',
    category: 'fingerlings',
    price: '₦70',
    priceUnit: 'per fingerling',
    minOrder: '100 pieces',
    inStock: true,
    rating: 4.9,
    reviews: 89,
    icon: Fish,
    tags: ['hybrid', 'high-yield']
  },
  {
    id: 3,
    image: '/images/product_fingerlings_3.jpg',
    title: 'Juvenile Catfish (5-7cm)',
    description: 'Larger juveniles, perfect for farmers who want to skip the nursery phase.',
    category: 'fingerlings',
    price: '₦120',
    priceUnit: 'per piece',
    minOrder: '50 pieces',
    inStock: true,
    rating: 4.7,
    reviews: 56,
    icon: Fish,
    tags: ['ready-to-stock', 'hardy']
  },
  {
    id: 4,
    image: '/images/product_fingerlings_4.jpg',
    title: 'Juvenile Catfish (8-10cm)',
    description: 'Well-developed juveniles with high survival rate in grow-out ponds.',
    category: 'fingerlings',
    price: '₦180',
    priceUnit: 'per piece',
    minOrder: '40 pieces',
    inStock: true,
    rating: 4.8,
    reviews: 42,
    icon: Fish,
    tags: ['premium', 'high-survival']
  },
  {
    id: 5,
    image: '/images/product_fingerlings_5.jpg',
    title: 'Select Breeder Fingerlings',
    description: 'Specially selected fingerlings for breeding programs.',
    category: 'fingerlings',
    price: '₦250',
    priceUnit: 'per piece',
    minOrder: '20 pieces',
    inStock: true,
    rating: 5.0,
    reviews: 18,
    icon: Fish,
    tags: ['breeder-quality', 'select']
  },
  {
    id: 6,
    image: '/images/product_fingerlings_6.jpg',
    title: 'Clarias Fingerlings (Mixed Sex)',
    description: 'Standard mixed-sex fingerlings for table fish production.',
    category: 'fingerlings',
    price: '₦45',
    priceUnit: 'per fingerling',
    minOrder: '200 pieces',
    inStock: true,
    rating: 4.5,
    reviews: 203,
    icon: Fish,
    tags: ['standard', 'affordable']
  },
  {
    id: 7,
    image: '/images/product_fingerlings_7.jpg',
    title: 'All-Male Fingerlings',
    description: 'Genetically improved all-male fingerlings for uniform growth.',
    category: 'fingerlings',
    price: '₦85',
    priceUnit: 'per fingerling',
    minOrder: '100 pieces',
    inStock: true,
    rating: 4.9,
    reviews: 67,
    icon: Fish,
    tags: ['all-male', 'uniform-growth']
  },
  {
    id: 8,
    image: '/images/product_fingerlings_8.jpg',
    title: 'Grow-Out Juveniles (12-15cm)',
    description: 'Nearly table-size juveniles for quick harvest in 4-6 weeks.',
    category: 'fingerlings',
    price: '₦300',
    priceUnit: 'per piece',
    minOrder: '20 pieces',
    inStock: true,
    rating: 4.8,
    reviews: 31,
    icon: Fish,
    tags: ['quick-harvest', 'premium']
  },
  {
    id: 9,
    image: '/images/product_fingerlings_9.jpg',
    title: 'Nursery-Ready Fry',
    description: 'Freshly hatched fry, ideal for nursery pond stocking.',
    category: 'fingerlings',
    price: '₦25',
    priceUnit: 'per piece',
    minOrder: '500 pieces',
    inStock: true,
    rating: 4.4,
    reviews: 78,
    icon: Fish,
    tags: ['fry', 'nursery']
  },
  {
    id: 10,
    image: '/images/product_fingerlings_10.jpg',
    title: 'Premium Broodstock',
    description: 'Select broodstock for hatchery operations, disease-free and vigorous.',
    category: 'fingerlings',
    price: '₦1,500',
    priceUnit: 'per kg',
    minOrder: '10 kg',
    inStock: true,
    rating: 5.0,
    reviews: 12,
    icon: Fish,
    tags: ['broodstock', 'premium']
  },

  // Table-Size Fish (11-18)
  {
    id: 11,
    image: '/images/product_tablesize.jpg',
    title: 'Table-Size Catfish (1-1.5kg)',
    description: 'Fresh, live catfish perfect for restaurants and households.',
    category: 'table-size',
    price: '₦1,800',
    priceUnit: 'per kg',
    minOrder: '10 kg',
    inStock: true,
    rating: 4.7,
    reviews: 156,
    icon: Fish,
    tags: ['fresh', 'restaurant-quality']
  },
  {
    id: 12,
    image: '/images/product_tablesize_2.jpg',
    title: 'Table-Size Catfish (1.5-2kg)',
    description: 'Larger table fish, ideal for processing and smoking.',
    category: 'table-size',
    price: '₦1,700',
    priceUnit: 'per kg',
    minOrder: '10 kg',
    inStock: true,
    rating: 4.8,
    reviews: 98,
    icon: Fish,
    tags: ['large-size', 'smoking']
  },
  {
    id: 13,
    image: '/images/product_tablesize_3.jpg',
    title: 'Premium Jumbo Catfish (2-3kg)',
    description: 'Jumbo-sized catfish for special orders and events.',
    category: 'table-size',
    price: '₦1,600',
    priceUnit: 'per kg',
    minOrder: '5 kg',
    inStock: true,
    rating: 4.9,
    reviews: 45,
    icon: Fish,
    tags: ['jumbo', 'special-order']
  },
  {
    id: 14,
    image: '/images/product_tablesize_4.jpg',
    title: 'Mixed-Size Table Fish',
    description: 'Assorted sizes (1-2.5kg) at a discounted bulk rate.',
    category: 'table-size',
    price: '₦1,500',
    priceUnit: 'per kg',
    minOrder: '20 kg',
    inStock: true,
    rating: 4.6,
    reviews: 67,
    icon: Fish,
    tags: ['bulk', 'discount']
  },
  {
    id: 15,
    image: '/images/product_tablesize_5.jpg',
    title: 'Smoked Catfish (Whole)',
    description: 'Hot-smoked catfish, ready to eat, vacuum-packed.',
    category: 'table-size',
    price: '₦2,500',
    priceUnit: 'per piece',
    minOrder: '5 pieces',
    inStock: true,
    rating: 4.9,
    reviews: 112,
    icon: Fish,
    tags: ['smoked', 'ready-to-eat']
  },
  {
    id: 16,
    image: '/images/product_tablesize_6.jpg',
    title: 'Catfish Fillets (Fresh)',
    description: 'Skinless, boneless catfish fillets, vacuum-sealed.',
    category: 'table-size',
    price: '₦3,000',
    priceUnit: 'per kg',
    minOrder: '2 kg',
    inStock: true,
    rating: 4.8,
    reviews: 43,
    icon: Fish,
    tags: ['fillets', 'premium-cut']
  },
  {
    id: 17,
    image: '/images/product_tablesize_7.jpg',
    title: 'Frozen Catfish (Whole)',
    description: 'Individually quick-frozen whole catfish, vacuum-packed.',
    category: 'table-size',
    price: '₦2,200',
    priceUnit: 'per kg',
    minOrder: '5 kg',
    inStock: true,
    rating: 4.7,
    reviews: 89,
    icon: Fish,
    tags: ['frozen', 'long-shelf-life']
  },
  {
    id: 18,
    image: '/images/product_tablesize_8.jpg',
    title: 'Catfish Steaks',
    description: 'Fresh-cut catfish steaks, perfect for grilling.',
    category: 'table-size',
    price: '₦2,800',
    priceUnit: 'per kg',
    minOrder: '2 kg',
    inStock: true,
    rating: 4.8,
    reviews: 34,
    icon: Fish,
    tags: ['steaks', 'grilling']
  },

  // Farming Supplies (19-25)
  {
    id: 19,
    image: '/images/product_supplies.jpg',
    title: 'Floating Fish Feed (2mm)',
    description: 'High-protein floating pellets for fingerlings and juveniles.',
    category: 'supplies',
    price: '₦12,000',
    priceUnit: 'per 15kg bag',
    minOrder: '1 bag',
    inStock: true,
    rating: 4.8,
    reviews: 234,
    icon: Package,
    tags: ['feed', 'floating']
  },
  {
    id: 20,
    image: '/images/product_supplies_2.jpg',
    title: 'Floating Fish Feed (4mm)',
    description: 'Grower feed for table-size fish, optimal protein balance.',
    category: 'supplies',
    price: '₦11,500',
    priceUnit: 'per 15kg bag',
    minOrder: '1 bag',
    inStock: true,
    rating: 4.7,
    reviews: 178,
    icon: Package,
    tags: ['feed', 'grower']
  },
  {
    id: 21,
    image: '/images/product_supplies_3.jpg',
    title: 'Floating Fish Feed (6mm)',
    description: 'Finisher feed for harvest-ready fish.',
    category: 'supplies',
    price: '₦11,000',
    priceUnit: 'per 15kg bag',
    minOrder: '1 bag',
    inStock: true,
    rating: 4.6,
    reviews: 145,
    icon: Package,
    tags: ['feed', 'finisher']
  },
  {
    id: 22,
    image: '/images/product_supplies_4.jpg',
    title: 'Sinking Fish Feed',
    description: 'Sinking pellets for bottom feeders and catfish.',
    category: 'supplies',
    price: '₦10,500',
    priceUnit: 'per 15kg bag',
    minOrder: '1 bag',
    inStock: true,
    rating: 4.5,
    reviews: 98,
    icon: Package,
    tags: ['feed', 'sinking']
  },
  {
    id: 23,
    image: '/images/product_supplies_5.jpg',
    title: 'Water Test Kit',
    description: 'Complete kit for testing pH, ammonia, nitrite, and nitrate.',
    category: 'supplies',
    price: '₦25,000',
    priceUnit: 'per kit',
    minOrder: '1 kit',
    inStock: true,
    rating: 4.9,
    reviews: 56,
    icon: Droplets,
    tags: ['water-quality', 'testing']
  },
  {
    id: 24,
    image: '/images/product_supplies_6.jpg',
    title: 'Pond Aerator (1HP)',
    description: 'Heavy-duty pond aerator for optimal oxygen levels.',
    category: 'supplies',
    price: '₦85,000',
    priceUnit: 'per unit',
    minOrder: '1 unit',
    inStock: true,
    rating: 4.8,
    reviews: 23,
    icon: Droplets,
    tags: ['aerator', 'equipment']
  },
  {
    id: 25,
    image: '/images/product_supplies_7.jpg',
    title: 'Nylon Fishing Net',
    description: 'Durable nylon net for harvesting, 2-inch mesh.',
    category: 'supplies',
    price: '₦15,000',
    priceUnit: 'per piece',
    minOrder: '1 piece',
    inStock: true,
    rating: 4.6,
    reviews: 67,
    icon: Package,
    tags: ['harvesting', 'net']
  },

  // Special Offers & Services (26-30)
  {
    id: 26,
    image: '/images/product_service_1.jpg',
    title: 'Farm Setup Consultation',
    description: 'On-site consultation for new fish farmers, includes pond design and stocking plan.',
    category: 'services',
    price: '₦50,000',
    priceUnit: 'per session',
    minOrder: '1 session',
    inStock: true,
    rating: 5.0,
    reviews: 15,
    icon: Award,
    tags: ['consultation', 'new-farmers']
  },
  {
    id: 27,
    image: '/images/product_service_2.jpg',
    title: 'Water Quality Testing',
    description: 'Professional water quality analysis with recommendations.',
    category: 'services',
    price: '₦5,000',
    priceUnit: 'per test',
    minOrder: '1 test',
    inStock: true,
    rating: 4.8,
    reviews: 42,
    icon: Droplets,
    tags: ['water-quality', 'analysis']
  },
  {
    id: 28,
    image: '/images/product_bundle_1.jpg',
    title: 'Starter Farm Bundle',
    description: 'Everything to start: 500 fingerlings + 2 bags feed + water test kit.',
    category: 'bundles',
    price: '₦45,000',
    priceUnit: 'per bundle',
    minOrder: '1 bundle',
    inStock: true,
    rating: 4.9,
    reviews: 28,
    icon: Package,
    tags: ['starter', 'bundle']
  },
  {
    id: 29,
    image: '/images/product_bundle_2.jpg',
    title: 'Grower Farm Bundle',
    description: '300 juveniles + 3 bags grower feed + aeration stone.',
    category: 'bundles',
    price: '₦85,000',
    priceUnit: 'per bundle',
    minOrder: '1 bundle',
    inStock: true,
    rating: 4.8,
    reviews: 19,
    icon: Package,
    tags: ['grower', 'bundle']
  },
  {
    id: 30,
    image: '/images/product_bundle_3.jpg',
    title: 'Harvest Season Special',
    description: 'Bulk purchase of mixed-size table fish at special pricing.',
    category: 'specials',
    price: '₦1,400',
    priceUnit: 'per kg',
    minOrder: '50 kg',
    inStock: true,
    rating: 4.7,
    reviews: 34,
    icon: TrendingUp,
    tags: ['bulk', 'seasonal']
  }
];

// Categories for filtering
const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: Grid3X3 },
  { id: 'fingerlings', name: 'Fingerlings & Juveniles', icon: Fish },
  { id: 'table-size', name: 'Table-Size Fish', icon: Fish },
  { id: 'supplies', name: 'Farming Supplies', icon: Package },
  { id: 'services', name: 'Services', icon: Award },
  { id: 'bundles', name: 'Value Bundles', icon: Package },
  { id: 'specials', name: 'Special Offers', icon: TrendingUp }
];

function ProductsPage() {
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState(ALL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter products based on category, search, and other filters
  useEffect(() => {
    let filtered = [...ALL_PRODUCTS];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    filtered = filtered.filter(p => {
      const priceNum = parseInt(p.price.replace(/[₦,]/g, ''));
      return priceNum >= priceRange.min && priceNum <= priceRange.max;
    });

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[₦,]/g, ''));
          const priceB = parseInt(b.price.replace(/[₦,]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[₦,]/g, ''));
          const priceB = parseInt(b.price.replace(/[₦,]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // 'featured' - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, sortBy, priceRange, inStockOnly]);

  const handleQuickInquiry = (productTitle: string) => {
    const message = `I'm interested in your *${productTitle}*. Please provide more information.`;
    const whatsappUrl = `https://wa.me/2348012345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F4FBF9]">
      {/* Header */}
      <div className="bg-white border-b border-[#E6F6F2] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-[#0B3C3C] hover:text-[#2EC4B6] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-[#0B3C3C]">Our Products</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#2EC4B6] text-white' : 'bg-[#E6F6F2] text-[#3A5A5A]'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#2EC4B6] text-white' : 'bg-[#E6F6F2] text-[#3A5A5A]'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#0B3C3C]">Filters</h2>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-[#2EC4B6]"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              
              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categories */}
                <div>
                  <h3 className="font-medium text-[#0B3C3C] mb-3">Categories</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-[#2EC4B6] text-white'
                            : 'text-[#3A5A5A] hover:bg-[#E6F6F2]'
                        }`}
                      >
                        <category.icon className="w-4 h-4" />
                        <span className="text-sm">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-[#0B3C3C] mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-[#3A5A5A]">
                      <span>₦0</span>
                      <span>₦{priceRange.max.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded border-[#E6F6F2] text-[#2EC4B6] focus:ring-[#2EC4B6]"
                    />
                    <span className="text-sm text-[#3A5A5A]">Show in stock only</span>
                  </label>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSortBy('featured');
                    setPriceRange({ min: 0, max: 100000 });
                    setInStockOnly(false);
                  }}
                  className="w-full px-4 py-2 border border-[#E6F6F2] rounded-lg text-sm text-[#3A5A5A] hover:bg-[#E6F6F2] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3A5A5A]" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#E6F6F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-[#E6F6F2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-[#3A5A5A]">
              Showing {filteredProducts.length} of {products.length} products
            </div>

            {/* Products Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {product.rating >= 4.8 && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          {product.rating}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-[#0B3C3C]">{product.title}</h3>
                        <product.icon className="w-5 h-5 text-[#2EC4B6]" />
                      </div>
                      <p className="text-sm text-[#3A5A5A] mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.map((tag, i) => (
                          <span key={i} className="text-xs bg-[#E6F6F2] text-[#0B3C3C] px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-lg font-bold text-[#0B3C3C]">{product.price}</p>
                          <p className="text-xs text-[#3A5A5A]">{product.priceUnit}</p>
                          <p className="text-xs text-[#3A5A5A] mt-1">Min: {product.minOrder}</p>
                        </div>
                        <button
                          onClick={() => handleQuickInquiry(product.title)}
                          disabled={!product.inStock}
                          className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                            product.inStock
                              ? 'bg-[#2EC4B6] hover:bg-[#25A99C] text-white'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Send className="w-4 h-4" />
                          Inquire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
                  >
                    <div className="md:w-48 h-48 md:h-auto relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-[#0B3C3C] text-lg">{product.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{product.rating}</span>
                            </div>
                            <span className="text-sm text-[#3A5A5A]">({product.reviews} reviews)</span>
                          </div>
                        </div>
                        <product.icon className="w-6 h-6 text-[#2EC4B6]" />
                      </div>
                      <p className="text-[#3A5A5A] mb-4">{product.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.tags.map((tag, i) => (
                          <span key={i} className="text-xs bg-[#E6F6F2] text-[#0B3C3C] px-3 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-[#0B3C3C]">{product.price}</p>
                          <p className="text-sm text-[#3A5A5A]">{product.priceUnit} • Min: {product.minOrder}</p>
                        </div>
                        <button
                          onClick={() => handleQuickInquiry(product.title)}
                          disabled={!product.inStock}
                          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                            product.inStock
                              ? 'bg-[#2EC4B6] hover:bg-[#25A99C] text-white'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Send className="w-4 h-4" />
                          Inquire Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-[#2EC4B6] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0B3C3C] mb-2">No Products Found</h3>
                <p className="text-[#3A5A5A] mb-4">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSortBy('featured');
                    setPriceRange({ min: 0, max: 100000 });
                    setInStockOnly(false);
                  }}
                  className="px-6 py-2 bg-[#2EC4B6] hover:bg-[#25A99C] text-white rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E6F6F2]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#3A5A5A] text-sm">
            © 2026 DejiOlanike Farm. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ProductsPage;