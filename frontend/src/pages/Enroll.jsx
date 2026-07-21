import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiSend, FiCheck } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageTransition from '../components/common/PageTransition';
import { useApp } from '../contexts/AppContext';
import api from '../services/api';
import { fadeIn } from '../animations/index';

const experienceLevels = [
  { value: 'none', label: 'No Experience' },
  { value: 'beginner', label: 'Beginner (0-6 months)' },
  { value: 'intermediate', label: 'Intermediate (6-24 months)' },
  { value: 'advanced', label: 'Advanced (2+ years)' },
  { value: 'professional', label: 'Professional (5+ years)' },
];

const Enroll = () => {
  const { showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [courses, setCourses] = useState([]);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses?limit=50');
        const list = res.data?.courses || res.data || [];
        setCourses(
          list.map((c) => ({
            value: c.slug,
            label: c.title,
          }))
        );
      } catch {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const selectedCourse = watch('course');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/enrollments', data);
      setSubmitted(true);
      showToast('Enrollment submitted successfully! We\'ll contact you within 24 hours.', 'success');
    } catch (err) {
      showToast(err?.message || 'Failed to submit enrollment. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PageTransition>
        <Helmet>
          <title>Enrollment Submitted | Pacific Barista Academy</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary pt-20">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            animate="show"
            className="text-center max-w-lg mx-auto px-4"
          >
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-10 h-10 text-accent" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-cream mb-4">Enrollment Submitted!</h1>
            <p className="font-body text-cream/70 text-lg mb-8">
              Thank you for choosing Pacific Barista Academy. Our admissions team will review your application and contact you within 24 hours with the next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={() => window.location.href = '/'}>Return Home</Button>
              <Button variant="outline" onClick={() => { setSubmitted(false); }}>Submit Another</Button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Enroll Now | Pacific Barista Academy</title>
        <meta name="description" content="Enroll in Pacific Barista Academy's professional barista training programs. Start your coffee career journey today." />
        <link rel="canonical" href="https://pacificbarista.com.np/enroll" />
        <meta property="og:title" content="Enroll Now | Pacific Barista Academy" />
        <meta property="og:description" content="Enroll in Pacific Barista Academy's professional barista training programs. Start your coffee career journey today." />
        <meta property="og:url" content="https://pacificbarista.com.np/enroll" />
        <meta property="og:image" content="https://pacificbarista.com.np/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Enroll Now | Pacific Barista Academy" />
        <meta name="twitter:description" content="Enroll in Pacific Barista Academy's professional barista training programs." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative z-10 pt-32 pb-20">
          <div className="container-custom">
            <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">Enrollment</span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight mb-6">
                Start Your <span className="text-accent">Journey</span>
              </h1>
              <p className="font-body text-cream/80 text-lg md:text-xl leading-relaxed">
                Take the first step towards becoming a professional barista. Fill out the form below and our team will guide you through the enrollment process.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn('up', 0.2)}
              initial="hidden"
              animate="show"
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      error={errors.fullName?.message}
                      {...register('fullName', { required: 'Full name is required' })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      error={errors.email?.message}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                      })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="984-6944202"
                      error={errors.phone?.message}
                      {...register('phone', { required: 'Phone number is required' })}
                    />
                    <Input
                      label="Address"
                      placeholder="Newroad, Pokhara, Nepal"
                      error={errors.address?.message}
                      {...register('address', { required: 'Address is required' })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Course"
                      variant="select"
                      options={courses}
                      error={errors.course?.message}
                      {...register('course', { required: 'Please select a course' })}
                    />
                    <Input
                      label="Experience Level"
                      variant="select"
                      options={experienceLevels}
                      error={errors.experience?.message}
                      {...register('experience', { required: 'Please select your experience level' })}
                    />
                  </div>

                  <Input
                    label="Education Background"
                    placeholder="e.g. High School Diploma, Bachelor's in Hospitality..."
                    error={errors.education?.message}
                    {...register('education', { required: 'Education background is required' })}
                  />

                  <Input
                    label="Additional Message"
                    variant="textarea"
                    placeholder="Tell us about yourself, your goals, or any questions..."
                    error={errors.message?.message}
                    {...register('message')}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={loading}
                    icon={FiSend}
                  >
                    Submit Enrollment
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Enroll;
