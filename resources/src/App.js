import React, { Component } from 'react';
import './App.css';
import ShortUrlForm         from './components/short-url-form';
import Header               from './components/header';
import Footer               from './components/footer';
import { Provider }         from 'react-redux';
import store                from './redux/store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="main-wrapper">
          <Header/>
          <main className="h-100">
            <ShortUrlForm/>
          </main>
          <Footer/>
        </div>
      </Provider>
    );
  }
}

export default App;
