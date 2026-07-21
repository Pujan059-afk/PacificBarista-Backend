import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { IconCoffee } from '../components/ui/Icons';

const levelVariant = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    setLoading(true);
    api.get(`/courses/${slug}`)
      .then((res) => setCourse(res.data))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Course not found</h1>
          <Link to="/courses" className="text-accent hover:underline font-body">Back to courses</Link>
        </div>
      </div>
    );
  }

  const currencySymbol = 'Rs.';

  return (
    <>
      <Helmet>
        <title>{course.title} | Pacific Barista Academy</title>
        <meta name="description" content={course.description.substring(0, 160)} />
        <link rel="canonical" href={`https://pacificbarista.com.np/courses/${course.slug}`} />
        <meta property="og:title" content={`${course.title} | Pacific Barista Academy`} />
        <meta property="og:description" content={course.description.substring(0, 160)} />
        <meta property="og:url" content={`https://pacificbarista.com.np/courses/${course.slug}`} />
        <meta property="og:image" content="https://pacificbarista.com.np/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${course.title} | Pacific Barista Academy`} />
        <meta name="twitter:description" content={course.description.substring(0, 160)} />
      </Helmet>

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-72 h-72 border border-accent/20 rounded-full" />
          <div className="absolute bottom-10 left-10 w-96 h-96 border border-accent/10 rounded-full" />
        </div>
        <div className="container-custom relative z-10">
          <div className="flex items-center gap-2 text-sm font-body text-cream/50 mb-6">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-accent transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-cream/80">{course.title}</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-6">
              {course.title}
            </h1>
            <span className="inline-block text-accent font-body font-semibold text-lg mb-4">
              {course.level}
            </span>
            <p className="font-body text-cream/60 text-lg leading-relaxed">
              {course.description.substring(0, 120)}...
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="flex items-center gap-3 text-cream/80">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-body text-sm">{course.duration}</span>
            </div>
            <Badge variant={levelVariant[course.level?.toLowerCase()]}>{course.level}</Badge>
            <div className="flex items-center gap-3 text-cream/80">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-body text-sm font-semibold text-white">{currencySymbol}. {course.price.toLocaleString()}/-</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-16">
              <div>
                <h2 className="font-heading text-3xl font-bold text-primary mb-6">About This Course</h2>
                <p className="font-body text-text/70 leading-relaxed text-lg">{course.description}</p>
              </div>

              <div>
                <h2 className="font-heading text-3xl font-bold text-primary mb-6">What You Will Learn</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(course.learningOutcomes || []).map((outcome, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-accent/5"
                    >
                      <svg className="w-5 h-5 text-accent mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-body text-text/70 text-sm">{outcome}</span>
                    </li>
                  ))}
                </ul>
                {course.learningOutcomes?.[0] && (
                  <div className="mt-6 p-5 bg-accent/10 rounded-xl border border-accent/20">
                    <p className="font-body text-accent font-semibold text-sm">Master these skills with {course.title}.</p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="font-heading text-3xl font-bold text-primary mb-6">Course Curriculum</h2>
                <div className="space-y-3">
                  {course.curriculum.map((week, index) => (
                    <div
                      key={index}
                      className="border border-primary/10 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(index)}
                        className="w-full flex items-center justify-between p-5 bg-white hover:bg-accent/5 transition-colors duration-300 text-left"
                      >
                        <span className="font-heading font-semibold text-primary">{week.title}</span>
                        <motion.svg
                          animate={{ rotate: openSections[index] ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-5 h-5 text-accent shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </button>
                      <AnimatePresence>
                        {openSections[index] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <ul className="px-5 pb-5 space-y-2">
                              {(week.items || []).map((lesson, i) => (
                                <li key={i} className="flex items-center gap-3 font-body text-sm text-text/60">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                                  {lesson}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-md border border-primary/5 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <div className="p-6">
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-6">
                    {course.image?.url ? (
                      <img
                        src={course.image.url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <IconCoffee className="w-20 h-20 text-cream/30" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="text-text/60">Duration</span>
                      <span className="text-primary font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="text-text/60">Level</span>
                      <Badge variant={levelVariant[course.level?.toLowerCase()]}>{course.level}</Badge>
                    </div>
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="text-text/60">Fee</span>
                      <span className="font-heading text-base font-bold text-accent">{currencySymbol}. {course.price.toLocaleString()}/-</span>
                    </div>
                  </div>

                  <Button variant="primary" size="lg" className="w-full" onClick={() => window.location.href = '/enroll'}>
                    Enroll Now
                  </Button>
                </div>
              </div>

              {course.certificateIncluded && (
                <div className="bg-accent/5 rounded-xl p-6 border border-accent/10">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <h4 className="font-heading font-bold text-primary">Certificate Included</h4>
                  </div>
                  <p className="font-body text-sm text-text/60">Receive a verified Pacific Barista certificate upon completion.</p>
                </div>
              )}

              {course.requirements.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-md border border-primary/5">
                  <h3 className="font-heading font-bold text-primary mb-4">Requirements</h3>
                  <ul className="space-y-3">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 font-body text-sm text-text/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseDetail;
