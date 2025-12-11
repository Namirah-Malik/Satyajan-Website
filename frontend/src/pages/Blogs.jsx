import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogPosts, blogCategories } from '../mock/blogData';

const Blogs = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className=\"bg-gradient-to-r from-blue-600 to-blue-700 text-white pt-32 pb-16\">
        <div className=\"container mx-auto px-4\">
          <div className=\"max-w-3xl mx-auto text-center\">
            <h1 className=\"text-4xl md:text-5xl font-bold mb-4\">
              Power Solutions Blog
            </h1>
            <p className=\"text-lg text-blue-100\">
              Expert insights on inverters, batteries, solar power, and energy solutions for Indian homes
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className=\"py-12\">
        <div className=\"container mx-auto px-4\">
          {/* Search Bar */}
          <div className=\"mb-8 max-w-2xl mx-auto\">
            <div className=\"relative\">
              <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5\" />
              <Input
                type=\"text\"
                placeholder=\"Search blogs by topic, keyword, or category...\"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=\"pl-10 h-12\"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className=\"mb-8\">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className=\"w-full\">
              <TabsList className=\"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 h-auto bg-transparent\">
                {blogCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className=\"data-[state=active]:bg-blue-600 data-[state=active]:text-white border-2 border-gray-200 data-[state=active]:border-blue-600\"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Results Info */}
          <div className=\"mb-6\">
            <p className=\"text-gray-600\">
              Showing {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Blog Grid */}
          {filteredBlogs.length > 0 ? (
            <div className=\"grid md:grid-cols-2 lg:grid-cols-3 gap-8\">
              {filteredBlogs.map((blog) => (
                <Card 
                  key={blog.id} 
                  className=\"group hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 overflow-hidden cursor-pointer\"
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                >
                  {/* Featured Image */}
                  <div className=\"relative h-56 overflow-hidden bg-gray-100\">
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className=\"w-full h-full object-cover group-hover:scale-110 transition-transform duration-500\"
                      loading=\"lazy\"
                    />
                    <Badge className=\"absolute top-3 left-3 bg-blue-600 text-white capitalize\">
                      {blogCategories.find(c => c.id === blog.category)?.name || blog.category}
                    </Badge>
                  </div>

                  <CardContent className=\"p-6\">
                    {/* Meta Info */}
                    <div className=\"flex items-center gap-4 text-sm text-gray-500 mb-3\">
                      <div className=\"flex items-center gap-1\">
                        <Calendar className=\"w-4 h-4\" />
                        <span>{formatDate(blog.publishedDate)}</span>
                      </div>
                      <div className=\"flex items-center gap-1\">
                        <Clock className=\"w-4 h-4\" />
                        <span>{blog.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className=\"text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors\">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className=\"text-gray-600 mb-4 line-clamp-3\">
                      {blog.excerpt}
                    </p>

                    {/* Read More Button */}
                    <Button
                      variant=\"ghost\"
                      className=\"text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold\"
                    >
                      Read More
                      <ArrowRight className=\"ml-2 w-4 h-4\" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className=\"text-center py-16\">
              <div className=\"text-gray-400 mb-4\">
                <Search className=\"w-16 h-16 mx-auto\" />
              </div>
              <h3 className=\"text-xl font-semibold text-gray-900 mb-2\">
                No blogs found
              </h3>
              <p className=\"text-gray-600\">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;
