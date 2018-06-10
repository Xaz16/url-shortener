'use strict';

class MainForm {
  get rules() {
    return {
      'original_url': 'required|max:500',
      'desired_url': 'max:500',
    };
  }

  get messages() {
    return {
      'original_url.required': 'Original url is required',
      'original_url.max': 'Original url should not be more than 500 charters',
      'desired_url.max': 'Desired url should not be more than 500 charters',
      'desired_url.required': 'Desired url is required',
    };
  };

}

module.exports = MainForm;
