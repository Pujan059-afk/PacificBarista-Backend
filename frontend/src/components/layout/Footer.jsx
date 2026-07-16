import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok } from 'react-icons/fa';
import { NAV_LINKS } from '../../utils/constants';
import logo from '../../assets/pacificbarista.jpg';

const socialIcons = {
  FaInstagram: FaInstagram,
  FaFacebook: FaFacebookF,
  FaYoutube: FaYoutube,
  FaTiktok: FaTiktok,
};

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Pacific Barista" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-heading text-xl font-bold">Pacific Barista</span>
            </Link>
            <p className="text-white/60 font-body text-sm leading-relaxed mb-6">
              Premium barista training academy dedicated to crafting exceptional coffee professionals through expert-led courses and hands-on experience.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaFacebookF, url: 'https://www.facebook.com/search/top?q=pacific%20barista' },
                { icon: FaInstagram, url: 'https://www.instagram.com/baristapacific/' },
                { icon: FaTiktok, url: 'https://www.tiktok.com/@pacific_barista' },
                { icon: FaYoutube, url: 'https://youtube.com/@pacificbarista' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-accent hover:text-white transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-5">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-accent transition-colors duration-200 font-body text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-5">Contact</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-white/60 font-body text-sm">
                  Newroad-9, Pokhara, Nepal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="tel:+9779846944202" className="text-white/60 hover:text-accent transition-colors font-body text-sm">
                  061-591328 / 984-6944202
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:pbap2021@gmail.com" className="text-white/60 hover:text-accent transition-colors font-body text-sm">
                  pbap2021@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiClock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-white/60 font-body text-sm">
                  <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p>Sat: 9:00 AM - 4:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 font-body text-sm">
            &copy; {new Date().getFullYear()} Pacific Barista. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-white/40 hover:text-accent transition-colors font-body text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/40 hover:text-accent transition-colors font-body text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
