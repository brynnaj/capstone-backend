import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import DashboardHeader from "../Components/DashboardHeader";
import { RxHamburgerMenu } from "react-icons/rx";
import LoanCardGrid from "../Components/LoanCardGrid";

export default function UserDashboard() {
  const location = useLocation();
  const [showSideNav, setShowSideNav] = useState(false);
  const adminDashBtn = useRef(null);
  const [grid, setGrid] = useState("My Loans");

  function changeView(e) {
    setGrid(e);
  }

  useEffect(() => {
    if (localStorage.getItem("userInfo") === null) {
      window.location = "/login";
    }

    if (JSON.parse(localStorage.getItem("userInfo"))[0].usertype === "admin") {
      adminDashBtn.current.classList.remove("d-none");
    }

    if (location.pathname === "/user/dashboard") {
      document.querySelector(".main-header").style.display = "none";
      document.querySelector(".main-footer").style.display = "none";
      document.querySelector(".chat").style.display = "none";
      document.querySelector(".openChatBtn").style.display = "none";
    }
  }, []);

  return (
    <div>
      <header class="d-flex w-100 justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <RxHamburgerMenu
            onClick={() => {
              setShowSideNav(!showSideNav);
            }}
          />
          <h4 class="welcome-msg">User Dashboard</h4>
        </div>
        <div>
          <a
            href="/admin/dashboard"
            ref={adminDashBtn}
            class="back-home-btn me-3 d-none"
          >
            <button class="btn back-home-btn btn-outline-dark float-right">
              Admin Dashboard
            </button>
          </a>
          <a href="/" class="back-home-btn">
            <button class="btn back-home-btn btn-outline-dark float-right">
              Back to LoanIQ Home
            </button>
          </a>
        </div>
      </header>
      <DashboardHeader
        show={showSideNav}
        links={["My Loans", "My Payments"]}
        changeView={changeView}
        setSideNav={setShowSideNav}
      />

      <LoanCardGrid selectGrid={grid} />
      <style jsx>{`
        .welcome-msg {
          margin: 0 15px;
        }

        header {
          background: #e2d2b6;
          padding: 25px;
          font-family: "Poppins", sans-serif;
        }

        .btn-outline-dark {
          border: 1px solid #182d09;
          border-radius: 20px;
        }

        .btn-outline-dark:hover {
          border: 1px solid #182d09;
          background-color: #182d09;
        }

        .side-nav {
          width: 360px;
          background: #e2d2b6;
          position: absolute;
          height: 95vh;
          padding: 0 30px;
          transition: all 1s;
          left: -100%;
        }

        .side-nav.active {
          left: 0;
          transition: all 0.7s;
        }

        ul {
          padding: 0;
        }

        ul li {
          list-style-type: none;
          margin: 5px 0;
        }

        ul li a {
          color: #182d09;
          text-decoration: none;
          font-size: 1.5rem;
          display: block;
          padding: 10px 15px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        ul li a:hover,
        ul li a.active {
          background-color: #a18c7d;
          transition: all 0.2s;
        }

        header svg {
          color: #182d09;
          font-size: 30px;
          cursor: pointer;
        }

        @media screen and (max-width: 360px) {
          .back-home-btn {
            display: none;
          }

          .side-nav {
            width: 0;
          }

          .side-nav.active {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}