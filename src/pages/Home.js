import React, { useState } from 'react';

const Home = () => {
  const [key, setKey] = useState('');
  const [customers, setCustomers] = useState('');
  const [tracking, setTracking] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    window.cxOpenTicket(key, JSON.parse(customers), JSON.parse(tracking));
  };
  return (
    <div>
      <h1>Home1</h1>
      <br />
      <b>cxOpenTicket</b>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="cx_identify_key">Key:</label>
        <input id="cx_identify_key" value={key} onChange={(e) => setKey(e.target.value)} />
        <br />
        <label htmlFor="cx_identify_customers">Customers:</label>
        <textarea
          style={{width: '1000px', height: '150px'}}
          id="cx_identify_customers"
          value={customers}
          onChange={(e) => setCustomers(e.target.value)}
        />
        <br />
        <label htmlFor="cx_identify_tracking">Ticket:</label>
        <textarea
          style={{width: '1000px', height: '150px'}}
          id="cx_identify_tracking"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
        />
        <br />
        <button type="submit">Submit cx openTicket</button>
      </form>
    </div>
  );
};

export default Home;