import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
//
const ResetPasswordScreen = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  //
  const submitHandler = async () => {
    try {
      const res = await fetch("/api/resetpassword", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      let data = await res.json();
      if (data.error) {
        M.toast({ html: data.error, classes: "#c62828 red darken-2" });
      } else {
        M.toast({ html: data.message, classes: "#388e3c green darken-2" });
        history.push("/login");
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
        />

        <button
          className="btn  #64b5f6 blue darken"
          onClick={() => submitHandler()}
        >
          reset password
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
