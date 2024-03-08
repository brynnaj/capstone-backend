import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../Assets/Images/loaniq-logo.png";

export default function Login() {
  let location = useLocation();
  const [emailaddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (location.pathname === "/login") {
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
    const response = await fetch("http://localhost:4000/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailaddress, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        localStorage.setItem("userInfo", JSON.stringify(data));
        window.location = "/user/dashboard"; // Redirect to /user/dashboard
      })
      .catch((error) => {
        console.error("Error:", error);
        document.querySelector(".warningBox").classList.remove("d-none");
      });
  };
  return (
    <div className="container-fluid py-3 my-auto mx-auto">
      <section class="h-100">
        <div class="container h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="z-1 col-xl-10">
              <div class="rounded-3 text-black">
                <div class="row g-0">
                  <div class="col-lg-6">
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

                      <form onSubmit={handleSubmit}>
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
                          <p class="m-0">Your email address or password is incorrect. Please try again.</p>
                        </div>
                        <p>Please login to your account</p>

                        <div class="form-floating mb-4">
                          <input
                            type="email"
                            class="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                            value={emailaddress}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <label for="floatingInput">Email address</label>
                        </div>

                        <div class="form-floating mb-4">
                          <input
                            type="password"
                            class="form-control"
                            id="floatingInput"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <label for="floatingInput">Password</label>
                        </div>

                        <div class="text-center pt-1 mb-5 pb-1">
                          <button
                            class="btn btn-primary btn-block fa-lg mb-3 w-100"
                            type="submit"
                          >
                            Log in
                          </button>
                        </div>
                        <div class="d-flex align-items-center justify-content-center pb-4">
                          <p class="mb-0 me-2">Don't have an account?</p>
                          <a href="/register">
                            <button
                              type="button"
                              class="btn btn-outline-danger"
                            >
                              Create new
                            </button>
                          </a>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="col-lg-6 d-flex align-items-center gradient-custom-2">
                    <div class="text-black px-3 py-4 p-md-5 mx-md-4">
                      <h4 class="mb-4">LoanIQ makes it easy.</h4>
                      <p class="small mb-0">
                        Tired of complicated loan services? LoanIQ allows you to
                        streamline the process of applying for a loan. Our tools
                        utilize the latest technology to make the process as
                        quick and easy as possible. Get started today!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="wave">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
      <style jsx>{`
        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }

        .wave svg {
          position: relative;
          display: block;
          width: calc(120% + 1.3px);
          height: 190px;
        }

        .wave .shape-fill {
          fill: #182d09;
        }

        @media screen and (max-width: 991px) {
          .wave {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
