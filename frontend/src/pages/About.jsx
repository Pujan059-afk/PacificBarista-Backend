import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import Button from '../components/ui/Button';
import { fadeIn, staggerContainer } from '../animations';
import teacherTeaching from '../assets/images/TeacherTeaching.jpg';
import teacherGuiding from '../assets/images/TeacherGuiding.jpg';
import coffeeArt from '../assets/images/coffeeArt.jpg';
import pacificStudentTraining from '../assets/images/PacificStudentTraining.jpg';


const milestones = [
  { year: '2015', title: 'Founded in Portland', description: 'Pacific Barista Academy opened its doors with a single espresso machine and a dream.' },
  { year: '2017', title: 'First Certification Program', description: 'Launched our industry-recognized barista certification, setting new standards.' },
  { year: '2019', title: 'Expanded Campus', description: 'Moved to a state-of-the-art facility with dedicated labs for brewing and latte art.' },
  { year: '2021', title: 'Online Learning Launch', description: 'Adapted our curriculum for hybrid learning, reaching students worldwide.' },
  { year: '2023', title: '1,000 Graduates', description: 'Celebrated training over a thousand professionals now working across the globe.' },
  { year: '2025', title: 'Global Recognition', description: 'Partnered with leading coffee brands and became a premier training destination.' },
];

const values = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: 'Excellence',
    description: 'We hold ourselves and our students to the highest standards, ensuring every cup tells a story of dedication.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Community',
    description: 'Coffee brings people together. We foster an inclusive community that supports growth and collaboration.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Innovation',
    description: 'We embrace new techniques, technologies, and ideas to keep our training at the forefront of the industry.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Passion',
    description: 'Love for coffee drives everything we do. We inspire that same passion in every student who walks through our doors.',
  },
];

