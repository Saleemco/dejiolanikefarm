import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { client } from './sanity';

// Simple password - change this!
const ADMIN_PASSWORD = 'farm2026';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  productType: string;
  featured: boolean;
  inStock: boolean;
}

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    unit: 'piece',
    productType: 'fingerlings',
    featured: false,
    inStock: true,
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load products when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      const data = await client.fetch(`*[_type == "product"] | order(_createdAt desc)`);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      setMessage('Failed to load products');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('Incorrect password');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const productData = {
        _type: 'product',
        title: formData.title,
        description: formData.description,
        slug: { _type: 'slug', current: slug },
        price: parseFloat(formData.price),
        unit: formData.unit,
        productType: formData.productType,
        featured: formData.featured,
        inStock: formData.inStock,
      };

      if (editingId) {
        await client.patch(editingId).set(productData).commit();
        setMessage('✅ Product updated successfully!');
      } else {
        await client.create(productData);
        setMessage('✅ Product added successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        unit: 'piece',
        productType: 'fingerlings',
        featured: false,
        inStock: true,
      });
      setEditingId(null);
      loadProducts();
    } catch (error: any) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      unit: product.unit,
      productType: product.productType,
      featured: product.featured,
      inStock: product.inStock,
    });
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await client.delete(id);
        setMessage('✅ Product deleted');
        loadProducts();
      } catch (error) {
        setMessage('❌ Error deleting product');
      }
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #F4FBF9, white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0B3C3C', marginBottom: '1.5rem' }}>
            Admin Login
          </h1>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E6F6F2',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
              placeholder="Enter password"
              autoFocus
            />
            
            {message && (
              <p style={{ color: 'red', marginBottom: '1rem' }}>{message}</p>
            )}
            {/* Add this test button */}
<div style={{ marginBottom: '1rem' }}>
  <button
    onClick={async () => {
      try {
        console.log('🧪 Testing Sanity connection...');
        const result = await client.fetch('*[_type == "product"][0]');
        alert('✅ Read successful! Product: ' + result?.title);
        
        const testDoc = await client.create({
          _type: 'product',
          title: 'Test ' + new Date().toLocaleTimeString(),
          description: 'Testing permissions',
          price: 100
        });
        alert('✅ Create successful! ID: ' + testDoc._id);
        
        await client.delete(testDoc._id);
        alert('✅ Delete successful! All permissions work!');
      } catch (error: any) {
        alert('❌ Error: ' + error.message);
        console.error(error);
      }
    }}
    style={{
      background: '#2EC4B6',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginRight: '10px'
    }}
  >
    🧪 Test Sanity Permissions
  </button>
</div>
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#2EC4B6',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          </form>
          
          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#2EC4B6' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div style={{ minHeight: '100vh', background: '#F4FBF9' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E6F6F2', padding: '1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0B3C3C' }}>Product Management</h1>
          <div>
            <Link to="/" style={{ color: '#2EC4B6', marginRight: '1rem' }}>View Site</Link>
            <button onClick={() => setIsAuthenticated(false)} style={{ color: 'red' }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Message */}
        {message && (
          <div style={{
            background: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}

        {/* Add/Edit Form */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0B3C3C', marginBottom: '1rem' }}>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Product Title *"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                style={{ padding: '0.75rem', border: '1px solid #E6F6F2', borderRadius: '8px' }}
                required
              />
              
              <input
                type="number"
                placeholder="Price (₦) *"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={{ padding: '0.75rem', border: '1px solid #E6F6F2', borderRadius: '8px' }}
                required
              />
            </div>
            
            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #E6F6F2', borderRadius: '8px', marginBottom: '1rem' }}
              rows={3}
              required
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                style={{ padding: '0.75rem', border: '1px solid #E6F6F2', borderRadius: '8px' }}
              >
                <option value="piece">Per Piece</option>
                <option value="kg">Per Kg</option>
                <option value="set">Per Set</option>
              </select>
              
              <select
                value={formData.productType}
                onChange={(e) => setFormData({...formData, productType: e.target.value})}
                style={{ padding: '0.75rem', border: '1px solid #E6F6F2', borderRadius: '8px' }}
              >
                <option value="fingerlings">Fingerlings</option>
                <option value="table-size">Table-Size Fish</option>
                <option value="supplies">Supplies</option>
                <option value="bundles">Bundles</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                /> Featured
              </label>
              
              <label>
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                /> In Stock
              </label>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#2EC4B6',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {loading ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      title: '',
                      description: '',
                      price: '',
                      unit: 'piece',
                      productType: 'fingerlings',
                      featured: false,
                      inStock: true,
                    });
                  }}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products List */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0B3C3C', marginBottom: '1rem' }}>
            Current Products ({products.length})
          </h2>
          
          {products.length === 0 ? (
            <p style={{ color: '#6c757d', textAlign: 'center' }}>No products yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {products.map((product) => (
                <div key={product._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #E6F6F2',
                  borderRadius: '8px'
                }}>
                  <div>
                    <strong>{product.title}</strong>
                    <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.25rem' }}>
                      ₦{product.price} / {product.unit} • {product.productType}
                      {product.featured && ' ⭐ Featured'}
                      {!product.inStock && ' 🔴 Out of Stock'}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginRight: '0.5rem' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;