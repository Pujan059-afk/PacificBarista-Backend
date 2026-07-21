import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import Button from '../components/ui/Button';
import { fadeIn } from '../animations';

const sections = [
  {
    title: 'Information We Collect',
    content: 'We collect information you provide directly to us, including your name, email address, phone number, and payment details when you enroll in courses or contact us. We also automatically collect certain technical information such as your IP address, browser type, and usage data when you interact with our website.',
  },
  {
    title: 'How We Use Your Information',
    content: 'Your information is used to process enrollments, communicate with you about your courses, improve our services, send occasional updates with your consent, and comply with legal obligations. We do not sell your personal information to third parties.',
  },
  {
    title: 'Data Security',
    content: 'We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your personal data. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: 'Cookies',
    content: 'Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of our website.',
  },
  {
    title: 'Third-Party Services',
    content: 'We may share your data with trusted third-party service providers who assist us in operating our website, processing payments, and conducting business. These providers are contractually obligated to protect your data and use it only for the services we request.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to access, correct, or delete your personal data held by us. You may also opt out of marketing communications at any time. To exercise these rights, please contact us using the information below.',
  },
  {
    title: 'Changes to This Policy',
    content: 'We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.',
  },
  {
    title: 'Contact Us',
    content: 'If you have questions about this Privacy Policy, please contact us at pbap2021@gmail.com or visit our academy at Newroad-9, Pokhara, Nepal.',
  },
];

const effectiveDate = 'July 8, 2026';

const PrivacyPolicy = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>Privacy Policy | Pacific Barista Academy</title>
        <meta name="description" content="Pacific Barista Academy Privacy Policy — learn how we collect, use, and protect your personal information." />
        <link rel="canonical" href="https://pacificbarista.com.np/privacy" />
        <meta property="og:title" content="Privacy Policy | Pacific Barista Academy" />
        <meta property="og:description" content="Learn how Pacific Barista Academy collects, uses, and protects your personal information." />
        <meta property="og:url" content="https://pacificbarista.com.np/privacy" />
      </Helmet>

      <section className="relative pt-36 pb-20 bg-gradient-to-br from-primary via-primary to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-1/4 w-80 h-80 border border-accent/20 rounded-full" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 border border-accent/10 rounded-full" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">Legal</span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6">
              Privacy Policy
            </h1>
            <p className="font-body text-cream/60 text-lg md:text-xl leading-relaxed">
              Effective Date: {effectiveDate}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-cream">
        <div className="container-custom max-w-4xl">
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="prose prose-lg max-w-none">
            <p className="font-body text-text/70 text-lg leading-relaxed mb-10">
              At Pacific Barista Academy, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or enroll in our courses.
            </p>
            {sections.map((section, i) => (
              <motion.div
                key={i}
                variants={fadeIn('up', i * 0.05)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="font-heading text-2xl text-primary font-bold mb-3">{section.title}</h2>
                <p className="font-body text-text/70 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={fadeIn('up')} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-12 text-center">
            <Link to="/contact">
              <Button variant="primary" size="lg">Contact Us</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default PrivacyPolicy;