const About = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>About Us | Pacific Barista Academy</title>
        <meta name="description" content="Discover the story behind Pacific Barista Academy — our mission, values, world-class training facility, and passion for coffee education since 2015." />
        <link rel="canonical" href="https://www.pacificbarista.com/about" />
        <meta property="og:title" content="About Us | Pacific Barista Academy" />
        <meta property="og:description" content="Discover the story behind Pacific Barista Academy — our mission, values, and passion for coffee education since 2015." />
        <meta property="og:url" content="https://www.pacificbarista.com/about" />
        <meta property="og:image" content="https://www.pacificbarista.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Pacific Barista Academy" />
        <meta name="twitter:description" content="Discover the story behind Pacific Barista Academy — our mission, values, and passion for coffee education." />
        <meta name="twitter:image" content="https://www.pacificbarista.com/og-image.jpg" />
      </Helmet>

      <section className="relative pt-36 pb-28 bg-gradient-to-br from-primary via-primary to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-1/4 w-80 h-80 border border-accent/20 rounded-full" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 border border-accent/10 rounded-full" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">
              Since 2015
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6">
              Our Story
            </h1>
            <p className="font-body text-cream/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              From a single espresso machine in Portland to one of the most respected barista training academies — our journey is brewed in passion.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeIn('right')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-3">
                Our History
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-primary font-bold leading-tight mb-6">
                Brewing Excellence Since 2015
              </h2>
              <div className="space-y-4 font-body text-text/70 leading-relaxed">
                <p>
                  Pacific Barista Academy was founded in 2015 by a group of coffee professionals who shared a common vision: to create a training environment that bridged the gap between passion and profession. What started as small workshops in a rented Portland space quickly grew into something much larger.
                </p>
                <p>
                  Over the years, we have trained over a thousand baristas, many of whom now work at award-winning cafes, roasteries, and coffee brands around the world. Our curriculum is continuously refined to reflect the latest industry standards and innovations.
                </p>
                <p>
                  Today, we are proud to be recognized as one of the premier barista training academies in the Pacific Northwest and beyond, with a state-of-the-art facility and a team of instructors who are leaders in their craft.
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn('left')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img src={teacherTeaching} alt="Teacher teaching students" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-3">
              Our Foundation
            </span>
            <h2 className="font-heading text-4xl md:text-5xl text-primary font-bold leading-tight">
              Mission, Vision &amp; Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { title: 'Our Mission', description: 'To empower coffee enthusiasts and professionals with the knowledge, skills, and confidence to excel in the specialty coffee industry through world-class training and mentorship.', accent: true },
              { title: 'Our Vision', description: 'To be the global benchmark for barista education — inspiring a new generation of coffee professionals who elevate the craft and culture of coffee worldwide.', accent: false },
              { title: 'Our Promise', description: 'Every student who graduates from Pacific Barista Academy leaves with not just a certificate, but a deep understanding of coffee and the practical skills to thrive.', accent: false },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeIn('up', i * 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className={`p-8 rounded-2xl ${item.accent ? 'bg-accent text-white' : 'bg-cream text-primary'}`}
              >
                <h3 className={`font-heading text-2xl font-bold mb-4 ${item.accent ? 'text-white' : 'text-primary'}`}>
                  {item.title}
                </h3>
                <p className={`font-body leading-relaxed ${item.accent ? 'text-white/80' : 'text-text/70'}`}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.h3
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="font-heading text-3xl text-center text-primary font-bold mb-10"
          >
            Our Core Values
          </motion.h3>
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, i) => (
              <motion.div
                key={i}
                variants={fadeIn('up', i * 0.1)}
                className="text-center p-6 rounded-xl bg-cream hover:bg-accent/5 transition-colors duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  {value.icon}
                </div>
                <h4 className="font-heading font-bold text-primary text-lg mb-2">{value.title}</h4>
                <p className="font-body text-sm text-text/60 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeIn('right')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img src={teacherGuiding} alt="Teacher guiding student" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn('left')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-3">
                Our Philosophy
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-primary font-bold leading-tight mb-6">
                Training Philosophy
              </h2>
              <div className="space-y-4 font-body text-text/70 leading-relaxed">
                <p>
                  We believe that great coffee is the result of understanding the science behind every step — from bean to cup. Our training philosophy is built on three pillars: <strong className="text-primary">knowledge</strong>, <strong className="text-primary">practice</strong>, and <strong className="text-primary">mindfulness</strong>.
                </p>
                <p>
                  Every course combines rigorous theoretical foundations with extensive hands-on practice. We emphasize sensory development, critical thinking, and creative expression. Our instructors mentor each student personally, adapting to individual learning styles and goals.
                </p>
                <p>
                  We dont just teach you how to make coffee — we teach you how to think like a barista. To taste, analyze, and refine. To understand the why behind every variable. That is what sets our graduates apart.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeIn('right')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-3">
                Coffee Culture
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-primary font-bold leading-tight mb-6">
                Rooted in Coffee Culture
              </h2>
              <div className="space-y-4 font-body text-text/70 leading-relaxed">
                <p>
                  Coffee is more than a beverage — it is a culture, a ritual, and a community. At Pacific Barista Academy, we are deeply connected to the rich traditions and evolving innovations of the coffee world.
                </p>
                <p>
                  We collaborate with specialty roasters, participate in industry events, and regularly host cupping sessions and guest lectures. Our students become part of a network that extends far beyond the classroom — connecting them to the heartbeat of the global coffee community.
                </p>
                <p>
                  Whether it is exploring single-origin pour-overs or perfecting the art of Italian espresso, we honor coffee heritage while embracing the future of the craft.
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn('left')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img src={coffeeArt} alt="Coffee art" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeIn('right')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img src={pacificStudentTraining} alt="Students training" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn('left')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-3">
                Our Facility
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-primary font-bold leading-tight mb-6">
                Modern Training Facility
              </h2>
              <div className="space-y-4 font-body text-text/70 leading-relaxed">
                <p>
                  Our campus features a dedicated training environment designed to simulate real-world cafe conditions while providing a comfortable learning space. Each workstation is equipped with professional-grade espresso machines, grinders, and brewing equipment from leading manufacturers.
                </p>
                <p>
                  We have dedicated labs for espresso training, latte art, brewing, sensory evaluation, and theory sessions. Our cupping room allows students to develop their palate in a controlled environment with proper lighting and aroma control.
                </p>
                <p>
                  Small class sizes ensure every student receives individual attention and ample hands-on practice time. Our facility reflects our commitment to creating an inspiring, professional learning environment.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-3">
              Your Future
            </span>
            <h2 className="font-heading text-4xl md:text-5xl text-primary font-bold leading-tight mb-6">
              Career-Focused Training
            </h2>
            <p className="font-body text-text/70 text-lg leading-relaxed">
              We dont stop at graduation. Our career support program helps you transition from student to professional with confidence.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Job Placement Assistance', description: 'We partner with top cafes and roasteries to connect our graduates with exciting career opportunities.' },
              { title: 'Resume & Portfolio Building', description: 'Receive guidance on crafting a compelling barista resume and building a portfolio of your work.' },
              { title: 'Lifelong Alumni Network', description: 'Join a community of Pacific Barista alumni worldwide, with ongoing events, workshops, and job postings.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeIn('up', i * 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-cream hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-primary text-xl mb-3">{item.title}</h3>
                <p className="font-body text-text/60 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-cream">
        <div className="container-custom">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-3">
              Our Team
            </span>
            <h2 className="font-heading text-4xl md:text-5xl text-primary font-bold leading-tight mb-6">
              Professional Trainers
            </h2>
            <p className="font-body text-text/70 text-lg leading-relaxed">
              Our instructors are industry veterans with years of experience in specialty coffee — from competition baristas to certified SCA trainers.
            </p>
          </motion.div>
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to="/trainers">
              <Button variant="primary" size="lg">
                Meet Our Trainers
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-3">
              Our Journey
            </span>
            <h2 className="font-heading text-4xl md:text-5xl text-primary font-bold leading-tight">
              Academy Milestones
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-primary/10 hidden md:block" />
            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn(i % 2 === 0 ? 'right' : 'left')}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-50px' }}
                  className={`relative flex flex-col md:flex-row items-center gap-6 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-cream p-6 rounded-2xl inline-block max-w-md">
                      <span className="font-heading text-3xl font-bold text-accent">{milestone.year}</span>
                      <h3 className="font-heading text-xl font-bold text-primary mt-2">{milestone.title}</h3>
                      <p className="font-body text-text/60 mt-2 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-12 h-12 rounded-full bg-accent border-4 border-white shadow-md flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary via-primary to-secondary text-center">
        <div className="container-custom">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl text-white font-bold leading-tight mb-4">
              Start Your Coffee Journey
            </h2>
            <p className="font-body text-cream/60 text-lg max-w-xl mx-auto mb-8">
              Whether you are taking your first step or advancing your career, we have a course for you.
            </p>
            <Link to="/courses">
              <Button variant="primary" size="lg">
                Explore Courses
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default About;
