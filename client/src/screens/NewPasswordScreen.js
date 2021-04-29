import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
//
const NewPasswordScreen = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const { token } = useParams();
  //
  const submitHandler = async () => {
    try {
      const res = await fetch("/api/newpassword", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          token,
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
          type="password"
          placeholder="enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn blue darken" onClick={() => submitHandler()}>
          update password
        </button>
      </div>
    </div>
  );
};

export default NewPasswordScreen;
