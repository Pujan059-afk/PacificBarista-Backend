import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../animations';
import SectionTitle from '../ui/SectionTitle';
import { IconStar, IconTool, IconAward, IconBriefcase, IconUsers, IconMonitor } from '../ui/Icons';

const reasons = [
  {
    icon: IconStar,
    title: 'Experienced Trainers',
    description: 'Learn from award-winning baristas with years of industry experience at top cafes worldwide.',
  },
  {
    icon: IconTool,
    title: 'Hands-on Training',
    description: 'Get practical experience with professional-grade equipment in our state-of-the-art lab.',
  },
  {
    icon: IconAward,
    title: 'Industry Certification',
    description: 'Earn globally recognized certifications that open doors to opportunities worldwide.',
  },
  {
    icon: IconBriefcase,
    title: 'Career Support',
    description: 'Receive dedicated job placement assistance and mentorship throughout your career journey.',
  },
  {
    icon: IconUsers,
    title: 'Small Class Sizes',
    description: 'Benefit from personalized attention with limited class sizes for optimal learning.',
  },
  {
    icon: IconMonitor,
    title: 'Modern Equipment',
    description: 'Train on the latest espresso machines and brewing technology used by top cafes.',
  },
];

const WhyChoose = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Why Choose Us"
          title="Why Choose Pacific Barista?"
          description="We are committed to providing the highest quality barista training that prepares you for a successful career in the coffee industry."
        />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={i}
                variants={fadeIn('up')}
                className="group p-6 rounded-xl bg-cream hover:bg-white border border-transparent hover:border-accent/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                  {reason.title}
                </h3>
                <p className="font-body text-text/60 leading-relaxed text-sm">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChoose;
