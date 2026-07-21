import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CourseCard from '../components/courses/CourseCard';
import CourseFilter from '../components/courses/CourseFilter';
import Loader from '../components/common/Loader';
import api from '../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeLevel, setActiveLevel] = useState('all');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pages = Math.ceil(total / 9);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (search) params.search = search;
    if (activeLevel !== 'all') params.level = activeLevel;
    api.get('/courses', { params })
      .then((res) => {
        setCourses(res.data.courses || []);
        setTotal(res.data.total || 0);
      })
      .catch(() => { setCourses([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [page, search, activeLevel]);

  return (
    <>
      <Helmet>
        <title>Our Courses | Pacific Barista Academy</title>
        <meta name="description" content="Explore our range of professional barista training courses — from espresso fundamentals to full certification." />
        <link rel="canonical" href="https://pacificbarista.com.np/courses" />
        <meta property="og:title" content="Our Courses | Pacific Barista Academy" />
        <meta property="og:description" content="Explore our professional barista training courses — from foundation to mastery." />
        <meta property="og:url" content="https://pacificbarista.com.np/courses" />
        <meta property="og:image" content="https://pacificbarista.com.np/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Courses | Pacific Barista Academy" />
        <meta name="twitter:description" content="Explore our professional barista training courses." />
      </Helmet>

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 border border-accent/20 rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 border border-accent/10 rounded-full" />
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center">
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">
              Start Your Journey
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-4">
              Our Courses
            </h1>
            <p className="font-body text-cream/60 text-lg max-w-2xl mx-auto">
              Roast Your Barista Skill — from foundation to mastery.
            </p>
          </div>
          <div className="mt-10 max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <p className="font-body text-cream/90 text-base leading-relaxed text-center">
              We provide complete international standard barista training package, Advance Latte Art. Including customer service standards, food safety measurements and health & safety measurements at work.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container-custom">
          <CourseFilter
            activeLevel={activeLevel}
            onFilterChange={(l) => { setActiveLevel(l); setPage(1); }}
            searchQuery={search}
            onSearchChange={(s) => { setSearch(s); setPage(1); }}
          />

          {loading ? (
            <Loader />
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-body text-text/60 text-lg">No courses found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg font-body font-medium text-sm transition-all duration-300 ${
                        page === p
                          ? 'bg-accent text-white shadow-md'
                          : 'bg-white border border-primary/10 text-text/60 hover:text-accent'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Courses;
