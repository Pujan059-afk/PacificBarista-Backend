import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import PageTransition from '../components/common/PageTransition';
import { fadeIn, staggerContainer } from '../animations/index';

const faqCategories = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'General' },
  { id: 'courses', label: 'Courses' },
  { id: 'enrollment', label: 'Enrollment' },
  { id: 'certification', label: 'Certification' },
  { id: 'career', label: 'Career' },
];

const faqs = [
  {
    category: 'general',
    question: 'What is Pacific Barista Academy?',
    answer: 'Pacific Barista Academy is a premium barista training school based in Pokhara, Nepal. We offer comprehensive coffee education programs ranging from beginner foundation courses to master-level certifications, all taught by industry professionals.',
  },
  {
    category: 'general',
    question: 'Where are you located?',
    answer: 'We are located at Newroad-9, Pokhara, Nepal. Our facility features state-of-the-art training labs, cupping rooms, and dedicated practice stations.',
  },
  {
    category: 'general',
    question: 'Do I need any prior experience to join?',
    answer: 'Not at all! Our Foundation Barista Certificate is designed for absolute beginners. We also have advanced programs for experienced baristas looking to upskill.',
  },
  {
    category: 'general',
    question: 'What makes Pacific Barista different from other academies?',
    answer: 'We combine SCA-aligned curriculum with hands-on training from award-winning baristas. Our small class sizes ensure personalized attention, and our facilities feature professional-grade equipment from leading manufacturers.',
  },
  {
    category: 'courses',
    question: 'What courses do you offer?',
    answer: 'We offer Foundation Barista Certificate (2 weeks), Professional Barista Diploma (6 weeks), Master Barista Certification (12 weeks), and Specialty Coffee Q-Grader Prep (4 weeks). We also run specialized workshops throughout the year.',
  },
  {
    category: 'courses',
    question: 'Are your courses SCA certified?',
    answer: 'Yes, our curriculum is aligned with Specialty Coffee Association (SCA) standards. Graduates receive certificates that are recognized globally within the specialty coffee industry.',
  },
  {
    category: 'courses',
    question: 'What is the class size?',
    answer: 'We maintain small class sizes with a maximum of 8-12 students per session to ensure each student receives adequate individual attention and practice time.',
  },
  {
    category: 'courses',
    question: 'Do you offer online courses?',
    answer: 'Currently, all our certification programs are conducted in-person at our Pokhara facility to provide hands-on practical training. Some theory components are available through our online learning portal.',
  },
  {
    category: 'enrollment',
    question: 'How do I enroll in a course?',
    answer: 'You can enroll through our website by filling out the enrollment form on the Enroll page. Alternatively, you can visit us in person or call us to complete your registration.',
  },
  {
    category: 'enrollment',
    question: 'What is the payment process?',
    answer: 'We require a 50% deposit to secure your spot, with the remaining balance due before the course start date. We accept all major credit cards, bank transfers, and PayPal.',
  },
  {
    category: 'enrollment',
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 14 days before the course start date receive a full refund. Cancellations within 7-13 days receive a 50% refund. Cancellations within 7 days are non-refundable but can be rescheduled once.',
  },
  {
    category: 'enrollment',
    question: 'Do you offer payment plans?',
    answer: 'Yes, we offer flexible payment plans for our Professional Diploma and Master Certification programs. Please contact our admissions team for more details.',
  },
  {
    category: 'certification',
    question: 'What certification will I receive?',
    answer: 'Upon successful completion of your program, you will receive a Pacific Barista Academy certificate detailing your achieved level. Advanced certifications are aligned with SCA standards.',
  },
  {
    category: 'certification',
    question: 'Is the certification internationally recognized?',
    answer: 'Our certifications are recognized by leading coffee organizations and employers worldwide. Many of our graduates have secured positions at top cafes and roasteries globally.',
  },
  {
    category: 'certification',
    question: 'Do I need to take an exam?',
    answer: 'Yes, each certification program includes both practical and theoretical assessments. You must pass both components to receive your certification. We provide plenty of practice and preparation throughout the course.',
  },
  {
    category: 'career',
    question: 'What career support do you offer?',
    answer: 'We provide career counseling, resume workshops, interview preparation, and access to our employer network. Many top cafes and coffee companies actively recruit from our graduate pool.',
  },
  {
    category: 'career',
    question: 'What jobs can I get after certification?',
    answer: 'Our graduates have gone on to become head baristas, café managers, roastery operators, coffee trainers, quality control specialists, and café owners. The career paths are diverse and rewarding.',
  },
  {
    category: 'career',
    question: 'Do you help with job placement?',
    answer: 'While we cannot guarantee employment, we actively connect our graduates with our network of partner cafes, roasteries, and coffee companies. Our career services team provides ongoing support.',
  },
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = faqs.filter((faq) => {
    const matchCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchSearch = faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Frequently Asked Questions | Pacific Barista Academy</title>
        <meta name="description" content="Find answers to commonly asked questions about Pacific Barista Academy, our courses, enrollment, certifications, and career support." />
        <link rel="canonical" href="https://pacificbarista.com.np/faq" />
        <meta property="og:title" content="Frequently Asked Questions | Pacific Barista Academy" />
        <meta property="og:description" content="Find answers to commonly asked questions about Pacific Barista Academy." />
        <meta property="og:url" content="https://pacificbarista.com.np/faq" />
        <meta property="og:image" content="https://pacificbarista.com.np/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Frequently Asked Questions | Pacific Barista Academy" />
        <meta name="twitter:description" content="Find answers to commonly asked questions about Pacific Barista Academy." />
      </Helmet>

      <section className="relative bg-primary text-cream pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container-custom relative z-10">
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">FAQ</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Frequently Asked <span className="text-accent">Questions</span>
            </h1>
            <p className="font-body text-cream/80 text-lg md:text-xl leading-relaxed">
              Everything you need to know about Pacific Barista Academy.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom max-w-4xl">
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="mb-10">
            <div className="relative max-w-md mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30 w-5 h-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-primary/10 rounded-xl font-body text-sm outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,155,60,0.1)] transition-all duration-300"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeIn('up', 0.1)} initial="hidden" animate="show" className="flex flex-wrap justify-center gap-2 mb-12">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-accent text-white shadow-md'
                    : 'bg-white text-text/60 hover:text-accent border border-primary/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          <motion.div variants={staggerContainer(0.05)} initial="hidden" animate="show" className="space-y-3">
            {filtered.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeIn('up', i * 0.03)}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-primary/5"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-primary/[0.02] transition-colors duration-200"
                >
                  <span className="font-body font-medium text-primary pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <FiChevronDown className="w-5 h-5 text-accent" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="w-full h-px bg-primary/5 mb-4" />
                        <p className="font-body text-text/70 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="text-center py-16">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-accent" />
              </div>
              <p className="font-body text-text/60 text-lg">No questions found matching your search.</p>
            </motion.div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default FAQ;
