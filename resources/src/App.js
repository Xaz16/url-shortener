import React, { Component } from 'react';
import ShortUrlForm         from './components/short-url-form';
import './App.css';
import logo                 from './img/logo.svg';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <header className="app-header">
          <div className="container">
            <div className="row align-items-center">
              <div className="logo d-flex align-items-center">
                <img src={logo} className="logo__image mr-2"/>
                <span className="logo__text text-uppercase">
                  Url Shortener
                </span>
              </div>
            </div>
          </div>
        </header>
        <main>
          <ShortUrlForm/>
        </main>
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
  }
}

export default App;
