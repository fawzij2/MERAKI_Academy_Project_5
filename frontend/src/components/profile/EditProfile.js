import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { FormControl, Button, Alert } from "react-bootstrap";
import "./profile.css";

export default function EditProfile() {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [role_id, setRole_id] = useState(0);
  let thisToken = localStorage.getItem("token");


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_SERVER}users`, {
        headers: {
          authorization: "Bearer " + thisToken,
        },
      })
      .then((result) => {
        setUserInfo(result.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);
  return (
    <div>
      {userInfo ? <div className="sign-up-input">
        <p className="login_text">Edit Your Info..</p> <br />
        <FormControl
          placeholder={`Your Name : ${userInfo[0].displayName}`}
          type="text"
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          onChange={(e) => {
            setDisplayName(e.target.value);
          }}
        />
        <FormControl
          placeholder={`Your City : ${userInfo[0].city}`}
          type="text"
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          onChange={(e) => {
            setCity(e.target.value);
          }}
        />
        <FormControl id="email-input"
          placeholder={userInfo[0].email}
          type="text"
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          
        />
        
        <FormControl
          placeholder={`Your Age : ${userInfo[0].age}`}
          type="number"
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          onChange={(e) => {
            setAge(parseInt(e.target.value));
          }}
        />
        <select
          onChange={(e) => {
            setGender(e.target.value);
          }}
        >
          <option>select a gender...</option>
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
        
        <div className="sign-up-button">
          <Button className="singUpButton" >
            Update Your Info
          </Button>{" "}
        </div>
      </div>:""}
    </div>
  );
}
