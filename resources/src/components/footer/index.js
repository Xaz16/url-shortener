import React from 'react';

const Footer = () => (
  <React.Fragment>
    <footer className="app-footer">
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div>
            2018 &copy; Copyright
          </div>
          <div>
            <span className="app-footer__link">Terms of Use</span>
            <span className="app-footer__link">Privacy Policy</span>
            <span className="app-footer__link">About</span>
          </div>
        </div>
      </div>
    </footer>
  </React.Fragment>
);

export default Footer;
