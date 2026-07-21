import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiUser, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/common/PageTransition';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { fadeIn, staggerContainer } from '../animations/index';

const ITEMS_PER_PAGE = 4;

const gradients = [
  'from-amber-600 to-orange-400',
  'from-emerald-600 to-teal-400',
  'from-rose-500 to-pink-400',
  'from-blue-600 to-cyan-400',
  'from-violet-600 to-purple-400',
  'from-indigo-600 to-blue-400',
  'from-orange-600 to-red-400',
  'from-green-600 to-lime-400',
];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = { page: currentPage, limit: ITEMS_PER_PAGE };
    if (search) params.search = search;
    if (activeCategory !== 'All') params.category = activeCategory;
    api.get('/blogs', { params })
      .then((res) => {
        setPosts(res.data.blogs || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 0);
      })
      .catch(() => { setPosts([]); setTotal(0); setPages(0); })
      .finally(() => setLoading(false));
  }, [currentPage, search, activeCategory]);

  const categories = ['All', ...new Set(posts.map((p) => p.category).filter(Boolean))];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Our Blog | Pacific Barista Academy</title>
        <meta name="description" content="Explore the Pacific Barista Academy blog for coffee tips, training guides, industry insights, and barista stories." />
        <link rel="canonical" href="https://www.pacificbarista.com/blog" />
        <meta property="og:title" content="Our Blog | Pacific Barista Academy" />
        <meta property="og:description" content="Explore the Pacific Barista Academy blog for coffee tips and training guides." />
        <meta property="og:url" content="https://www.pacificbarista.com/blog" />
        <meta property="og:image" content="https://www.pacificbarista.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Blog | Pacific Barista Academy" />
        <meta name="twitter:description" content="Explore the Pacific Barista Academy blog for coffee tips and training guides." />
      </Helmet>

      <section className="relative bg-primary text-cream pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container-custom relative z-10">
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">Blog</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Our <span className="text-accent">Blog</span>
            </h1>
            <p className="font-body text-cream/80 text-lg md:text-xl leading-relaxed">
              Insights, guides, and stories from the Pacific Barista community.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                  className={`px-5 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-white text-text/60 hover:text-accent border border-primary/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text/30 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-primary/10 rounded-lg font-body text-sm outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,155,60,0.1)] transition-all duration-300"
              />
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : posts.length === 0 ? (
            <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="text-center py-16">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-accent" />
              </div>
              <p className="font-body text-text/60 text-lg">No articles found matching your criteria.</p>
            </motion.div>
          ) : (
            <>
              <motion.div
                key={activeCategory + search + currentPage}
                variants={staggerContainer(0.1)}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 gap-4"
              >
                {posts.map((post, i) => (
                  <motion.div
                    key={post._id || i}
                    variants={fadeIn('up', i * 0.1)}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group"
                  >
                    <Link to={`/blog/${post.slug}`}>
                      {post.image?.url ? (
                        <div className="h-40 overflow-hidden relative">
                          <img src={post.image.url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                        </div>
                      ) : (
                        <div className={`h-40 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center relative`}>
                          <span className="text-lg font-heading font-bold text-white/30 uppercase tracking-widest">{post.category}</span>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                        </div>
                      )}
                    </Link>
                    <div className="px-4 pt-3 pb-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant="accent" className="text-xs">{post.category}</Badge>
                        <span className="flex items-center gap-1 text-xs text-text/50 font-body">
                          <FiCalendar className="w-3 h-3" />
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            : new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <h3 className="font-heading text-base font-bold text-primary mb-1 group-hover:text-accent transition-colors duration-300">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="font-body text-text/70 text-sm leading-relaxed mb-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-primary/5">
                        <span className="flex items-center gap-1 text-xs text-text/50 font-body">
                          <FiUser className="w-3 h-3" />
                          {post.author}
                        </span>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="flex items-center gap-1 text-accent font-body text-sm font-medium hover:gap-2 transition-all duration-300"
                        >
                          Read More <FiArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-primary/10 text-text/60 hover:text-accent hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-body font-medium text-sm transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-accent text-white shadow-md'
                          : 'bg-white border border-primary/10 text-text/60 hover:text-accent'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pages}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-primary/10 text-text/60 hover:text-accent hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Blog;
