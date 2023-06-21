import React, { useState } from 'react';

const DropForm = () => {
  const mockSampleKey = 'cx_mobilePhone';
  const mockSampleCustomersValue = {
    cx_Name: "kukkui",
    cx_mobilePhone: "1122332211"
  };
  const mockSampleTrackingValue = {
    test: "TestTracking"
  };
  const mockSampleFormValue = {
    test: "TestForm"
  };
  
  const [keyState, setKeyState] = useState(mockSampleKey);
  const [customersState, setCustomersState] = useState(JSON.stringify(mockSampleCustomersValue));
  const [trackingState, setTrackingState] = useState(JSON.stringify(mockSampleTrackingValue));
  const [formState, setFormState] = useState(JSON.stringify(mockSampleFormValue));
  const [updateCustomersOptionState, setUpdateCustomersOptionState] = useState(false);
  const [useOptionsState, setUseOptionsState] = useState(false);

  const formSubmit = (event) => {
    event.preventDefault();

    const options = {
      updateCustomer: updateCustomersOptionState
    };

    if (useOptionsState) {
      console.log('Case: useOptionState!');
      // eslint-disable-next-line no-undef
      cxIdentify(keyState, JSON.parse(customersState), JSON.parse(trackingState), JSON.parse(formState), options);
    } else {
      console.log('Case: Not useOptionState! (Default options value will be sent to dropform api)');
      // eslint-disable-next-line no-undef
      cxIdentify(keyState, JSON.parse(customersState), JSON.parse(trackingState), JSON.parse(formState));
    }

  };

  return (
    <div>
      <h1>DropForm</h1>
      <br />
      <form onSubmit={formSubmit}>
      <input 
      type="text" 
      id="key" 
      placeholder='key' 
      style={{ width: '50%', height: '30px' }} 
      value={keyState}
      onChange={(e) => setKeyState(e.target.value)}
      />
      <br/> 
      <br/> 
      <textarea id="customers" placeholder='customers' style={{ width: '50%', height: '200px' }} value={customersState} onChange={(e) => setCustomersState(e.target.value)}/>
      <br/>
      <textarea id="tracking" placeholder='tracking' style={{ width: '50%', height: '200px' }} value={trackingState} onChange={(e) => setTrackingState(e.target.value)}/>
      <br/>
      <textarea id="form" placeholder='form' style={{ width: '50%', height: '200px' }} value={formState} onChange={(e) => setFormState(e.target.value)}/>
      <br/>
      <br/>

      <p>STEP 1: USE OPTIONS PS.DO NOT CHECKED TO TEST DEFAULT DROP FORM</p>
      <input type="checkbox" id="useOptions" value={useOptionsState} onChange={(e) => {
        setUseOptionsState(e.target.checked);
        }}/>
      <br/>
      <br/>

      <p>STEP 2: SET updateCustomersOption</p>
      <input type="checkbox" id="updateCustomersOption" value={updateCustomersOptionState} onChange={(e) => {
        setUpdateCustomersOptionState(e.target.checked);
        }}/>
      <br/>
      <br/>

      <button type="submit">SUBMIT DROP FORM</button>
      </form>
    </div>
  );
};

export default DropForm;