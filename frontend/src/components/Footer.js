import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import PlaystoreIcon from '../images/4.svg';
import AppstoreIcon from '../images/2.svg';
import FacebookIcon from '../images/2.png';
import InstagramIcon from '../images/instagram.png';
import TwitterIcon from '../images/x.png';
import YoutubeIcon from '../images/youtube.png';
import LinkedinIcon from '../images/linkedin.png';
import { baseUrl } from '../services/api-services';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <div className="footer-top">
          <div className="footer-logo">
            <Link to="/">Uber</Link>
          </div>
          <Link to="/help" className="help-center-link">
            Visit Help Center
          </Link>
        </div>

        <Row className="footer-links">
          <Col md={3} sm={6} xs={12}>
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/offerings">Our offerings</Link></li>
              <li><Link to="/newsroom">Newsroom</Link></li>
              <li><Link to="/investors">Investors</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/ai">Uber AI</Link></li>
            </ul>
          </Col>

          <Col md={3} sm={6} xs={12}>
            <h3>Products</h3>
            <ul>
              <li><Link to="/ride">Ride</Link></li>
              <li><Link to="/drive">Drive</Link></li>
              <li><Link to="/deliver">Deliver</Link></li>
              <li><Link to="/eat">Eat</Link></li>
              <li><Link to="/business">Uber for Business</Link></li>
              <li><Link to="/freight">Uber Freight</Link></li>
              <li><Link to="/gift-cards">Gift cards</Link></li>
            </ul>
          </Col>

          <Col md={3} sm={6} xs={12}>
            <h3>Global citizenship</h3>
            <ul>
              <li><Link to="/safety">Safety</Link></li>
              <li><Link to="/diversity">Diversity and Inclusion</Link></li>
              <li><Link to="/sustainability">Sustainability</Link></li>
            </ul>
          </Col>

          <Col md={3} sm={6} xs={12}>
            <h3>Travel</h3>
            <ul>
              <li><Link to="/reserve">Reserve</Link></li>
              <li><Link to="/cities">Cities</Link></li>
            </ul>
          </Col>
        </Row>

        <div className="footer-social">
        
        <div className="social-icons">
  <a href="https://www.facebook.com/uber" className="social-icon facebook">
    <span className="visually-hidden">Facebook</span>
    <img src={FacebookIcon} alt="Facebook" />
  </a>
  <a href="https://twitter.com/uber" className="social-icon twitter">
    <span className="visually-hidden">Twitter</span>
    <img src={TwitterIcon} alt="Facebook" />
  </a>
  <a href="https://www.youtube.com/uber" className="social-icon youtube">
    <span className="visually-hidden">YouTube</span>
    <img src={YoutubeIcon} alt="Facebook" />
  </a>
  <a href="https://www.linkedin.com/company/uber" className="social-icon linkedin">
    <span className="visually-hidden">LinkedIn</span>
    <img src={LinkedinIcon} alt="Facebook" />
  </a>
  <a href="https://www.instagram.com/uber" className="social-icon instagram">
    <span className="visually-hidden">Instagram</span>
    <img src={InstagramIcon} alt="Facebook" />
  </a>
</div>
          <div className="location-language">
            <button className="lang-btn">
              <span className="globe-icon"></span>
              English
            </button>
            <button className="location-btn">
              <span className="location-icon"></span>
              San Francisco Bay Area
            </button>
          </div>
        </div>

        <div className="app-downloads">
  <a href="https://play.google.com/store/apps/details?id=com.ubercab" className="google-play">
    <span className="visually-hidden">Get it on Google Play</span>
    <img src={PlaystoreIcon} alt="Facebook" />
  </a>
  <a href="https://apps.apple.com/us/app/uber/id368677368" className="app-store">
    <span className="visually-hidden">Download on the App Store</span>
    <img src={AppstoreIcon} alt="Facebook" />
  </a>
</div>

        <div className="footer-bottom">
          <div className="privacy-links">
            <Link to="/privacy">Do not sell or share my personal information</Link>
            <Link to="/data-policy">Google Data Policy</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;