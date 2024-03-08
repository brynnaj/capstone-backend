import React, {useState, useEffect} from 'react'
import Modal from 'react-modal'

function countdown(endDate) {
    const today = new Date()
    const time = endDate - today
    const days = Math.floor(time / (1000 * 60 * 60 * 24))
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((time % (1000 * 60)) / 1000)
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

function Loan(props) {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [endDate, setEndDate] = useState(new Date())
    const [timeLeft, setTimeLeft] = useState(countdown(new Date(props.endDate)))
    const minimum = (props.loanAmount / props.loanTerm)

    useEffect(()=>{
        setInterval(()=>setTimeLeft(countdown(new Date(props.endDate))),1000)
    },)

    const openModal = () => {setModalIsOpen(true)}
    const closeModal = () => {setModalIsOpen(false)}
    function makePayment(e){
        fetch(`http://localhost:4000/makePayment`, {
            body: JSON.stringify({LoanID: props.loanID, AmountPaid: e.target.previousSibling.value}), 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}
        })
        window.location.reload()
    }
  return (
    <div className='loan'>
        <h1>{props.loanType}</h1>
        <div>Loan Amount: {props.loanAmount}</div>
        <div>Loan Term: {props.loanTerm} months</div>
        <div>Amount Paid: {props.amountPaid}</div>
        <div>Next payment due: {timeLeft}</div>
        <button onClick={openModal}>Make Payment</button>
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
            <h2>Make Payment</h2>
            <div>Minimum Payment:  ${minimum.toFixed(2)}</div>
            <div>End date: {String(new Date(props.endDate))}</div>
            <form>
                <input type="text" placeholder="Enter amount" />
                <button onClick={makePayment}>Pay</button>
            </form>
            <button onClick={closeModal}>Close</button>
        </Modal>
    </div>
  );
}

export default function Payments() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/getLoans`, {
      body: JSON.stringify({
        UserID: JSON.parse(localStorage.getItem("userInfo"))[0].userid,
      }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setLoans(data));
  }, []);
  return (
    <div>
      {loans.length ? loans.map(loan => {
        return <Loan loanID={loan.loanid} loanType={loan.loan_type} loanAmount={loan.loan_amount} loanTerm={loan.loan_term} amountPaid={loan.amount_paid} endDate={Number(new Date(loan.applyDate)) + (Number(loan.loan_term) * 2629800000)} nextPayment={"30 Days"}/>
      }) : <h1>No loans found</h1>}
      <style jsx>
        {`
          .loan {
            margin-top: 50px;
            border: 1px solid #000;
            padding: 20px;
            background-color: #e2d2b6;
            border-radius: 10px;
            width: 300px;
            margin: 10px;
          }
          .loan button {
            border-radius: 10px;
            padding: 5px;
            background-color: #182d09;
            color: white;
          }
        `}
      </style>
    </div>
  );
}
