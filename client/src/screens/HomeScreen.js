import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
//
const HomeScreen = () => {
  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/allposts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        const data = await response.json();
        setData(data.posts);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  //
  const likePost = async (id) => {
    try {
      const response = await fetch("/api/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ postId: id }),
      });
      const result = await response.json();
      const newData = data.map((item) => {
        if (item._id === result._id) {
          return result;
        } else {
          return item;
        }
      });
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };
  //
  const unlikePost = async (id) => {
    try {
      const response = await fetch("/api/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ postId: id }),
      });
      const result = await response.json();
      const newData = data.map((item) => {
        if (item._id === result._id) {
          return result;
        } else {
          return item;
        }
      });
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };
  //
  const deletePost = async (postid) => {
    const res = await fetch(`/api/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const result = res.json();
    const newData = data.filter((item) => {
      return item._id !== result._id;
    });
    setData(newData);
    window.location.reload();
  };
  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5 style={{ padding: "5px" }}>
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? `/profile/${item.postedBy._id}`
                    : "/profile"
                }
              >
                {item.postedBy.name}{" "}
              </Link>
              {item.postedBy._id === state._id && (
                <i
                  className="material-icons"
                  style={{
                    float: "right",
                  }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h5>
            <div className="card-image">
              <img className="cardimg" src={item.image} alt={item.title} />
            </div>
            <div className="card-content">
              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => unlikePost(item._id)}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => likePost(item._id)}
                >
                  thumb_up
                </i>
              )}

              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomeScreen;
