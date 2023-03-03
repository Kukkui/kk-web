import { useEffect, useState, useMemo, useCallback } from "react";
import { Input, Card, Button } from 'antd';

// const App: React.FC = () => (
//   <>
//     <Input placeholder="input with clear icon" allowClear onChange={onChange} />
//     <br />
//     <br />
//     <TextArea placeholder="textarea with clear icon" allowClear onChange={onChange} />
//   </>
// );

export default function GA() {
  const [audienceName, setAudienceName] = useState('');
  const [audienceDescription, setAudienceDescription] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const { TextArea } = Input;
  const endpoint = `https://analyticsadmin.googleapis.com/v1beta`

  const CLIENT_ID = '1035301278821-mnlpf5pa5qbgm3g3qo6a97k246at79b8.apps.googleusercontent.com'

  const onChange = (e, type) => {
    // console.log(e.target.value);
    if (type === 'name') {
      setAudienceName(e.target.value);
    }

    if (type === 'description') {
      setAudienceDescription(e.target.value);
    }
  };
  
  const syncGoogleAnalyticsAudience =  async () => {

    console.log('CALL syncGoogleAnalyticsAudience!');

    await googleLoginAuth();
    await getAnalyticsAccount();
    
    alert(audienceName);
    alert(audienceDescription);

    getAccounts();
  }

  // const getAccounts = () => {

    // fetch(`${endpoint}/accounts`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${accessToken}`
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {

    //     console.log('Success: ', data)

    //     // setAccounts(data?.accounts);

    //     // if (data?.error?.code === 401) {
    //     //   refreshToken()
    //     // }
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });

  // }
  const getAccounts = () => {

    fetch(`${endpoint}/accounts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
      .then((response) => response.json())
      .then((data) => {

        console.log('Success: ', data)

        console.log(data?.accounts);

        if (data?.error?.code === 401) {
          refreshToken()
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }

  const getAnalyticsAccount = () => {
    // GET https://www.googleapis.com/analytics/v3/management/accountSummaries
    const analyticsBasicSummaryEndpoint = 'https://www.googleapis.com/analytics/v3/management/accountSummaries';
    fetch(`${analyticsBasicSummaryEndpoint}`, {
      mode: 'no-cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
      .then((response) => response.json())
      .then((data) => {

        console.log('Success: ', data)

        // setAccounts(data?.accounts);

        if (data?.error?.code === 401) {
          refreshToken()
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  // const endpoint = 'https://www.googleapis.com/analytics/v3'

  const SCOPES = useMemo(() => [
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/analytics.edit',
    'https://www.googleapis.com/auth/analytics.manage.users',
    'https://www.googleapis.com/auth/analytics.manage.users.readonly'
  ].join(' '), []);

  const [client, setClient] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [properties, setProperties] = useState([]);


  // function revokeToken() {
  //   window?.google?.accounts.oauth2.revoke(accessToken, () => { console.log('access token revoked') });
  // }

  // const getAccounts = () => {

  //   fetch(`${endpoint}/accounts`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${accessToken}`
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {

  //       console.log('Success: ', data)

  //       setAccounts(data?.accounts);

  //       if (data?.error?.code === 401) {
  //         refreshToken()
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });

  // }

  // const getWebProperties = (accountId = '~all', webPropertyId = 'G-QWCJ58H7VT') => {


  //   // const url = webPropertyId
  //   //   ? `${endpoint}/management/accounts/${accountId}/webproperties/${webPropertyId}`
  //   //   : `${endpoint}/management/accounts/${accountId}/webproperties`;

  //   const url = `${endpoint}/properties`
  //     + `/?filter=ancestor:${accountId}`

  //   console.log('===getWebProperties===', url)

  //   fetch(url, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${accessToken}`
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {

  //       console.log('Success: ', data?.properties);

  //       if (data?.error?.code === 401) {
  //         refreshToken()
  //       }

  //       setProperties(data?.properties)
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // }

  // const getDimensions = () => {

  //   const customDimensionsUrl = `${endpoint}/management`
  //     + `/accounts/${ACCOUNT_ID}`
  //     + `/webproperties/${WEB_PROPERTY_ID}`
  //     + '/customDimensions';

  //   fetch(customDimensionsUrl, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${accessToken}`
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {

  //       console.log('Success: ', data)
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // }


  const refreshToken = () => client?.requestAccessToken();

  const googleLoginAuth = () => {
    const w = window;
    const google = w?.google;
    if (!google) {
      console.error("no google");
      return undefined;
    }

    alert('TEST');
    const client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse) => {
        console.log('access token request success:')
        console.log('===google===', google)
        setAccessToken(tokenResponse.access_token);
        localStorage.setItem('authToken', JSON.stringify(tokenResponse))
      },
    });

    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      alert('ALREADY HAVE TOKEN!');
      console.log('authToken...');
      console.log(authToken);
      const tokenResponse = JSON.parse(authToken);
      setAccessToken(tokenResponse.access_token);
    } else if (!accessToken) {
      alert('REQUEST ACCESS TOKEN!');
      console.log('access token request')
      client.requestAccessToken();
    }

    setClient(client);

  }

  // useEffect(() => {
    

  // }, [accessToken, SCOPES, CLIENT_ID]);


  return (
    // <div>
    //   <h3 className="text-center mb-6">Google Analytics 4</h3>


    //   <button
    //     className="inline-block rounded border border-orange-500 px-12 py-3 text-sm font-medium text-orange-600 hover:bg-orange-600 hover:text-white focus:outline-none focus:ring active:bg-orange-500"
    //     type="button"
    //     onClick={()=>{}}>
    //     Get Account
    //   </button>

    //   <input title="AUDIENCE NAME" id="GoogleAnalyticsAudienceName" placeholder="GoogleAnalytics Audience Name">
    //   </input>

    //   <input title="AUDIENCE DESCRIPTION" id="GoogleAnalyticsAudienceDescription" placeholder="GoogleAnalytics Audience Description">
    //   </input>

    //   <button title="SYNC">

    //   </button>

    //   {accounts?.length && (
    //     <div id="accounts">
    //       <ul>
    //         {accounts?.map(({ name: accountId, displayName: accountName, createTime, childLink }) => (
    //           <li key={`account_${accountId}`}>
    //             <button type="button" onClick={() => {}}>
    //               <div className="border-2 border-gray-200 shadow-md rounded-md text-left flex flex-col px-4 pt-6 mx-1 my-2 w-[300px] hover:bg-gray-500 relative">
    //                 <p className="text-sm text-gray-400 absolute top-1 left-2">{accountId}</p>
    //                 <p className="text-[12px] text-gray-400 absolute top-1 right-2">{new Date(createTime).toLocaleString()}</p>
    //                 <p>{accountName}</p>
    //               </div>
    //             </button>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}



    // </div>
    <>
    <Card title="TEST SYNC GOOGLE ANALYTICS ADS AUDIENCE" style={{width: '80%', margin: 'auto', backgroundColor: 'lightblue'}}>
    <Input placeholder="GA Audience Name" allowClear onChange={(e) => onChange(e, 'name')} />
    <br />
    <br />
    <TextArea placeholder="GA Audience Description" allowClear onChange={(e) => onChange(e, 'description')} />
    {/* <Button> SYNC </Button> */}
    <br/>
    <br/>
    <Button type="primary" block onClick={syncGoogleAnalyticsAudience}>
      SYNC
    </Button>
    </Card>

{/*     
    <Input placeholder="GA Audience Name" allowClear onChange={(e) => onChange(e, 'name')} />
    <br />
    <br />
    <TextArea placeholder="GA Audience Description" allowClear onChange={(e) => onChange(e, 'description')} /> */}
    </>
  )
}