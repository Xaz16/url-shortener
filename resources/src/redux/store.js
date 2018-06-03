import { createStore }  from 'redux';
import { combineForms } from 'react-redux-form';

const initialMainForm = {
  original_url: '',
  desired_url: ''
};

const store = createStore(combineForms({
  mainForm: initialMainForm,
}));

export default store;
