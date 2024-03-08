import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoanForm from "../Components/LoanForm";
import IncomeForm from "../Components/IncomeForm";
import ApplyConfirm from "../Components/ApplyConfirm";

export default function Apply() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [warning, setWarning] = useState({});
  const [missingFields, setMissingFields] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const backBtn = useRef(null);
  const nextBtn = useRef(null);
  const submitBtn = useRef(null);
  const step1Btn = useRef(null);
  const step2Btn = useRef(null);

  useEffect(() => {
    document.querySelector(".form-container").style.display = "none";
    document.querySelector(".apply-nav-item").style.borderBottom =
      "2px solid #182d09";
    document.querySelector(".loanForm").style.display = "none";
    submitBtn.current.style.display = "none";
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    submitBtn.current.disabled = true;
    let userID;

    if(localStorage.getItem('userInfo') === null) {
      userID = null;
      setIsLogged(false);
    } else {
      userID = JSON.parse(localStorage.getItem('userInfo'))[0].userid;
      setIsLogged(true);
    }

    const inputValues = [
      e.target[0].value,
      e.target[1].value,
      e.target[2].value,
      e.target[3].value,
      e.target[4].value,
      e.target[5].value,
    ];
    const submission = {
      UserID: userID,
      creditScore: e.target[0].value,
      income: e.target[1].value,
      expenses: e.target[2].value,
      loanType: e.target[3].value,
      loanAmount: e.target[4].value,
      loanLength: e.target[5].value,
      incomeDebtRatio: e.target[2].value / e.target[1].value,
      applyDate: new Date(),
    };

    fetch("http://localhost:4000/api/evaluateLoan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          if (
            document.querySelector(".warningBox").classList.contains("d-none")
          ) {
            document.querySelector(".warningBox").classList.remove("d-none");
          }
          let warningMessage = {
            title: "Oops!",
            message:
              "Looks like you're missing something. Please fill out the following fields: ",
            fields: [],
          };
          inputValues.forEach((value, index) => {
            if (value === "") {
              warningMessage.fields.push(e.target[index].name);
              e.target[index].classList.add("is-invalid");
            }
            setWarning(warningMessage);
            setMissingFields(true);
            submitBtn.current.disabled = false;
          });
        } else {
          if(isLogged) {
            submitBtn.current.disabled = true;
            document.querySelector("#loan-eval-form").reset();
            return navigate('/apply/success', { state: { data: result } });
          }
          navigate('/apply/success', { state: { data: result } });
          document.querySelector("#loan-eval-form").reset();
          submitBtn.current.disabled = true;
        }
      })
      .catch((error) => console.log("error", error));
  }

  function validInput(e) {
    e.target.classList.remove("is-invalid");
  }

  function startEval() {
    document.querySelector(".form-container").style.display = "block";
    document.querySelector(".main-header").style.display = "none";
    document.querySelector(".main-footer").style.display = "none";
    document.querySelector(".chat").style.display = "none";
    document.querySelector(".openChatBtn").style.display = "none";
    document.querySelector(".apply-start").style.display = "none";
  }

  function showStep1() {
    document.querySelector(".loanForm").style.display = "none";
    document.querySelector(".incomeForm").style.display = "block";
    backBtn.current.style.display = "none";
    nextBtn.current.style.display = "block";
    submitBtn.current.style.display = "none";
    setStep(1);
  }

  function showStep2() {
    document.querySelector(".loanForm").style.display = "block";
    document.querySelector(".incomeForm").style.display = "none";
    nextBtn.current.style.display = "none";
    backBtn.current.style.display = "block";
    submitBtn.current.style.display = "block";
    setStep(2);
  }

  useEffect(() => {
    if (step === 1) {
      showStep1();
      step1Btn.current.style.color = "#a18c7d";
      step2Btn.current.style.color = "#182d09";
      step1Btn.current.style.borderBottom = "1px solid #a18c7d";
      step2Btn.current.style.borderBottom = "1px solid black";
    } else {
      showStep2();
      step2Btn.current.style.color = "#a18c7d";
      step1Btn.current.style.color = "#182d09";
      step2Btn.current.style.borderBottom = "1px solid #a18c7d";
      step1Btn.current.style.borderBottom = "1px solid black";
    }
  }, [step]);

  return (
    <div class="container mb-5 d-flex flex-column flex-grow-1 justify-content-between">
      <ApplyConfirm startEval={startEval} />
      <div class="form-container">
        <button
          class="btn btn-danger mt-2"
          type="button"
          onClick={() => {
            window.location = "/apply";
          }}
        >
          Exit
        </button>
        <div class="row my-5">
          <div class="col">
            <button
              ref={step1Btn}
              class="step-btn w-100"
              onClick={() => showStep1()}
            >
              Your Information
            </button>
          </div>
          <div class="col">
            <button
              ref={step2Btn}
              class="step-btn w-100"
              onClick={() => showStep2()}
            >
              Loan Information
            </button>
          </div>
        </div>
        <div
          class={
            missingFields
              ? "p-3 border warningBox border-2 bg-danger bg-opacity-10 border-danger-subtle text-danger mb-3"
              : "warningBox d-none"
          }
        >
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            style={{ float: "right" }}
            onClick={() =>
              document.querySelector(".warningBox").classList.add("d-none")
            }
          ></button>
          <h1>{warning.title}</h1>
          <p>{warning.message}</p>
          <ul>
            {warning.fields
              ? warning.fields.map((field) => <li>{field}</li>)
              : null}
          </ul>
        </div>
        <form
          onSubmit={(e) => handleSubmit(e)}
          id="loan-eval-form"
          class="justify-content-between"
        >
          <IncomeForm isValid={validInput} />
          <LoanForm isValid={validInput} />
          <button
            type="button"
            ref={backBtn}
            class="float-start form-btns"
            onClick={() => setStep(1)}
          >
            Back
          </button>
          <button
            type="button"
            ref={nextBtn}
            class="float-end form-btns"
            onClick={() => setStep(2)}
          >
            Next
          </button>
          <button type="submit" ref={submitBtn} class="submitBtn float-end form-btns">
            Submit
          </button>
        </form>
      </div>
      <style jsx>{`
        .step-btn {
          background-color: transparent;
          border: none;
          border-bottom: 1px solid black;
        }

        .submitBtn.disabled {
          opacity: 0.2;
        }

        .submitBtn.disabled:hover {
          background-color: transparent;
          color: black;
        }

        .form-btns {
          background-color: transparent;
          border: 1px solid #182d09;
          padding: 5px 15px;
          border-radius: 5px;
          transition: all 0.3s;
        }

        .form-btns:hover {
          background-color: #182d09;
          color: white;
          transition: all 0.3s;
        }
      `}</style>
    </div>
  );
}
