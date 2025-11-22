import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>StreamFlix</h4>
            <p>Your ultimate streaming experience</p>
          </div>

          <div className="footer-section">
            <h5>Company</h5>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/careers">Careers</Link>
          </div>

          <div className="footer-section">
            <h5>Support</h5>
            <Link to="/help">Help Center</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/devices">Supported Devices</Link>
          </div>

          <div className="footer-section">
            <h5>Legal</h5>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>

          <div className="footer-section">
            <h5>Follow Us</h5>
            <div className="social-links">
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="Instagram">Instagram</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} StreamFlix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

