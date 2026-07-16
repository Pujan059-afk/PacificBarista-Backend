import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import Button from '../components/ui/Button';
import { fadeIn } from '../animations';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing or using the Pacific Barista Academy website, enrolling in our courses, or using our services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.',
  },
  {
    title: 'Course Enrollment & Payments',
    content: 'Course fees are clearly displayed at the time of enrollment. Full payment or a deposit as specified is required to secure your spot. All payments are processed securely through our third-party payment providers. Prices are subject to change without prior notice, though confirmed enrollments will be honored at the agreed rate.',
  },
  {
    title: 'Cancellation & Refund Policy',
    content: 'Cancellations made at least 7 days before the course start date are eligible for a full refund. Cancellations made 3–6 days before the start date will receive a 50% refund. Cancellations less than 48 hours before the course start date are non-refundable. Pacific Barista Academy reserves the right to cancel or reschedule courses due to insufficient enrollment or unforeseen circumstances; in such cases, a full refund or transfer option will be provided.',
  },
  {
    title: 'Intellectual Property',
    content: 'All course materials, curriculum, videos, and resources provided by Pacific Barista Academy are the intellectual property of the academy and are protected by copyright laws. You may not reproduce, distribute, or create derivative works without our explicit written permission.',
  },
  {
    title: 'Student Conduct',
    content: 'Students are expected to maintain a respectful and professional demeanor at all times during courses and on academy premises. We reserve the right to remove any student who engages in disruptive, unsafe, or disrespectful behavior without a refund.',
  },
  {
    title: 'Liability Waiver',
    content: 'Pacific Barista Academy is not liable for personal injuries, lost or stolen property, or any incidental damages arising from participation in our courses. Students participate voluntarily and assume all inherent risks associated with hands-on training in a cafe environment, including but not limited to burns, cuts, or equipment-related injuries.',
  },
  {
    title: 'Limitation of Liability',
    content: 'To the maximum extent permitted by law, Pacific Barista Academy shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or enrollment in our courses.',
  },
  {
    title: 'Modifications to Terms',
    content: 'We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page. Your continued use of our services after changes constitutes acceptance of the new terms.',
  },
  {
    title: 'Governing Law',
    content: 'These Terms of Service are governed by and construed in accordance with the laws of Nepal. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Pokhara, Nepal.',
  },
  {
    title: 'Contact Information',
    content: 'For questions about these Terms of Service, please contact us at pbap2021@gmail.com, call 061-591328 / 984-6944202, or visit us at Newroad-9, Pokhara, Nepal.',
  },
];

const effectiveDate = 'July 8, 2026';

const TermsOfService = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>Terms of Service | Pacific Barista Academy</title>
        <meta name="description" content="Pacific Barista Academy Terms of Service — understand the terms governing course enrollment, payments, and use of our services." />
        <link rel="canonical" href="https://www.pacificbarista.com/terms" />
        <meta property="og:title" content="Terms of Service | Pacific Barista Academy" />
        <meta property="og:description" content="Understand the terms governing course enrollment, payments, and use of our services." />
        <meta property="og:url" content="https://www.pacificbarista.com/terms" />
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
              Terms of Service
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
              Welcome to Pacific Barista Academy. By accessing our website, enrolling in our courses, or using our services, you agree to the following Terms of Service. Please read them carefully.
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

export default TermsOfService;