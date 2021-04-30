import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
//
const ProfileScreen = () => {
  const [loading, setLoading] = useState(false);

  const [myposts, setMyPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [pic, setPic] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("/api/myposts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        setLoading(false);
        const data = await response.json();
        setMyPosts(data.posts);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (pic) {
      const uploadPic = async () => {
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
          const val = await res.json();

          const res2 = await fetch("/api/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({ pic: val.url }),
          });
          setLoading(false);
          const response = await res2.json();
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, pic: response.pic })
          );
          dispatch({ type: "UPDATE_PIC", payload: response.pic });
        } catch (error) {
          console.log(error);
        }
      };
      uploadPic();
    }
  }, [pic]);

  const updatePhoto = (file) => {
    setPic(file);
  };
  return (
    <>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <img
                  style={{
                    width: "160px",
                    height: "160px",
                    borderRadius: "80px",
                  }}
                  src={state ? state.pic : "loading"}
                  alt="profile"
                />
              </div>
              <div>
                <h4>{state ? state.name : "loading"}</h4>
                <h5>{state ? state.email : "loading"}</h5>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "108%",
                  }}
                >
                  {myposts.length === 1 ? (
                    <h6>{1} post</h6>
                  ) : (
                    <h6>{myposts.length} posts</h6>
                  )}
                  <h6>{state ? state.followers.length : "0"} followers</h6>
                  <h6>{state ? state.following.length : "0"} following</h6>
                </div>
              </div>
            </div>

            <div className="file-field input-field" style={{ margin: "10px" }}>
              <div className="btn #64b5f6 blue darken-1">
                <span>Update pic</span>
                <input
                  type="file"
                  onChange={(e) => updatePhoto(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
          </div>
          <div className="gallery">
            {myposts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.image}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileScreen;
