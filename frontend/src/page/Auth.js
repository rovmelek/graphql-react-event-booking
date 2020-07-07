import React from "react";
import { Component } from "react";

import './Auth.css';
import AuthCOntext from '../context/auth-context';

class AuthPage extends Component {
  state = {
    isLogin: true,
  }

  static contextType = AuthCOntext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin};
    })
  }

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().lenngth === 0 || password.trim().lenngth === 0) {
      return;
    }

    // console.log(email, password);

    let requestBody = {
      query: `
        query {
          login(
            email: "${email}",
            password: "${password}"
          ) {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {
              email: "${email}",
              password: "${password}"
            }) {
              _id
              email
            }
          }
        `
      };
    }
           
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed');
      }
      return res.json();
    }).then(resData => {
      console.log(resData);
      // since the query can be either a query-login or mutation-createUser, the returned resData might not have the login.token property
      if (resData.data.createUser) {
        console.log(`${resData.data.createUser.email} is created!`);
      } else if (resData.data.login.token) {
        this.context.login(
          resData.data.login.userId,
          resData.data.login.token,
          resData.data.login.tokenExpiration,
        );
      } else {
        console.log('Why are we here?!');
      }
    }).catch(err => {
      console.log(err);
    });
  };

  render() {
    return <form className="auth-form" onSubmit={this.submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={this.emailEl}></input>
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={this.passwordEl}></input>
      </div>
      <div className="form-action">
        <button type="submit">Submit</button>
        <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
      </div>
    </form>;
  }
}

export default AuthPage;