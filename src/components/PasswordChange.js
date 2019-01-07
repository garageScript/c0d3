import React from 'react';
import authClient from '../helpers/auth/client';

class pwChangeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    event.stopPropagation();
    authClient.account.updatePassword({
      currPassword: this.state.currentPassword,
      newPassword: this.state.newPassword
    });
  };

  validateInput = () => {
    // TODO: add call to validate inpupts
  };

  recordInput = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <p className="h5 mb-4">Change Your Password</p>
          <div className="md-form">
            <label htmlFor="pw-change-current-password">Current Password</label>
            <input
              id="pw-change-current-password"
              name="currentPassword"
              type="password"
              autoComplete="off"
              onBlur={this.validateInput}
              onChange={this.recordInput}
            />
          </div>
          <div className="md-form">
            <label htmlFor="pw-change-new-password">New Password</label>
            <input
              id="pw-change-new-password"
              name="newPassword"
              type="password"
              autoComplete="off"
              onBlur={this.validateInput}
              onChange={this.recordInput}
            />
          </div>
          <div className="md-form">
            <label htmlFor="pw-change-confirm-password">
              Confirm New Password
            </label>
            <input
              id="pw-change-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="off"
              onBlur={this.validateInput}
              onChange={this.recordInput}
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default pwChangeForm;
