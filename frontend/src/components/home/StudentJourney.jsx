import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../animations';
import SectionTitle from '../ui/SectionTitle';
import { IconEdit, IconBookOpen, IconCoffee, IconAward, IconBriefcase } from '../ui/Icons';

const steps = [
  {
    icon: IconEdit,
    title: 'Enroll',
    description: 'Choose your program and complete the simple enrollment process online.',
  },
  {
    icon: IconBookOpen,
    title: 'Learn',
    description: 'Attend expert-led classes combining theory with hands-on practical sessions.',
  },
  {
    icon: IconCoffee,
    title: 'Practice',
    description: 'Hone your skills with unlimited practice time on professional equipment.',
  },
  {
    icon: IconAward,
    title: 'Certification',
    description: 'Pass your assessments and earn your globally recognized barista certification.',
  },
  {
    icon: IconBriefcase,
    title: 'Career',
    description: 'Launch your career with our job placement support and industry connections.',
  },
];

const StudentJourney = () => {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Your Journey"
          title="From Student to Professional"
          description="Follow our proven path to becoming a skilled, certified barista ready for the industry."
        />

        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="relative"
        >
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-accent to-accent/40 -translate-x-1/2" />

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  variants={fadeIn(isLeft ? 'right' : 'left')}
                  className={`relative flex items-start gap-5 lg:gap-0 ${
                    isLeft ? 'lg:text-right lg:pr-12 lg:justify-self-start lg:col-start-1 lg:col-end-2' : 'lg:pl-12 lg:justify-self-end lg:col-start-2 lg:col-end-3'
                  } ${!isLeft && 'lg:row-start-auto'}`}
                  style={isLeft ? { gridRow: i + 1 } : { gridRow: i + 1 }}
                >
                  <div className={`flex lg:hidden w-10 h-10 rounded-full bg-accent/10 flex-shrink-0 items-center justify-center`}>
                    <Icon className="w-5 h-5 text-accent" />
                  </div>

                  <div className={`hidden lg:flex absolute top-0 ${
                    isLeft ? 'right-0' : 'left-0'
                  } w-10 h-10 rounded-full bg-accent/10 items-center justify-center z-10 border-4 border-white`}>
                    <Icon className="w-5 h-5 text-accent" />
                  </div>

                  {isLeft && (
                    <div className="hidden lg:block absolute right-[-5px] top-4 w-3 h-3 rounded-full bg-accent z-20 border-2 border-white" />
                  )}
                  {!isLeft && (
                    <div className="hidden lg:block absolute left-[-5px] top-4 w-3 h-3 rounded-full bg-accent z-20 border-2 border-white" />
                  )}

                  <div className={`flex-1 ${isLeft ? 'lg:pr-4' : 'lg:pl-4'}`}>
                    <span className="inline-block text-accent font-body text-xs font-semibold uppercase tracking-wider mb-1">
                      Step {i + 1}
                    </span>
                    <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="font-body text-text/60 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className={`hidden lg:flex w-10 h-10 rounded-full bg-accent/10 flex-shrink-0 items-center justify-center ${
                    isLeft ? 'order-first' : ''
                  }`}>
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StudentJourney;
