'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogCategories, existingBlogs as blogPosts } from './blogdata';

// --- MOCK DATA (Replicated from Reference Website) ---

// --- MAIN COMPONENT ---

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
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
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Page Header (Blue Gradient) */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pt-20 pb-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Power Solutions Blog
            </h1>
            <p className="text-lg text-blue-100">
              Expert insights on inverters, batteries, solar power, and energy solutions for Indian homes
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Content */}
      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          
          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs by topic, keyword, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex justify-center min-w-max px-4">
              <div className="bg-gray-100/50 p-1 rounded-lg inline-flex gap-2">
                {blogCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 border-2 ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6 text-center lg:text-left">
            <p className="text-gray-600">
              Showing {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Blog Grid */}
          {filteredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <div 
                  key={blog.id} 
                  className="bg-white rounded-xl group hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 overflow-hidden flex flex-col"
                >
                  {/* Featured Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <Link href={`/blogs/${blog.slug}`}>
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded capitalize">
                      {blogCategories.find(c => c.id === blog.category)?.name || blog.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(blog.publishedDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={`/blogs/${blog.slug}`} className="block mb-3">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {blog.excerpt}
                    </p>

                    {/* Read More Button */}
                    <Link 
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mt-auto"
                    >
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-gray-400 mb-4 flex justify-center">
                <Search className="w-16 h-16" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No blogs found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter to find what you are looking for.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;