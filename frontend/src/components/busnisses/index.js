import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Rating from "../rating/rating";
import "./style.css";
import ImageGallery from "react-image-gallery";
import ShowRating from "../category/ShowRating";
import "react-image-gallery/styles/css/image-gallery.css";
import { FormControl, Button, Alert } from "react-bootstrap";
// import { deleteComment } from "../../../../back-end/routers/controllers/comments";

export default function Busnisses() {
  const [pictures, setPictures] = useState([]);
  const [errMessage, setErrMessage] = useState("");
  const [business, setBusiness] = useState("");
  const [commints, setCommints] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [userRate, setUserRate] = useState(false);
  const [info, setInfo] = useState(false);
  const thisToken = localStorage.getItem("token");
  const { id } = useParams();
  const state = useSelector((state) => {
    return {
      token: state.login.token,
      user_id: state.login.user_id,
    };
  });
  let arr;
  const getimages = async () => {
    try {
      const picture = await axios.get(`http://localhost:5000/image/${id}`);
      arr = picture.data.map((elem, i) => {
        return { original: elem.image, thumbnail: elem.image };
      });
      setPictures(arr);
    } catch (error) {
      setErrMessage(error.data);
    }
  };

  const getDetails = async () => {
    try {
      const details = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER}business/id/${id}`
      );
      setBusiness(details.data[0]);
    } catch (error) {
      setErrMessage(error.data);
    }
  };

  const getCommit = async () => {
    try {
      const details = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER}comments/${id}`
      );
      setCommints(details.data);
    } catch (error) {
      setErrMessage(error.data);
    }
  };
  const getUserrate = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_SERVER}rating/${id}`, {
        headers: {
          authorization: "Bearer " + thisToken,
        },
      })
      .then((result) => {
        setUserRate(result.data[0].rate);
      })
      .catch((err) => {
        if (err.response.data == "not found") {
          setUserRate(false);
        }
      });
  };

  ///////////////////////////useEffect/////////////////
  useEffect(() => {
    getimages();
    getDetails();
    getCommit();
    getUserrate();
  }, [info]);
  //////////////////////////////////////////////////////
  const addComment = () => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_SERVER}comments/${id}`,
        { comment: userComment },
        {
          headers: {
            authorization: "Bearer " + thisToken,
          },
        }
      )
      .then((result) => {
        if (info) {
          setInfo(false);
          setUserComment("");
        } else {
          setInfo(true);
          setUserComment("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteComment = (comment_id) => {
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_SERVER}comments/${comment_id}`,

        {
          headers: {
            authorization: "Bearer " + thisToken,
          },
        }
      )
      .then((result) => {
        if (info) {
          setInfo(false);
        } else {
          setInfo(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      {business ? (
        <div className="parent">
          <div className="gallery">
            <ImageGallery items={pictures} />
            {errMessage}
          </div>
          <div className="information">
            <h1 className="header">{business.displayName}</h1>
            <p className="description">{business.description}</p>
            <p>{business.city}</p>
            <p>
              {" "}
              <div className="rate">
                <ShowRating rate={business.average_rating} /> Review from{" "}
                {business.number_rating} User
              </div>
            </p>
            <p className="price">${business.booking_price} JD</p>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="user-rate">
        <h1 className="comments">Comments </h1>
        {!userRate ? (
          <>
            <p>Your rate</p>{" "}
            <Rating id={id} thisToken={thisToken} setInfo={setInfo} />
          </>
        ) : (
          <>
            <p>Your rate</p> <ShowRating rate={userRate} />
          </>
        )}
      </div>
      <div className="containers">
        {commints.map((element) => {
          return (
            <div className="comment">
              <div className="commenter">
                <p>{element.displayName}</p>
              </div>

              <div className="comment">
                <p>{element.comment}</p>
              </div>
              <div>
                {state.user_id == element.user_id ? (
                  <Button
                    onClick={() => {
                      deleteComment(element.comment_id);
                    }}
                  >
                    delete comment
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        })}
        <div>
          <FormControl
            placeholder="your Comment"
            type="text"
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            type="text"
            value={userComment}
            onChange={(e) => {
              setUserComment(e.target.value);
            }}
          />
          <Button className="singUpButton" onClick={addComment}>
            add Comment
          </Button>
        </div>
      </div>
      <div className="comments"></div>
    </>
  );
}
