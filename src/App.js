import React, { useState } from "react";
import axios from "axios";
import './App.css';
import { Button } from '@mui/material'
import Modal from 'react-modal';

const PaystackComponent = () => {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ referenceData, setReferenceData ] = useState({});
  
  const referenceArray = ['jx9uivppdv', '1624525728552', '1624369180259', '1624040852566', '1623704470438', '1623704470438'];

  function handleClick() {
    const randomIndex = Math.floor(Math.random() * referenceArray.length);
    const randomString = referenceArray[randomIndex];
    setReferenceCode(randomString);
  }

  const initializePayment = async () => {
    try {
      const response = await axios.post("https://api.paystack.co/transaction/initialize", {
        amount: amount,
        email: email,
      }, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
        },
      });
      const { data } = response;
      window.location.href = data.data.authorization_url;
    } catch (error) {
      console.log(error);
    }
  };

  const verifyTransaction = async (reference) => {
    try {
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
        },
      });
      const { data } = response;
      console.log(data)
      setReferenceData(data?.data);
      handleModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleModal = () => {
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  }

  return (
    <div className='container'>
      <h1>Paystack API Test</h1>
      <form>
        <label htmlFor="amount">Amount:</label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button variant='contained' color='secondary' onClick={initializePayment}>Initialize Payment</Button>
      </form>
      <br />
      <form>
        <p>This is to show previous transactions usin g reference number/code</p>
        <label htmlFor="referenceCode">reference code:</label>
        <br />
        {/* <input type="text" id="referenceCode" value={referenceCode} onChange={(e) => setReferenceCode(e.target.value)} /> */}
        <Button color='primary' variant='contained' onClick={handleClick}>Select reference</Button>
        <br />
        <Button color='primary' variant='contained' onClick={() => verifyTransaction(referenceCode)}>Verify Transaction</Button>

      </form>

      <Modal onRequestClose={closeModal} isOpen={modalIsOpen}>
        <Button onClick={closeModal}>Close</Button>
        <p>Amount: {referenceData?.amount}</p>
        <p>Channel: {referenceData?.channel}</p>
        <p>Currency: {referenceData?.currency}</p>
        <p>Reference: {referenceData?.reference}</p>
      </Modal>
    </div>
  );
};

export default PaystackComponent;
