import React, { Component }                      from 'react';
import { connect }                               from 'react-redux';
import { Form, Control, Errors }                 from 'react-redux-form';
import { isUrl, required }                       from '../../utils';
import { checkServerResponse, checkIfAvailable } from '../../utils/api';
import './components.css';

class shortUrlForm extends Component {
  currentDomain = process.env.REACT_APP_CURRENT_DOMAIN;

  submitHandle = ({original_url, desired_url}) => {
    /**
     * We still can't use async and sync validators together due to
     * https://github.com/davidkpiano/react-redux-form/issues/1013
     * So we should check availability of url after submitting
     */

    checkServerResponse(original_url, null).then(res => {});
  };


  render() {
    const errorVisibilityClass = this.props.form.$form.submitFailed && !this.props.form.$form.valid ? 'show' : '';
    return (
      <React.Fragment>
        <div className="container">
          <div className="row justify-content-center">
            <Form model="mainForm" className="col-sm-6 col-12 short-form"
                  onSubmit={submittedValues => this.submitHandle(submittedValues)}
            >
              <div className="short-form__errors-wrapper">
                <div className={`alert alert-danger short-form__errors ${errorVisibilityClass}`} role="alert">
                  <Errors
                    model="mainForm.original_url"
                    component="div"
                    messages={{
                      isUrl: 'Please provide a valid link',
                      required: 'Original url is required field',
                      statusOk: (val) => 'No response by address: ' + val
                    }}
                  />
                  <Errors
                    component="div"
                    model="mainForm.desired_url"
                    messages={{
                      available: (val) => val + ' already been taken'
                    }}
                  />
                </div>
              </div>
              <div className="input-group mb-4">
                <label htmlFor="original_url" className="d-block w-100">Original Url*</label>
                <Control.text className="form-control" id="original_url"
                              model="mainForm.original_url"
                              placeholder="http://example.com/"
                              asyncValidateOn={'change'}
                              validators={{
                                isUrl, required
                              }}
                              />
              </div>
              <div className="input-group mb-4">
                <label htmlFor="original_url" className="d-block w-100">Desired Url (optional)</label>
                <div className="input-group-prepend">
                  <div className="input-group-text">{this.currentDomain}</div>
                </div>
                <Control.text type="text" className="form-control" id="desired_url"
                              model="mainForm.desired_url"
                              placeholder="e2QEc"
                              asyncValidators={{
                                available: checkIfAvailable
                              }}/>
              </div>
              <div className="d-flex justify-content-sm-end pt-2">
                <button type="submit" className="btn btn-purple short-form__btn">Create</button>
              </div>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    form: state.forms.mainForm
  };
};

export default connect(mapStateToProps, null)(shortUrlForm);
