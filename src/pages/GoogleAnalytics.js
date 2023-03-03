import { useEffect, useState, useMemo, useCallback } from "react";
import { Input, Card, Button, Select, message } from 'antd';

export default function GA() {
  const [audienceName, setAudienceName] = useState('');
  const [audienceDescription, setAudienceDescription] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accountSummary, setAccountSummary] = useState([]);
  const [isShowAnalyticSelection, setIsShowAnalyticSelection] = useState(false);
  const [analyticsOptions, setAnalyticsOptions] = useState([]);
  const [selectedAnalytic, setSelectedAnalytic] = useState({});
  const [isShowPropertiesSelection, setIsShowPropertiesSelection] = useState(false);
  const [propertiesOptions, setPropertiesOption] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState({});
  const [client, setClient] = useState(null);
  const [isShowSyncButton, setIsShowSyncButton] = useState(false);
  const [isCompleteSignIn, setIsCompleteSignIn] = useState(false);
  const { TextArea } = Input;
  // const endpoint = `https://analyticsadmin.googleapis.com/v1beta`

  const CLIENT_ID = '1035301278821-mnlpf5pa5qbgm3g3qo6a97k246at79b8.apps.googleusercontent.com'

  const onChange = (e, type) => {
    if (type === 'name') {
      setAudienceName(e.target.value);
    }

    if (type === 'description') {
      setAudienceDescription(e.target.value);
    }
  };

  const analyticsSelection = (analyticSelected) => {
    const tempSelectedAnalytic = analyticsOptions?.find((eachAnalytic) => eachAnalytic?.value === analyticSelected)
    
    setIsShowPropertiesSelection(true);
    setPropertiesOption([]);
    setSelectedProperty(null);
    setSelectedAnalytic(tempSelectedAnalytic);
    setPropertiesOptions(analyticSelected);
  }

  const setPropertiesOptions = (analyticsSelected) => {
    const analyticsInfo = accountSummary?.find((eachAccount) => eachAccount?.account === analyticsSelected);
    const propertiesListInsideSelectedAnalytics = analyticsInfo?.propertySummaries || [];
    const tempPropertiesOptions = propertiesListInsideSelectedAnalytics?.map((eachPropertiesOption)=>{
      return {
        label: `PROPERTY: ${eachPropertiesOption?.displayName} (${eachPropertiesOption?.property?.split('/')[1]})`,
        value:  eachPropertiesOption?.property,
      }
    });

    setPropertiesOption(tempPropertiesOptions);
  }
  
  const logInProcess =  async () => {
    await googleLoginAuth();
  }

  useEffect(()=> {
    if (accessToken) {
      getAnalyticsAccount();
      setIsCompleteSignIn(true);
    }

    if (accountSummary?.length) {
      setIsShowAnalyticSelection(true);
      const tempAnalyticsOptions = accountSummary?.map((eachAccount) => {
        return {
          label: `ANALYTICS ACCOUNT: ${eachAccount?.displayName} (${eachAccount?.account?.split('/')[1]})`,
          value: eachAccount?.account,
        }
      })
      setAnalyticsOptions(tempAnalyticsOptions);
    }
  }, [accessToken, accountSummary]);

  const getAnalyticsAccount = () => {
    // GET https://www.googleapis.com/analytics/v3/management/accountSummaries
    const analyticsBasicSummaryEndpoint = 'https://analyticsadmin.googleapis.com/v1beta/accountSummaries';
    fetch(`${analyticsBasicSummaryEndpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
      .then((response) => response.json())
      .then((data) => {

        console.log('Success: ', data)

        if (data?.error?.code === 401) {
          refreshToken()
        } else {
          setAccountSummary(data?.accountSummaries);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const createGoogleAnalyticsAudience = (payload) => {
    const {
      audienceName,
      audienceDescription,
      propertyValue
    } = payload;

    const propertyId = propertyValue?.split('/')[1];

    const analyticsBasicSummaryEndpoint = `https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/audiences`;
    fetch(`${analyticsBasicSummaryEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: `{
        "description":"${audienceDescription}",
        "displayName":"${audienceName}",
        "eventTrigger":{
           "eventName":"PAGE_VIEW",
           "logCondition":"AUDIENCE_JOINED"
        },
        "exclusionDurationMode":"EXCLUDE_TEMPORARILY",
        "filterClauses":[
           {
              "clauseType":"INCLUDE",
              "simpleFilter":{
                 "scope":"AUDIENCE_FILTER_SCOPE_WITHIN_SAME_EVENT",
                 "filterExpression":{
                    "andGroup":{
                    }
                 }
              }
           }
        ],
        "membershipDurationDays": 0
      }`
    })
      .then((response) => response.json())
      .then((data) => {

        // console.log('Success: ', data)
        message.success('COMPLETE SYNC GA ADS AUDIENCE! PLEASE RECHECK YOUR GA AUDIENCE DASHBOARD');
      })
      .catch((error) => {
        // console.error('Error:', error);
        message.error('FAILED SYNC GA ADS AUDIENCE! PLEASE REFRESH AND RESYNC AGAIN!');
      });
  }

  const SCOPES = useMemo(() => [
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/analytics.edit',
    'https://www.googleapis.com/auth/analytics.manage.users',
    'https://www.googleapis.com/auth/analytics.manage.users.readonly'
  ].join(' '), []);

  const propertiesSelection = (property) => {
    const propertySelected = propertiesOptions?.find((eachProperty) => eachProperty?.value === property);

    setSelectedProperty(propertySelected);
  }

  useEffect(()=> {
    // UNCOMMENT TO INSERT GA AUDIENCE
    // console.log('accountSummary');
    // console.log(accountSummary);
    // console.log('accountSummary?.length...');
    // console.log(accountSummary?.length);
    // if (accountSummary?.length) {
    //   createGoogleAnalyticsAudience();
    // }
  }, [accountSummary])

  const refreshToken = () => client?.requestAccessToken();

  const googleLoginAuth = () => {
    const w = window;
    const google = w?.google;
    if (!google) {
      console.error("no google");
      return undefined;
    }

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
      const tokenResponse = JSON.parse(authToken);
      setAccessToken(tokenResponse.access_token);
    } else if (!accessToken) {
      client.requestAccessToken();
    }

    setClient(client);
  }

  useEffect(() => {
    if( audienceName && audienceDescription && selectedAnalytic?.value && selectedProperty?.value) {
      setIsShowSyncButton(true);
    } else {
      setIsShowSyncButton(false);
    }
  }, [audienceName, audienceDescription, selectedAnalytic, selectedProperty])

  const syncGoogleAnalyticsAudience = () => {
    if( !audienceName || !audienceDescription || !selectedAnalytic?.value || !selectedProperty?.value) {
      message.error('Please complete all fields!');
    } else {
      createGoogleAnalyticsAudience({
        audienceName,
        audienceDescription,
        propertyValue: selectedProperty?.value,
    })
    }
    
  }

  return (
    <>
    <Card title="TEST SYNC GOOGLE ANALYTICS ADS AUDIENCE" style={{width: '80%', margin: 'auto', backgroundColor: 'lightblue'}}>
    {isShowAnalyticSelection && 
    <>
    <Input placeholder="GA Audience Name" allowClear onChange={(e) => onChange(e, 'name')} />
    <br />
    <br />
    <TextArea placeholder="GA Audience Description" allowClear onChange={(e) => onChange(e, 'description')} />
    <br/>
    <br/>
    <Select
      style={{ width: '100%', margin: 'auto' }}
      placeholder="Select Analytics"
      optionFilterProp="children"
      onChange={analyticsSelection}
      options={analyticsOptions}
      value={selectedAnalytic}
    />
    <br/>
    <br/>
    </>
    }
  
    {isShowPropertiesSelection && 
    <>
    <Select
      style={{ width: '100%', margin: 'auto' }}
      placeholder="Select Properties"
      optionFilterProp="children"
      onChange={propertiesSelection}
      options={propertiesOptions}
      value={selectedProperty}
    />
    <br/>
    <br/>
    </>
    }

    { (!isShowSyncButton && !isCompleteSignIn) 
    ? (
    <Button block onClick={logInProcess}>
      START LOGIN
    </Button>
    ) 
    : (
      <Button type="primary" block onClick={syncGoogleAnalyticsAudience}>
      SYNC NOW!
    </Button>
    )
    }
    </Card>
    </>
  )
}