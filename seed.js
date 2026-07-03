require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Course = require('./models/Course');

const courses = [
  {
    title: '#1. Foundation Barista Course',
    slug: 'foundation-barista-course',
    description: 'Learn the core skills to start your barista journey. This comprehensive foundation course covers everything from coffee beans and origin to espresso extraction, milk steaming, and café workflow. Perfect for absolute beginners with no prior experience.',
    shortDescription: 'Perfect for Beginners! Learn the core skills to start your barista journey.',
    duration: '15 Days',
    level: 'Beginner',
    price: 10000,
    curriculum: [
      { title: 'Week 1: Coffee Basics & Espresso Foundation', items: ['Coffee bean origins & roasting basics', 'Espresso extraction techniques', 'Machine setup & operation', 'Safety and workstation hygiene'] },
      { title: 'Week 2: Milk Work & Café Service', items: ['Milk steaming & texturing', 'Espresso-based drinks (Cappuccino, Latte, Americano)', 'Cleaning & maintenance', 'Café workflow & customer service basics'] },
    ],
    learningOutcomes: ['Coffee beans, origin & roasting basics', 'Espresso extraction techniques', 'Milk steaming & texturing', 'Espresso-based drinks (Cappuccino, Latte, Americano, etc.)', 'Machine setup, cleaning & maintenance', 'Café workflow & customer service basics'],
    requirements: ['No prior barista experience required', 'A passion for coffee and willingness to learn', 'Closed-toe shoes for practical sessions', 'Notepad and pen for notes'],
    certificateIncluded: true,
    featured: true,
  },
  {
    title: '#2. Full Barista Course',
    slug: 'full-barista-course',
    description: 'Designed for those who want to work in cafés or coffee chains. This comprehensive program covers advanced espresso science, latte art fundamentals, multiple brewing methods, and professional café workflow management.',
    shortDescription: 'Step into Professional Barista Skills! Designed for those who want to work in cafés or coffee chains.',
    duration: '30 Days',
    level: 'Intermediate',
    price: 15000,
    curriculum: [
      { title: 'Week 1: Advanced Espresso & Latte Art', items: ['Advanced espresso science & flavor balance', 'Latte art fundamentals (hearts, tulips)', 'Grinder calibration', 'Drink presentation'] },
      { title: 'Week 2: Brewing Methods & Menu Planning', items: ['Pour-over techniques', 'AeroPress & French Press', 'Menu planning', 'Flavor balancing'] },
      { title: 'Week 3: Workflow & Troubleshooting', items: ['Café workflow management', 'Equipment troubleshooting', 'Hygiene standards', 'Customer service excellence'] },
      { title: 'Week 4: Final Assessment & Practice', items: ['Speed & efficiency drills', 'Quality control', 'Practical assessment', 'Career guidance'] },
    ],
    learningOutcomes: ['Advanced espresso science & flavor balance', 'Latte art fundamentals', 'Brewing methods: Pour-over, AeroPress, French Press', 'Grinder calibration & troubleshooting', 'Menu planning & drink presentation', 'Hygiene & café workflow management'],
    requirements: ['Completed Foundation Barista Course or basic barista knowledge', 'Basic espresso machine familiarity', 'Passion for coffee and café work'],
    certificateIncluded: true,
    featured: true,
  },
  {
    title: '#3. Advanced Barista Course',
    slug: 'advanced-barista-course',
    description: 'For experienced baristas looking to refine advanced techniques. Master advanced latte art, signature beverage creation, coffee tasting, and café leadership skills.',
    shortDescription: 'Master the Art of Coffee! For experienced baristas looking to refine advanced techniques.',
    duration: '40 Days',
    level: 'Advanced',
    price: 18000,
    curriculum: [
      { title: 'Week 1-2: Advanced Latte Art & Beverage Design', items: ['Advanced pouring techniques (Rosetta, Tulips, Swans)', 'Free pour practice', 'Signature beverage creation', 'Recipe design & costing'] },
      { title: 'Week 3-4: Sensory & Machine Mastery', items: ['Coffee tasting & sensory evaluation', 'Machine calibration mastery', 'Preventive maintenance', 'Equipment deep-dive'] },
      { title: 'Week 5-6: Leadership & Business', items: ['Café leadership & team management', 'Inventory & cost control', 'Coffee business basics', 'Entrepreneurship essentials'] },
      { title: 'Week 7-8: Final Project & Assessment', items: ['Signature drink portfolio', 'Speed & quality certification', 'Business plan presentation', 'Final practical exam'] },
    ],
    learningOutcomes: ['Advanced latte art (Hearts, Rosetta, Tulips and Free Pours)', 'Signature beverage creation & recipe design', 'Coffee tasting & sensory evaluation', 'Machine calibration & maintenance mastery', 'Café leadership & management', 'Coffee business & entrepreneurship basics'],
    requirements: ['Completed Full Barista Course or 6+ months café experience', 'Proficient in espresso extraction and milk texturing', 'Basic latte art skills'],
    certificateIncluded: true,
    featured: true,
  },
];

const seed = async () => {
  try {
    await connectDB();

    const admins = [
      { name: 'Admin', email: 'pacificbarista@gmail.com', password: 'admin@12345', role: 'admin' },
      { name: 'Pujan Subedi', email: 'pocomatpujan@gmail.com', password: 'admin@12345', role: 'admin' },
    ];

    for (const adminData of admins) {
      const existing = await Admin.findOne({ email: adminData.email });
      if (existing) {
        console.log(`Admin "${adminData.email}" already exists. Skipping...`);
      } else {
        await Admin.create(adminData);
        console.log(`Admin "${adminData.email}" created.`);
      }
    }

    for (const courseData of courses) {
      const existing = await Course.findOne({ slug: courseData.slug });
      if (existing) {
        console.log(`Course "${courseData.title}" already exists. Skipping...`);
      } else {
        await Course.create(courseData);
        console.log(`Course "${courseData.title}" created.`);
      }
    }

    console.log('\nSeed complete!');
    console.log('Admins:');
    console.log('  pacificbarista@gmail.com / admin@12345');
    console.log('  pocomatpujan@gmail.com / admin@12345');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seed();
