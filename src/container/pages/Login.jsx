import React, { useState } from "react";
import "../styles/authStyles.css";
import { Link } from "react-router-dom";
import { WelcomePage } from "../../constants/image";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../app/userSlice";
import Loader from "../../components/Preloader/Loader";
import { toastError, toastSuccess } from "../../components/toastify/toastMes";

const URL = `/api/auth`;

const Login = () => {
  const [emailAccount, setEmailAccount] = useState("");
  const [pwd, setPwd] = useState("");
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationKey: "login",
    mutationFn: (data) => {
      return axios.post(`${URL}/signin`, data);
    },
  });

  const handleOnChange = (e) => {
    if (e.target.name === "email") {
      setEmailAccount(e.target.value);
    } else if (e.target.name === "password") {
      setPwd(e.target.value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (emailAccount == "" || pwd == "") {
      return;
    }
    try {
      const res = await mutation.mutateAsync({
        email: emailAccount,
        password: pwd,
      });
      const dataResponse = res.data.data;
      dispatch(setUser(dataResponse));
      toastSuccess("Logged In");
    } catch (error) {
      console.log(error);
      if (error.response.status == 500) {
        toastError("Check your internet");
      } else {
        toastError("Incorrect credentials");
      }
    }
  };

  return (
    <section className="auth__page">
      {
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        mutation.isPending && <Loader />
      }
      <div className="topHeader flex-row">
        <div className="logo__name">
          <h1>
            <Link to={"/home"}>
              Learn<span>iverse</span>
            </Link>{" "}
          </h1>
        </div>
        <div className="newUser__link">
          <span>New User? </span>
          <Link to={"/signup"}>Sign Up</Link>
        </div>
      </div>
      <div className="main__page flex-row">
        <div className="img__bg">
          <img src={WelcomePage.intro} alt="" />
        </div>
        {/* FORM AUTH */}
        <div className="form__container">
          <div className="form__header">
            <h2>Login to your account</h2>
          </div>

          <form onSubmit={onSubmit}>
            {/* INPUT CONTAINERS */}
            <div className="input__field">
              <i className="bi bi-person-fill-lock"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={emailAccount}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="input__field">
              <i className="bi bi-lock-fill"></i>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={pwd}
                onChange={handleOnChange}
                required
              />
            </div>
            {/* INPUT CONTAINERS */}

            {/* BUTTON */}
            <div className="lastBtn_sub">
              <div className="submit__btn ">
                <button>Login</button>
              </div>
            </div>
          </form>
          {/* <button>Continue Google</button> */}
        </div>
      </div>
    </section>
  );
};

export default Login;
