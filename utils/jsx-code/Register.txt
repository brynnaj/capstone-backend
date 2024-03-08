import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import logo from "../Assets/Images/loaniq-logo.png";

export default function Register() {
  const form = useRef(null);
  const warningMessage = useRef(null);
  let location = useLocation();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [emailaddress, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');

  useEffect(() => {
    if (location.pathname === "/register") {
      document.querySelector("nav").style.display = "none";
      document.querySelector("footer").style.display = "none";
      document.querySelector(".chat").style.display = "none";
      document.querySelector(".openChatBtn").style.display = "none";
    }

    if (localStorage.getItem("userInfo") !== null) {
      window.location= "/"
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    for(let i = 0; i < form.current.length-1; i++) {
      if(form.current[i].value === '') {
        form.current[i].classList.add('is-invalid');
      }
    }

    if(password !== confirmpassword) {
      warningMessage.current.innerHTML = 'Passwords do not match.';
    }
    const response = await fetch('http://localhost:4000/newuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstname, lastname, emailaddress, password, confirmpassword})
    })
    .then(response => response.json())
    .then(data => {
      if(data.error) {
        warningMessage.current.innerHTML = data.error;
        document.querySelector('.warningBox').classList.remove('d-none');
        return;
      } else {
        window.location = '/login';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      document.querySelector('.warningBox').classList.remove('d-none');
    });
  };
  

  return (
    <div>
      <section class="h-100">
        <div class="container h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="z-1 col-xl-10">
              <div class="rounded-3 text-black">
                <div class="row g-0 justify-content-center align-items-center">
                  <div class="col-lg-6 w-100">
                    <div class="card-body p-md-5 mx-md-4">
                      <div class="text-center mb-3">
                        <a href="/">
                          <img
                            src={logo}
                            style={{ width: "100px" }}
                            alt="logo"
                          />
                        </a>
                      </div>
                      <div class="p-3 border warningBox border-2 bg-danger bg-opacity-10 border-danger-subtle text-danger mb-3 d-none">
                          <button
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                            style={{ float: "right" }}
                            onClick={() =>
                              document
                                .querySelector(".warningBox")
                                .classList.add("d-none")
                            }
                          ></button>
                          <p class="m-0" ref={warningMessage}>Please fill out the missing forms.</p>
                        </div>
                      <form ref={form} onSubmit={handleSubmit}>
                        <p>Please sign-up to create your account</p>

                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-floating mb-4">
                              <input
                                type="text"
                                name="First Name"
                                class="form-control"
                                id="floatingInput"
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e) => {setFirstname(e.target.value); e.target.classList.remove('is-invalid')}}
                              />
                              <label for="floatingInput">First Name</label>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-floating mb-4">
                              <input
                                type="text"
                                name="Last Name"
                                class="form-control"
                                id="floatingInput"
                                placeholder="Last Name"
                                value={lastname}
                                onChange={(e) => {setLastname(e.target.value); e.target.classList.remove('is-invalid')}}
                              />
                              <label for="floatingInput">Last Name</label>
                            </div>
                          </div>
                        </div>

                        <div class="form-floating mb-4">
                          <input
                            type="email"
                            name="Email Address"
                            class="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                            value={emailaddress}
                            onChange={(e) => {setEmail(e.target.value); e.target.classList.remove('is-invalid')}}
                          />
                          <label for="floatingInput">Email address</label>
                        </div>

                        <div class="form-floating mb-4">
                          <input
                            type="password"
                            name="Password"
                            class="form-control"
                            id="floatingInput"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {setPassword(e.target.value); e.target.classList.remove('is-invalid')}}
                          />
                          <label for="floatingInput">Password</label>
                        </div>

                        <div class="form-floating mb-4">
                          <input
                            type="password"
                            class="form-control"
                            name="Confirm your password"
                            id="floatingInput"
                            placeholder="Confirm Password"
                            value={confirmpassword}
                            onChange={(e) => {setConfirmpassword(e.target.value); e.target.classList.remove('is-invalid')}}
                          />
                          <label for="floatingInput">Confirm Password</label>
                        </div>

                        <div class="text-center pt-1 mb-5 pb-1">
                          <button
                            class="btn btn-primary btn-block fa-lg mb-3 w-100"
                            type="submit"
                          >
                            Sign-up
                          </button>
                          <p class="small or-span" href="#!">
                            <span>OR</span>
                          </p>
                          <a class="p" href="/login">
                            <button type="button" class="btn loginRedirect">
                              Login
                            </button>
                          </a>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>
        {`
          .or-span {
            width: 100%;
            text-align: center;
            border-bottom: 1px solid #000;
            line-height: 0.1em;
            margin: 10px 0 20px;
          }

          .or-span span {
            background: #f7f3e8;
            padding: 0 10px;
          }

          .loginRedirect {
            background-color: transparent;
            color: #000;
            border: 1px solid #182d09;
          }

          .loginRedirect:hover {
            background-color: #182d09;
            color: #fff;
          }
        `}
      </style>
    </div>
  );
}
