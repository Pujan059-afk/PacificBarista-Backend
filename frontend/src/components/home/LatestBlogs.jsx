import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../animations';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import api from '../../services/api';
import { IconArrowRight, IconCalendar, IconFlask, IconPalette, IconCoffee } from '../ui/Icons';

const blogGradients = [
  { gradient: 'from-amber-500 to-amber-700', Icon: IconFlask },
  { gradient: 'from-rose-500 to-rose-700', Icon: IconPalette },
  { gradient: 'from-emerald-500 to-emerald-700', Icon: IconCoffee },
];

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blogs?limit=3')
      .then((res) => setBlogs(res.data.blogs || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Our Blog"
          title="Latest from Our Blog"
          description="Stay updated with the latest coffee trends, tips, and stories from the Pacific Barista community."
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? null : (
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {blogs.map((blog, i) => {
              const style = blogGradients[i % blogGradients.length];
              const BlogIcon = style.Icon;
              const date = blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
              return (
                <motion.article
                  key={blog._id || i}
                  variants={fadeIn('up')}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <Link to={`/blog/${blog.slug}`} className="block">
                    {blog.image?.url ? (
                      <div className="relative h-36 overflow-hidden">
                        <img src={blog.image.url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                    ) : (
                      <div className={`relative h-36 bg-gradient-to-br ${style.gradient} flex items-center justify-center overflow-hidden`}>
                        <BlogIcon className="w-10 h-10 text-white/80" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                    )}
                  </Link>

                  <div className="px-4 pt-3 pb-3">
                    <div className="flex items-center gap-2 text-text/40 text-xs font-body mb-1.5">
                      <IconCalendar className="w-3 h-3" />
                      <span>{date}</span>
                    </div>

                    <Link to={`/blog/${blog.slug}`}>
                      <h3 className="font-heading text-base font-semibold text-primary mb-1 group-hover:text-accent transition-colors duration-300 leading-snug">
                        {blog.title}
                      </h3>
                    </Link>

                    <p className="font-body text-text/60 text-sm leading-relaxed mb-2 line-clamp-2">
                      {blog.excerpt}
                    </p>

                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-accent font-body text-sm font-semibold hover:gap-2 transition-all duration-300"
                    >
                      Read More
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        <motion.div
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/blog">
            <Button variant="outline" size="lg" icon={IconArrowRight} iconPosition="right">
              View All Posts
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestBlogs;
