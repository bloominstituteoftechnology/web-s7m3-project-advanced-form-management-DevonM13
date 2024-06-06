// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}
const userSchema = yup.object().shape({ 
  username: yup.string().trim()
    .required(e.usernameRequired)
    .min(3, e.usernameMin).max(20, e.usernameMax),
  favLanguage: yup.string()
    .required(e.favLanguageRequired).trim()
    .oneOf(['javascript', 'rust'], e.favLanguageOptions),
  favFood: yup.string()
    .required(e.favFoodRequired).trim()
    .oneOf(['broccoli', 'spaghetti', 'pizza'], e.favFoodOptions),
  agreement: yup.boolean()
    .required(e.agreementRequired)
    .oneOf([true], e.agreementOptions),
})

const intialFormValues = () => ({
  username: '',
  favLanguage: '',
  favFood: '',
  agreement: false,
})

const intialErrors = () => ({
  username: '',
  favLanguage: '',
  favFood: '',
  agreement: '',
})

const intialDisabled = false;


// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [formValues, setFormValues] = useState(intialFormValues);
  const [formErrors, setFormErrors] = useState(intialErrors);
  const [disabled, setDisabled] = useState(intialDisabled);
  const [serverSuccess, setServerSuccess] = useState();
  const [serverFailure, setServerFailure] = useState();

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.

  useEffect(() => {
    userSchema.isValid(formValues).then(setDisabled)
  }, [formValues])

  const onChange = evt => {
    let { type, name, value, checked } = evt.target
    value = type == 'checkbox' ? checked : value
    setFormValues({ ...formValues, [name]: value })
    yup.reach(userSchema, name).validate(value)
    .then(() => setFormErrors({ ...formErrors, [name]: '' }))
    .catch((err) => setFormErrors({ ...formErrors, [name]: err.errors[0] }))
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
  }

  const onSubmit = evt => {
    evt.preventDefault();
    axios.post('https://webapis.bloomtechdev.com/registration', formValues)
      .then(res => {
        setFormValues(intialFormValues)
        setServerSuccess(res.data.message);
        setServerFailure()
      })
      .catch(err => {
        setServerFailure(err.response.data.message)
        setServerSuccess()
      })
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {serverSuccess && <h4 className="success">{serverSuccess}</h4>}
        {serverFailure && <h4 className="error">{serverFailure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input 
            value={formValues.username}
            id="username" 
            name="username" 
            type="text" 
            placeholder="Type Username" 
            onChange={onChange}
          />
          {formErrors.username && <div className="validation">{formErrors.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input 
                type="radio" 
                name="favLanguage" 
                value="javascript"
                onChange={onChange}
                checked={formValues.favLanguage == 'javascript'} 
              />
              JavaScript
            </label>
            <label>
              <input 
                type="radio" 
                name="favLanguage" 
                value="rust"
                onChange={onChange}
                checked={formValues.favLanguage == 'rust'} 
              />
              Rust
            </label>
          </fieldset>
          {formErrors.favLanguage && <div className="validation">{formErrors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select
            value={formValues.favFood} 
            id="favFood" 
            name="favFood"
            onChange={onChange}
          >
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {formErrors.favFood && <div className="validation">{formErrors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input
              checked={formValues.agreement} 
              id="agreement" 
              type="checkbox" 
              name="agreement"
              onChange={onChange} 
            />
            Agree to our terms
          </label>
          {formErrors.agreement && <div className="validation">{formErrors.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={!disabled} />
        </div>
      </form>
    </div>
  )
}
