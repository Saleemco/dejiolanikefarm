import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Fish, Droplets, Send, ArrowLeft, Search, Filter, 
  ChevronDown, Grid3X3, List, Star, Package, TrendingUp, Award
} from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { useProducts } from './hooks/useProducts';
import { urlFor } from './sanity';

// Categories for filtering (static)
const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: Grid3X3 },
  { id: 'fingerlings', name: 'Fingerlings & Juveniles', icon: Fish },
  { id: 'table-size', name: 'Table-Size Fish', icon: Fish },
  { id: 'supplies', name: 'Farming Supplies', icon: Package },
  { id: 'bundles', name: 'Value Bundles', icon: Package },
  { id: 'specials', name: 'Special Offers', icon: TrendingUp }
];

function ProductsPage() {
  // Fetch all products from Sanity (no limit)
  const { products: sanityProducts, loading, error } = useProducts(100);
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter products based on category, search, and other filters
  useEffect(() => {
    if (!sanityProducts || sanityProducts.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...sanityProducts];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.productType === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(p => {
      const priceNum = p.price || 0;
      return priceNum >= priceRange.min && priceNum <= priceRange.max;
    });

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        // Since we don't have ratings in Sanity yet, sort by title
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'newest':
        // Sort by ID or creation date - using title as fallback
        filtered.sort((a, b) => (b._id || '').localeCompare(a._id || ''));
        break;
      default:
        // 'featured' - sort by featured flag then order
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (a.order || 999) - (b.order || 999);
        });
        break;
    }

    setFilteredProducts(filtered);
  }, [sanityProducts, selectedCategory, searchQuery, sortBy, priceRange, inStockOnly]);

  const handleQuickInquiry = (productTitle: string) => {
    const message = `I'm interested in your *${productTitle}*. Please provide more information.`;
    const whatsappUrl = `https://wa.me/2348012345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = `https://placehold.co/600x400/2EC4B6/white?text=Product+Image`;
  };

  // Safe image URL function
  const getImageUrl = (product: any) => {
    try {
      if (product.mainImage) {
        return urlFor(product.mainImage).width(400).height(300).url();
      }
      return null;
    } catch (e) {
      console.warn('Failed to get image URL for product:', product.title, e);
      return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background theme-transition flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background theme-transition flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Error Loading Products</h2>
          <p className="text-muted-foreground mb-4">Please try refreshing the page.</p>
          <Link 
            to="/" 
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background theme-transition">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <h1 className="font-heading text-2xl font-bold text-foreground">Our Products</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
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
            <div className="bg-card rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-semibold text-foreground">Filters</h2>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-primary"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              
              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categories */}
                <div>
                  <h3 className="font-medium text-foreground mb-3">Categories</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-secondary'
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
                  <h3 className="font-medium text-foreground mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
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
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">Show in stock only</span>
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
                  className="w-full px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="bg-card rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {sanityProducts?.length || 0} products
            </div>

            {/* Products Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {(() => {
                        const imageUrl = getImageUrl(product);
                        if (imageUrl) {
                          return (
                            <img
                              src={imageUrl}
                              alt={product.mainImage?.alt || product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={handleImageError}
                            />
                          );
                        } else {
                          return (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                              <Fish className="w-16 h-16 text-primary-foreground opacity-50" />
                            </div>
                          );
                        }
                      })()}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                          <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-950 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-heading font-semibold text-foreground">{product.title}</h3>
                        <Fish className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                      {product.productType && (
                        <div className="mb-3">
                          <span className="text-xs bg-secondary text-foreground px-2 py-1 rounded-full">
                            {product.productType}
                          </span>
                        </div>
                      )}
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-lg font-bold text-foreground">₦{product.price?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{product.unit || 'per unit'}</p>
                        </div>
                        <button
                          onClick={() => handleQuickInquiry(product.title)}
                          disabled={!product.inStock}
                          className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                            product.inStock
                              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
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
                    key={product._id}
                    className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
                  >
                    <div className="md:w-48 h-48 md:h-auto relative">
                      {(() => {
                        const imageUrl = getImageUrl(product);
                        if (imageUrl) {
                          return (
                            <img
                              src={imageUrl}
                              alt={product.mainImage?.alt || product.title}
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                            />
                          );
                        } else {
                          return (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                              <Fish className="w-16 h-16 text-primary-foreground opacity-50" />
                            </div>
                          );
                        }
                      })()}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                          <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-heading font-semibold text-foreground text-lg">{product.title}</h3>
                          {product.featured && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-xs font-medium text-foreground">Featured</span>
                            </div>
                          )}
                        </div>
                        <Fish className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-muted-foreground mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-foreground">₦{product.price?.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{product.unit || 'per unit'}</p>
                        </div>
                        <button
                          onClick={() => handleQuickInquiry(product.title)}
                          disabled={!product.inStock}
                          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                            product.inStock
                              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
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
            {filteredProducts.length === 0 && !loading && (
              <div className="bg-card rounded-xl shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No Products Found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSortBy('featured');
                    setPriceRange({ min: 0, max: 100000 });
                    setInStockOnly(false);
                  }}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © 2026 DejiOlanike Farm. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ProductsPage;