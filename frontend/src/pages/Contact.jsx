import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageTransition from '../components/common/PageTransition';
import { useApp } from '../contexts/AppContext';
import api from '../services/api';
import { fadeIn, staggerContainer } from '../animations/index';

const contactInfo = [
  { icon: FiMapPin, title: 'Our Address', details: ['Newroad-9, Pokhara', 'Pokhara, Nepal'] },
  { icon: FiPhone, title: 'Phone Number', details: ['061-591328', '984-6944202'] },
  { icon: FiMail, title: 'Email Address', details: ['pbap2021@gmail.com'] },
  { icon: FiClock, title: 'Working Hours', details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM', 'Sunday: Closed'] },
];

const Contact = () => {
  const { showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/contact', data);
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      reset();
    } catch (err) {
      showToast(err?.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Contact Us | Pacific Barista Academy</title>
        <meta name="description" content="Get in touch with Pacific Barista Academy. Visit us, call, or send a message. We'd love to hear from you." />
        <link rel="canonical" href="https://www.pacificbarista.com/contact" />
        <meta property="og:title" content="Contact Us | Pacific Barista Academy" />
        <meta property="og:description" content="Get in touch with Pacific Barista Academy. Visit us in Pokhara, Nepal." />
        <meta property="og:url" content="https://www.pacificbarista.com/contact" />
        <meta property="og:image" content="https://www.pacificbarista.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Pacific Barista Academy" />
        <meta name="twitter:description" content="Get in touch with Pacific Barista Academy. Visit us in Pokhara, Nepal." />
      </Helmet>

      <section className="relative bg-primary text-cream pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container-custom relative z-10">
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">Contact</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Get In <span className="text-accent">Touch</span>
            </h1>
            <p className="font-body text-cream/80 text-lg md:text-xl leading-relaxed">
              Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {contactInfo.map((info, i) => (
                <motion.div key={i} variants={fadeIn('up', i * 0.1)} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-primary mb-2">{info.title}</h3>
                      {info.details.map((d, j) => (
                        <p key={j} className="font-body text-text/70 text-sm">{d}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeIn('up', 0.3)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="font-heading text-2xl font-bold text-primary mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      error={errors.name?.message}
                      {...register('name', { required: 'Name is required' })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      error={errors.email?.message}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                      })}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+61 4XX XXX XXX"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                    <Input
                      label="Subject"
                      placeholder="How can we help?"
                      error={errors.subject?.message}
                      {...register('subject', { required: 'Subject is required' })}
                    />
                  </div>
                  <Input
                    label="Message"
                    variant="textarea"
                    placeholder="Tell us more about your inquiry..."
                    error={errors.message?.message}
                    {...register('message', { required: 'Message is required' })}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={loading}
                    icon={FiSend}
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="h-96 bg-primary/5 relative overflow-hidden">
        <iframe
          title="Pacific Barista Academy Location"
          src="https://www.google.com/maps?q=Newroad-9+Pokhara+Nepal&output=embed"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </PageTransition>
  );
};

export default Contact;
