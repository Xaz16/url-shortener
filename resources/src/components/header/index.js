import React from 'react';
import logo from '../../img/logo.svg';

const Header = () => (
  <React.Fragment>
    <header className="app-header">
      <div className="container">
        <div className="row align-items-center">
          <div className="logo d-flex align-items-center">
            <img src={logo} className="logo__image mr-2" alt=""/>
            <span className="logo__text text-uppercase">
                  Url Shortener
                </span>
          </div>
        </div>
      </div>
    </header>
  </React.Fragment>);

export default Header;
