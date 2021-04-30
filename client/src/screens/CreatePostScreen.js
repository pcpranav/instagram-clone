import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const CreatePostScreen = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  //
  useEffect(() => {
    if (url) {
      createpost();
    }
  }, [url]);
  async function createpost() {
    try {
      setLoading(true);
      const res = await fetch("/api/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          title,
          body,
          imageUrl: url,
        }),
      });
      setLoading(false);
      let data = await res.json();
      if (data.error) {
        M.toast({ html: data.error, classes: "#c62828 red darken-3" });
      } else {
        M.toast({
          html: "post created successfully!",
          classes: "#388e3c green darken-2",
        });
        history.push("/");
      }
    } catch (error) {
      let message = error.message;
      console.log(message);
    }
  }
  //
  const submitHandler = async () => {
    const data = new FormData();
    data.append("file", image);
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
    //
  };
  return (
    <>
      {loading ? (
        <h6>Loading....</h6>
      ) : (
        <div
          className="card input-filled"
          style={{
            margin: "2rem auto",
            maxWidth: "35rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken">
              <span>Upload Image</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
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
            Submit
          </button>
        </div>
      )}
    </>
  );
};

export default CreatePostScreen;
