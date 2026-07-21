import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiAward, FiBriefcase, FiGlobe, FiTrendingUp, FiUsers, FiStar, FiCheck, FiClock } from 'react-icons/fi';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/common/PageTransition';
import { fadeIn, staggerContainer } from '../animations/index';

const certifications = [
  {
    title: 'Foundation Barista Certificate',
    level: 'Beginner',
    duration: '2 Weeks',
    description: 'Master the essentials of espresso extraction, milk steaming, and basic latte art. Perfect for aspiring baristas with no prior experience.',
    highlights: ['Espresso fundamentals', 'Milk texturing basics', 'Simple latte art', 'Machine maintenance'],
    price: 'Rs. 29,999',
  },
  {
    title: 'Professional Barista Diploma',
    level: 'Intermediate',
    duration: '6 Weeks',
    description: 'Advanced techniques in specialty coffee preparation, flavor profiling, and workflow optimization for high-volume service.',
    highlights: ['Advanced extraction', 'Pour-over mastery', 'Flavor profiling', 'Service workflows'],
    price: 'Rs. 79,999',
  },
  {
    title: 'Master Barista Certification',
    level: 'Advanced',
    duration: '12 Weeks',
    description: 'Elite-level training covering competition-grade latte art, coffee chemistry, roastery operations, and trainer methodologies.',
    highlights: ['Competition art', 'Coffee chemistry', 'Roasting principles', 'Trainer certification'],
    price: 'Rs. 1,49,999',
  },
  {
    title: 'Specialty Coffee Q-Grader Prep',
    level: 'Advanced',
    duration: '4 Weeks',
    description: 'Intensive preparation for the Q-Grader certification exam, focusing on sensory skills and cupping protocols.',
    highlights: ['Sensory training', 'Cupping protocols', 'Green grading', 'Defect identification'],
    price: 'Rs. 89,999',
  },
];

const benefits = [
  { icon: FiAward, title: 'Industry Recognized', description: 'Our certifications are acknowledged by leading coffee associations worldwide.' },
  { icon: FiBriefcase, title: 'Career Boost', description: 'Graduates see a 60% increase in job opportunities and salary potential.' },
  { icon: FiGlobe, title: 'Global Standards', description: 'Curriculum aligned with Specialty Coffee Association (SCA) standards.' },
  { icon: FiTrendingUp, title: 'Skill Progression', description: 'Structured pathway from beginner to master level expertise.' },
  { icon: FiUsers, title: 'Expert Mentors', description: 'Learn from certified professionals with years of industry experience.' },
  { icon: FiStar, title: 'Lifetime Access', description: 'Get ongoing updates and refresher materials even after certification.' },
];

const careerRoles = [
  'Head Barista', 'Coffee Shop Manager', 'Roastery Operator', 'Coffee Trainer',
  'Quality Control Specialist', 'Menu Developer', 'Brewing Consultant', 'Café Owner',
];

const Certifications = () => (
  <PageTransition>
    <Helmet>
      <title>Professional Certifications | Pacific Barista Academy</title>
      <meta name="description" content="Earn industry-recognized barista certifications at Pacific Barista Academy. From foundation to master level, start your coffee career journey." />
      <link rel="canonical" href="https://pacificbarista.com.np/certifications" />
      <meta property="og:title" content="Professional Certifications | Pacific Barista Academy" />
      <meta property="og:description" content="Earn industry-recognized barista certifications. Start your coffee career journey today." />
      <meta property="og:url" content="https://pacificbarista.com.np/certifications" />
      <meta property="og:image" content="https://pacificbarista.com.np/og-image.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Professional Certifications | Pacific Barista Academy" />
      <meta name="twitter:description" content="Earn industry-recognized barista certifications. Start your coffee career journey today." />
    </Helmet>

    <section className="relative bg-primary text-cream pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="container-custom relative z-10">
        <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="text-center max-w-3xl mx-auto">
          <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">Certifications</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Professional <span className="text-accent">Certifications</span>
          </h1>
          <p className="font-body text-cream/80 text-lg md:text-xl leading-relaxed">
            Earn globally recognized credentials and transform your passion for coffee into a thriving career.
          </p>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
    </section>

    <section className="py-20 bg-cream">
      <div className="container-custom">
        <SectionTitle
          subtitle="Why Get Certified"
          title="Benefits of Certification"
          description="Our certifications open doors to global opportunities in the specialty coffee industry."
        />
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {benefits.map((b, i) => (
            <motion.div key={i} variants={fadeIn('up', i * 0.1)} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <b.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-2">{b.title}</h3>
              <p className="font-body text-text/70 leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    <section className="py-20 bg-white">
      <div className="container-custom">
        <SectionTitle
          subtitle="Our Programs"
          title="Certifications We Offer"
          description="Choose the certification that matches your experience level and career goals."
        />
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mt-12"
        >
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              variants={fadeIn('up', i * 0.1)}
              className="relative group bg-cream rounded-2xl p-8 border border-primary/5 hover:border-accent/30 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant={i < 2 ? 'default' : 'accent'}>{cert.level}</Badge>
                  <h3 className="font-heading text-2xl font-bold text-primary mt-3">{cert.title}</h3>
                </div>
                <span className="text-2xl font-heading font-bold text-accent whitespace-nowrap">{cert.price}</span>
              </div>
              <p className="font-body text-text/70 mb-4">{cert.description}</p>
              <div className="flex items-center gap-4 mb-4 text-sm text-text/60 font-body">
                <span className="flex items-center gap-1"><FiClock className="w-4 h-4" />{cert.duration}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {cert.highlights.map((h, j) => (
                  <li key={j} className="flex items-start gap-2 text-text/70 font-body text-sm">
                    <FiCheck className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
              <Button variant="primary" className="w-full">Enroll Now</Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    <section className="py-20 bg-cream">
      <div className="container-custom">
        <SectionTitle
          subtitle="Career Opportunities"
          title="Your Future Starts Here"
          description="Our certified graduates go on to work in top cafes, roasteries, and coffee brands worldwide."
        />
        <motion.div
          variants={staggerContainer(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          {careerRoles.map((role, i) => (
            <motion.div
              key={i}
              variants={fadeIn('up', i * 0.05)}
              className="bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow duration-300 border border-primary/5"
            >
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiBriefcase className="w-5 h-5 text-accent" />
              </div>
              <p className="font-body font-medium text-primary text-sm">{role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="container-custom relative z-10">
        <motion.div
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">Professional Recognition</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream mb-6">Globally Recognized Credentials</h2>
          <p className="font-body text-cream/80 text-lg mb-8">
            Our certifications are aligned with Specialty Coffee Association (SCA) standards and recognized by leading coffee organizations worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {['SCA Certified', 'Industry Approved', 'Globally Accepted', 'Employer Trusted'].map((label, i) => (
              <motion.div
                key={i}
                variants={fadeIn('up', i * 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex items-center gap-2 text-cream/80 font-body"
              >
                <FiCheck className="w-5 h-5 text-accent" />
                <span>{label}</span>
              </motion.div>
            ))}
          </div>
          <Link to="/enroll">
            <Button variant="primary" size="lg">Start Your Certification Journey</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  </PageTransition>
);

export default Certifications;
