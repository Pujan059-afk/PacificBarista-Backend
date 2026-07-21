import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowLeft, FiLinkedin, FiTwitter, FiFacebook, FiClock } from 'react-icons/fi';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/common/PageTransition';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { fadeIn } from '../animations/index';
import { formatContent } from '../utils/helpers';

const isHtml = (text) => /<[a-z][\s\S]*>/i.test(text);

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

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/blogs/${slug}`)
      .then((res) => setPost(res.data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    api.get('/blogs?limit=3')
      .then((res) => setRelated((res.data.blogs || []).filter((b) => b.slug !== slug).slice(0, 3)))
      .catch(() => setRelated([]));
  }, [slug]);

  if (loading) return <Loader />;

  if (!post) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
          <div className="text-center">
            <h1 className="font-heading text-6xl text-primary font-bold">404</h1>
            <p className="font-body text-text/60 mt-2">Post not found</p>
            <Link to="/blog" className="inline-block mt-4 text-accent hover:underline font-body">Back to Blog</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const gradient = gradients[Math.abs(post.slug?.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % gradients.length];

  return (
    <PageTransition>
      <Helmet>
        <title>{post.title} | Pacific Barista Academy</title>
        <meta name="description" content={post.excerpt?.slice(0, 160) || ''} />
        <link rel="canonical" href={`https://www.pacificbarista.com/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.title} | Pacific Barista Academy`} />
        <meta property="og:description" content={post.excerpt?.slice(0, 160) || ''} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.pacificbarista.com/blog/${post.slug}`} />
        <meta property="og:image" content={post.image?.url || 'https://www.pacificbarista.com/og-image.jpg'} />
        <meta property="article:published_time" content={post.publishedAt || post.createdAt} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | Pacific Barista Academy`} />
        <meta name="twitter:description" content={post.excerpt?.slice(0, 160) || ''} />
        <meta name="twitter:image" content={post.image?.url || 'https://www.pacificbarista.com/og-image.jpg'} />
      </Helmet>

      <section className="relative bg-primary text-cream pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container-custom relative z-10">
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show">
            <Link to="/blog" className="inline-flex items-center gap-2 text-cream/70 hover:text-accent font-body text-sm mb-6 transition-colors">
              <FiArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <div className="max-w-4xl">
              <Badge variant="accent" className="mb-4">{post.category}</Badge>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-cream/70 font-body text-sm">
                <span className="flex items-center gap-1"><FiUser className="w-4 h-4" />{post.author}</span>
                <span className="flex items-center gap-1"><FiCalendar className="w-4 h-4" />{publishedDate}</span>
                <span className="flex items-center gap-1"><FiClock className="w-4 h-4" />{Math.ceil((post.content?.split(' ').length || 0) / 200)} min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-cream">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {post.image?.url && (
              <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="w-full rounded-2xl overflow-hidden mb-10 shadow-lg">
                <img src={post.image.url} alt={post.title} className="w-full max-h-[500px] object-cover" />
              </motion.div>
            )}

            <motion.article
              variants={fadeIn('up', 0.1)}
              initial="hidden"
              animate="show"
              className="prose prose-lg max-w-none font-body text-text/80 text-justify leading-relaxed"
              dangerouslySetInnerHTML={{ __html: isHtml(post.content) ? post.content : formatContent(post.content) }}
            />

            <motion.div variants={fadeIn('up', 0.2)} initial="hidden" animate="show" className="mt-10 pt-8 border-t border-primary/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="font-body text-sm text-text/60">Share this article:</span>
                <div className="flex gap-2">
                  <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:bg-accent hover:text-white transition-all duration-300">
                    <FiFacebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:bg-accent hover:text-white transition-all duration-300">
                    <FiTwitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:bg-accent hover:text-white transition-all duration-300">
                    <FiLinkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((rp, i) => {
                  const rg = gradients[Math.abs(rp.slug?.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % gradients.length];
                  return (
                    <motion.div key={rp._id || i} variants={fadeIn('up', i * 0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}>
                      <Link to={`/blog/${rp.slug}`} className="group block">
                        {rp.image?.url ? (
                          <div className="h-32 rounded-xl overflow-hidden mb-3">
                            <img src={rp.image.url} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        ) : (
                          <div className={`h-32 bg-gradient-to-br ${rg} rounded-xl flex items-center justify-center mb-3`}>
                            <span className="font-heading text-lg font-bold text-white/20 uppercase tracking-widest">Article</span>
                          </div>
                        )}
                        <h3 className="font-heading text-base font-bold text-primary group-hover:text-accent transition-colors duration-300">{rp.title}</h3>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
};

export default BlogPost;
