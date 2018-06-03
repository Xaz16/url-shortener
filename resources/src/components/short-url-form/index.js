import React, { Component } from 'react';
import './components.css';

export default class shortUrlForm extends Component {
  currentDomain = process.env.REACT_APP_CURRENT_DOMAIN;


  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row justify-content-center">
            <form className="col-sm-8 col-12 short-form">
              <div className="input-group mb-4">
                <label htmlFor="original_url" className="d-block w-100">Original Url*</label>
                <input type="text" className="form-control" id="original_url" name="original_url"
                       placeholder="http://example.com/"/>
              </div>
              <div className="input-group mb-4">
                <label htmlFor="original_url" className="d-block w-100">Desired Url (optional)</label>
                <div className="input-group-prepend">
                  <div className="input-group-text">{this.currentDomain}</div>
                </div>
                <input type="text" className="form-control" id="desired_url" name="desired_url"
                       placeholder="e2QEc"/>
              </div>
              <div className="d-flex justify-content-sm-end pt-2">
                <button type="submit" className="btn btn-purple short-form__btn">Create</button>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
