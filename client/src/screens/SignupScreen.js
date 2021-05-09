import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const SignupScreen = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [url, setUrl] = useState(undefined);
  const [loading, setLoading] = useState(false);

  //
  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);
  const uploadPic = async () => {
    if (!name || !email || !password) {
      M.toast({
        html: "name,email,password is required",
        classes: "#c62828 red darken-2",
      });
      return;
    } else if (!/^[^\s@]+@[^\s@]+$/.test(email)) {
      M.toast({ html: "invalid email", classes: "#c62828 red darken-2" });
      return;
    } else {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "djclc3a7t");
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/djclc3a7t/image/upload",
          {
            method: "post",
            body: data,
          }
        );
        setLoading(false);
        const val = await res.json();
        setUrl(val.url);
      } catch (error) {
        console.log(error);
      }
    }
  };
  //
  const uploadFields = async () => {
    try {
      const res = await fetch("/api/signup", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          pic: url,
        }),
      });
      let data = await res.json();

      if (data.error) {
        M.toast({ html: data.error, classes: "#c62828 red darken-3" });
      } else {
        if (!/^[^\s@]+@[^\s@]+$/.test(email)) {
          M.toast({ html: "invalid email", classes: "#c62828 red darken-2" });
          return;
        } else {
          M.toast({ html: data.message, classes: "#388e3c green darken-2" });
          history.push("/login");
        }
      }
    } catch (error) {
      let message = error.message;
      console.log(message);
    }
  };
  const submitHandler = async () => {
    if (pic) {
      uploadPic();
    } else {
      uploadFields();
    }
  };
  //
  return (
    <>
      {loading ? (
        <h6>Loading....</h6>
      ) : (
        <div className="mycard">
          <div className="card auth-card input-field">
            <h2>Instagram</h2>
            <input
              type="text"
              placeholder="enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <div className="file-field input-field">
              <div className="btn #64b5f6 blue darken">
                <span>Upload Image</span>
                <input
                  type="file"
                  onChange={(e) => setPic(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
            <button
              className="btn #64b5f6 blue darken"
              onClick={() => submitHandler()}
            >
              Signup
            </button>
            <br />
            <Link to="/login">
              <b>Already have an account? Sign in.</b>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupScreen;
