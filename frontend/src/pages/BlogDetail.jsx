import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Linkedin, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogPosts, blogCategories } from '../mock/blogData';
import { toast } from 'sonner';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    // Find the blog post
    const foundBlog = blogPosts.find((post) => post.slug === slug);
    if (foundBlog) {
      setBlog(foundBlog);
      
      // Find related blogs from same category
      const related = blogPosts
        .filter((post) => post.category === foundBlog.category && post.id !== foundBlog.id)
        .slice(0, 3);
      setRelatedBlogs(related);

      // Extract headings for table of contents
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = foundBlog.content;
      const headings = tempDiv.querySelectorAll('h2, h3');
      const toc = Array.from(headings).map((heading, index) => ({
        id: `heading-${index}`,
        text: heading.textContent,
        level: heading.tagName
      }));
      setTableOfContents(toc);
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }, [slug]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
          <Button onClick={() => navigate('/blogs')}>Back to Blogs</Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const text = blog.title;

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const categoryName = blogCategories.find(c => c.id === blog.category)?.name || blog.category;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/blogs')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Category Badge */}
              <Badge className="mb-4 bg-blue-600 text-white capitalize text-sm px-3 py-1">
                {categoryName}
              </Badge>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">By {blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.publishedDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime}</span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative h-96 rounded-xl overflow-hidden mb-8">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Social Share Buttons */}
              <Card className="mb-8">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Share this article:</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareOnSocial('whatsapp')}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareOnSocial('facebook')}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareOnSocial('linkedin')}
                        className="text-blue-700 hover:bg-blue-50"
                      >
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareOnSocial('email')}
                        className="text-gray-600 hover:bg-gray-50"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareOnSocial('copy')}
                        className="text-gray-600 hover:bg-gray-50"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Blog Content */}
              <div 
                className="prose prose-lg max-w-none blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <Separator className="my-8" />

              {/* CTA Section */}
              <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-3">
                    Looking for reliable power backup or solar solutions?
                  </h3>
                  <p className="text-blue-100 mb-6">
                    Explore our range of products or get in touch with our experts for personalized recommendations.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate('/products')}
                      className="bg-white text-blue-600 hover:bg-gray-100"
                    >
                      View Products
                    </Button>
                    <Button
                      onClick={() => navigate('/#contact')}
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-blue-700"
                    >
                      Contact Us
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <Card className="mb-6 sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
                    <ul className="space-y-2">
                      {tableOfContents.map((item, index) => (
                        <li key={index}>
                          <a
                            href={`#${item.id}`}
                            className={`text-sm hover:text-blue-600 transition-colors ${
                              item.level === 'H2' ? 'font-semibold text-gray-900' : 'text-gray-600 pl-4'
                            }`}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Card
                    key={relatedBlog.id}
                    className="group hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedBlog.featuredImage}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <Badge className="mb-2 bg-blue-600 text-white capitalize text-xs">
                        {blogCategories.find(c => c.id === relatedBlog.category)?.name}
                      </Badge>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedBlog.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .blog-content {
          color: #374151;
          line-height: 1.8;
        }
        .blog-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .blog-content p {
          margin-bottom: 1.25rem;
        }
        .blog-content .lead {
          font-size: 1.25rem;
          font-weight: 400;
          color: #4b5563;
          margin-bottom: 1.5rem;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.25rem;
        }
        .blog-content img {
          width: 100%;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        .blog-content table {
          margin: 1.5rem 0;
        }
        .blog-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        .blog-content a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
