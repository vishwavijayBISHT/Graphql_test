import React, { Component } from "react";
import "./Auth.css";
import authContext from "../context/auth-context";
export default class Auth extends Component {
  state = {
    isLogin: true,
  };
  static contextType = authContext;
  constructor(props) {
    super(props);
    this.emialEL = React.createRef();
    this.passEl = React.createRef();
  }
  switchMode = () => {
    this.setState((ps) => {
      return { isLogin: !ps.isLogin };
    });
  };
  submitHandler = (event) => {
    event.preventDefault();
    const emial = this.emialEL.current.value;
    const pass = this.passEl.current.value;
    if (emial.trim().length === 0 || pass.trim().length === 0) {
      return;
    }
    let logbody = {
      query: `
           query{
             login{emial:"${emial}",password:"${pass}"}{
               userid
               token
               tokenExp
             }
           }
      `,
    };
    if (!this.state.isLogin) {
      logbody = {
        query: `
      mutation{
        createUser(userInput:{email:"${emial}",password:"${pass}"}){
          _id
          email
        }
      }`,
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(logbody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userid,
            resData.data.login.tokenExp
          );
        }
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <lable htmlForm="emial"> Emial</lable>
          <input type="email" id="email" ref={this.emialEL} />
        </div>
        <div className="form-control">
          <lable htmlForm="password"> Password</lable>
          <input type="password" id="password" ref={this.passEl} />
        </div>
        <div className="form-actions">
          <button type="button" onClick={this.switchMode}>
            Switch to
            {this.state.isLogin ? "Signup" : "Login"}
          </button>
          <button type="submit">Submit </button>
        </div>
      </form>
    );
  }
}
