import React from 'react'
import authClient from './client'

/* This component is a base component for 
 * password reset and signup. The reason this is 
 * split up into a base component is because
 * password reset and signup shares many
 * validation ui and logic.
 */
class BaseValidationForm extends React.Component {
  constructor (props) {
    super(props)
    this.fieldProps = {
      value: '',
      isValid: false,
      inputClass: 'form-control',
      feedbackClass: 'feedback',
      feedback: ''
    }
    this.validateInput = () => {}
  }
  recordInput = (event) => {
    const { name, value } = event.target
    this.setState({
      [name]: { ...this.state[name], value }
    })
    this.validateInput(name)
  }
  displayFeedback (inputName, errors) {
    const classNameModifier = `${errors ? 'in' : ''}valid`
    this.setState({
      [inputName]: {
        ...this.state[inputName],
        isValid: !errors,
        inputClass: `${this.fieldProps.inputClass} ${classNameModifier}`,
        feedbackClass: `${this.fieldProps.feedbackClass} ${classNameModifier}`,
        feedback: !errors ? 'valid' : Object.values(errors)[0]
      }
    })
  }
  validateInputs (formInputs, context = 'partial') {
    authClient.validator('signUp', formInputs, context, errors => {
      Object.keys(formInputs).forEach(inputName => {
        this.displayFeedback(inputName, (errors && errors[inputName]) || '')
      })
    })
  }
}

export default BaseValidationForm
