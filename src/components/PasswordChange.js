import React from 'react';
import authClient from '../helpers/auth/client';
import BaseValidationForm from '../helpers/auth/BaseValidationForm'
import { debounce } from '../helpers/helpers'

class PwChangeForm extends BaseValidationForm {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: { ...this.fieldProps },
      password: { ...this.fieldProps },
      passwordConfirm: { ...this.fieldProps }
    }
    this.validateInput = debounce(() => {
      return this.validateInputs({ 
        password: this.state.password.value,
        passwordConfirm: this.state.passwordConfirm.value,
      })
    }, 800)
  }

  handleSubmit = event => {
    event.preventDefault();
    event.stopPropagation();
    authClient.account.updatePassword({
      currPassword: this.state.currentPassword.value,
      newPassword: this.state.password.value
    });
  };

  render() {
    return (
      <div className="container">
        <form className="auth-form" onSubmit={this.handleSubmit} >
          <p className="h5 mb-4">Change Your Password</p>
          <div className="md-form">
            <label htmlFor="pw-change-current-password">Current Password</label>
            <input
              className="form-control"
              id="pw-change-current-password"
              name="currentPassword"
              type="password"
              autoComplete="off"
              onChange={this.recordInput}
            />
          </div>
          <div className="md-form">
            <label htmlFor="pw-change-new-password">New Password</label>
            <input
              className={this.state.password.inputClass}
              id="pw-change-new-password"
              name="password"
              type="password"
              autoComplete="off"
              onChange={this.recordInput}
            />
            <div className={this.state.password.feedbackClass}>
              {this.state.password.feedback}
            </div>
          </div>
          <div className="md-form">
            <label htmlFor="pw-change-confirm-password">
              Confirm New Password
            </label>
            <input
              className={this.state.passwordConfirm.inputClass}
              id="pw-change-confirm-password"
              name="passwordConfirm"
              type="password"
              autoComplete="off"
              onChange={this.recordInput}
            />
            <div className={this.state.passwordConfirm.feedbackClass}>
              {this.state.passwordConfirm.feedback}
            </div>
          </div>
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </form>
      </div>
    );
  }
}
export default PwChangeForm;
