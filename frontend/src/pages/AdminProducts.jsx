import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, Save, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { productCategories } from '../mock/productData';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'inverter',
    image: '',
    images: '',
    description: '',
    features: '',
    offerPrice: '',
    mrp: '',
    specifications: '',
    warranty: '',
    inStock: true,
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      image: product.image,
      images: product.images.join('\n'),
      description: product.description,
      features: product.features.join('\n'),
      offerPrice: product.offerPrice.toString(),
      mrp: product.mrp.toString(),
      specifications: JSON.stringify(product.specifications, null, 2),
      warranty: product.warranty,
      inStock: product.inStock,
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      alert('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Parse and validate data
      const productData = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        image: formData.image,
        images: formData.images.split('\n').filter((img) => img.trim()),
        description: formData.description,
        features: formData.features.split('\n').filter((f) => f.trim()),
        offerPrice: parseFloat(formData.offerPrice),
        mrp: parseFloat(formData.mrp),
        specifications: JSON.parse(formData.specifications),
        warranty: formData.warranty,
        inStock: formData.inStock,
      };

      const url = editingProduct
        ? `${API_URL}/api/products/${editingProduct.id}`
        : `${API_URL}/api/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to save product');

      alert(`Product ${editingProduct ? 'updated' : 'created'} successfully!`);
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: 'inverter',
      image: '',
      images: '',
      description: '',
      features: '',
      offerPrice: '',
      mrp: '',
      specifications: '',
      warranty: '',
      inStock: true,
    });
    setEditingProduct(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Management</h1>
              <p className="text-gray-600">Add, edit, or remove products from your catalog</p>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add New Product
              </Button>
            )}
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <Card className="mb-8 border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Solar Inverter 3KW"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                      <Input
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., SJES-INV-3K"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                        required
                      >
                        {productCategories
                          .filter((cat) => cat.id !== 'all')
                          .map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Image URL *
                      </label>
                      <Input
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        required
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer Price *
                      </label>
                      <Input
                        name="offerPrice"
                        type="number"
                        value={formData.offerPrice}
                        onChange={handleInputChange}
                        required
                        placeholder="4999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">MRP *</label>
                      <Input
                        name="mrp"
                        type="number"
                        value={formData.mrp}
                        onChange={handleInputChange}
                        required
                        placeholder="6999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Warranty *
                      </label>
                      <Input
                        name="warranty"
                        value={formData.warranty}
                        onChange={handleInputChange}
                        required
                        placeholder="2 Years Manufacturer Warranty"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">In Stock</label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Product description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Images (one per line)
                    </label>
                    <textarea
                      name="images"
                      value={formData.images}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="https://...&#10;https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features (one per line) *
                    </label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specifications (JSON format) *
                    </label>
                    <textarea
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                      placeholder='{"Capacity": "3KW", "Voltage": "220V"}'
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Save className="w-5 h-5 mr-2" />
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-semibold">Error: {error}</p>
            </div>
          )}

          {/* Products List */}
          {!loading && !error && (
            <div className="grid gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">SKU: {product.sku}</p>
                            <div className="flex gap-2 mb-2">
                              <Badge variant="outline">{product.category}</Badge>
                              <Badge variant={product.inStock ? 'default' : 'destructive'}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                        <div className="flex gap-4">
                          <div>
                            <span className="text-2xl font-bold text-green-600">
                              ₹{product.offerPrice.toLocaleString()}
                            </span>
                            <span className="text-gray-400 line-through ml-2">
                              ₹{product.mrp.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminProducts;
