import React, { Component }                from 'react';
import { connect }                         from 'react-redux';
import { Form, Control, Errors }           from 'react-redux-form';
import { isUrl, maxLength, required }      from '../../utils';
import { createUrlPair, checkIfAvailable } from '../../utils/api';
import { actions }                         from 'react-redux-form';
import './components.css';

class shortUrlForm extends Component {
  currentDomain = process.env.REACT_APP_CURRENT_DOMAIN;
  shortUrlInput = null;
  state = {
    success: false,
    shortUrl: '',
    originalUrl: '',
    isLoading: false,
    submittedValue: false
  };

  submitHandle = ({original_url, desired_url}) => {
    this.setState({isLoading: true, submittedValue: original_url, success: false});
    const {dispatch, form: {$form}} = this.props;
    console.log($form);
    /**
     * We still can't use async and sync validators together due to
     * https://github.com/davidkpiano/react-redux-form/issues/1013
     * So we should check availability of url after submitting
     */
    createUrlPair({original_url, desired_url}, null)
      .then(res => {
        const success = res.status === 200;
        if (success) {
          this.setState({
            originalUrl: res.data.originalUrl,
            success: success,
            shortUrl: res.data.shortUrl
          });
          dispatch(actions.reset('mainForm'));
        }
      })
      .catch((err) => {
        dispatch(actions.setValidity('mainForm.original_url', {
          statusOk: false
        }));
        dispatch(actions.setSubmitFailed('mainForm'));

        setTimeout(() => {
          dispatch(actions.resetErrors('mainForm'));
        }, 5000);
      })
      .finally(() => {
        this.setState({isLoading: false});
      });
  };


  render() {
    const errorVisibilityClass = (this.props.form.$form.submitFailed && !this.props.form.$form.valid) ? 'show' : '';
    return (
      <React.Fragment>
        <div className="container">
          <div className="row justify-content-center">
            <Form model="mainForm" className="col-sm-6 col-12 short-form"
                  onSubmit={submittedValues => this.submitHandle(submittedValues)}
            >
              <div className="short-form__info-wrapper">
                <div className={`alert alert-success short-form__success ${this.state.success ? 'show' : ''}`}>
                  <div>
                    Original Url:
                    <div>{this.state.originalUrl}</div>
                    Short Url:
                    <input className="short-form__short-url-input" readOnly={true}
                           ref={node => this.shortUrlInput = node}
                           onClick={() => this.shortUrlInput.setSelectionRange(0, this.shortUrlInput.value.length)}
                           value={this.state.shortUrl}/>
                  </div>
                </div>
                <div className={`alert alert-danger short-form__errors ${errorVisibilityClass}`} role="alert">
                  <Errors
                    model="mainForm.original_url"
                    component="div"
                    messages={{
                      isUrl: 'Please provide a valid link',
                      required: 'Original url is required field',
                      statusOk: (val) => 'No response by address: ' + val,
                      maxLength: 'Maximum length of value reached'
                    }}
                  />
                  <Errors
                    component="div"
                    model="mainForm.desired_url"
                    messages={{
                      available: (val) => val + ' already been taken',
                    }}
                  />
                </div>
              </div>
              <div className={'short-form__actions'}>
                <div className={`loader__wrapper ${this.state.isLoading ? 'show' : ''}`}>
                  <div className="loader"></div>
                </div>
                <div className="input-group mb-4">
                  <label htmlFor="original_url" className="d-block w-100">Original Url*</label>
                  <Control.text className="form-control" id="original_url"
                                model="mainForm.original_url"
                                placeholder="http://example.com/"
                                validators={{
                                  isUrl, required, maxLength: maxLength(500)
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
                                asyncValidateOn={'change'}
                                asyncValidators={{
                                  available: checkIfAvailable
                                }}/>
                </div>
                <div className="d-flex justify-content-sm-end pt-2">
                  <button type="submit" className="btn btn-purple short-form__btn"
                          disabled={this.state.submittedValue &&
                          !this.props.form.$form.submitFailed &&
                          !this.props.form.desired_url.value &&
                          this.props.form.original_url.value === this.state.submittedValue}>
                    Create
                  </button>
                </div>
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
