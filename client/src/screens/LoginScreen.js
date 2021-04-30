import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../App";
//
const LoginScreen = () => {
  const { dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //
  const submitHandler = async () => {
    try {
      const res = await fetch("/api/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      let data = await res.json();
      if (data.error) {
        M.toast({ html: data.error, classes: "#c62828 red darken-2" });
      } else {
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.userDetails));
        dispatch({ type: "USER", payload: data.userDetails });
        M.toast({ html: "Signed in.", classes: "#388e3c green darken-2" });
        history.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="email"
          placeholder="enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="btn #64b5f6 blue darken"
          onClick={() => submitHandler()}
        >
          Login
        </button>

        <Link to="/signup">
          <h6>Dont have an account? Sign up.</h6>
        </Link>
        <Link to="/resetpassword">
          <h6>
            <i>Forgot Password? Click to continue</i>
          </h6>
        </Link>
      </div>
    </div>
  );
};

export default LoginScreen;
