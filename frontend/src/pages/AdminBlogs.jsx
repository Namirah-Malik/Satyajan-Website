import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, ArrowLeft, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogPosts, blogCategories } from '../mock/blogData';
import { toast } from 'sonner';

const AdminBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(blogPosts);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'inverters',
    excerpt: '',
    featuredImage: '',
    content: '',
    author: 'Satyajan Energy Solutions',
    readTime: '5 min read',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleCreateBlog = () => {
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    const newBlog = {
      id: `blog-${Date.now()}`,
      ...formData,
      publishedDate: new Date().toISOString().split('T')[0],
      images: []
    };

    setBlogs([newBlog, ...blogs]);
    toast.success('Blog created successfully!');
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleUpdateBlog = () => {
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setBlogs(blogs.map(blog => 
      blog.id === editingBlog.id ? { ...blog, ...formData } : blog
    ));
    toast.success('Blog updated successfully!');
    setEditingBlog(null);
    resetForm();
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setBlogs(blogs.filter(blog => blog.id !== id));
      toast.success('Blog deleted successfully!');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage,
      content: blog.content,
      author: blog.author,
      readTime: blog.readTime,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      metaKeywords: blog.metaKeywords
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: 'inverters',
      excerpt: '',
      featuredImage: '',
      content: '',
      author: 'Satyajan Energy Solutions',
      readTime: '5 min read',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
              <p className="text-gray-600">Create, edit, and manage your blog posts</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/blogs')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Blog
              </Button>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Blog
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gray-900">{blogs.length}</div>
                <div className="text-sm text-gray-600 mt-1">Total Blogs</div>
              </CardContent>
            </Card>
            {blogCategories.slice(1).map((category) => {
              const count = blogs.filter(b => b.category === category.id).length;
              return (
                <Card key={category.id}>
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600 mt-1">{category.name}</div>
                  </CardContent>
                </Card>
              );
            }).slice(0, 3)}
          </div>

          {/* Blog List */}
          <Card>
            <CardHeader>
              <CardTitle>All Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all"
                  >
                    {/* Featured Image */}
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    {/* Blog Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-600 text-white capitalize text-xs">
                          {blogCategories.find(c => c.id === blog.category)?.name}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(blog.publishedDate)}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{blog.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{blog.excerpt}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/blog/${blog.slug}`)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(blog)}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || editingBlog !== null} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setEditingBlog(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingBlog ? 'update' : 'create'} your blog post.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter blog title"
              />
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="blog-url-slug"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from title</p>
            </div>

            {/* Category and Read Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blogCategories.slice(1).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) => handleInputChange('readTime', e.target.value)}
                  placeholder="5 min read"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <Label htmlFor="featuredImage">Featured Image URL *</Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage}
                onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Short description (2-3 lines)"
                rows={3}
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Content (HTML) *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Blog content in HTML format"
                rows={10}
              />
              <p className="text-xs text-gray-500 mt-1">You can use HTML tags for formatting</p>
            </div>

            {/* SEO Meta Tags */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-4">SEO Meta Tags</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    placeholder="SEO title for search engines"
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    placeholder="SEO description for search engines"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingBlog(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingBlog ? handleUpdateBlog : handleCreateBlog}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingBlog ? 'Update' : 'Create'} Blog
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminBlogs;
