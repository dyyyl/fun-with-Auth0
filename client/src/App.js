import { Auth0Lock } from 'auth0-lock';
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';

import GlobalStyle from './shared/styles/GlobalStyle';
import {
  Button, Container, Main, Text,
} from './shared/styles';

const CLIENT_ID = '5O6k2g_s3QBGHnB3svzVMfAFSvgDHyA0';
const DOMAIN = 'dyyyl.auth0.com';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [response, setResponse] = useState();

  const lock = new Auth0Lock(CLIENT_ID, DOMAIN);

  const onAuthentication = (authResult) => {
    lock.getUserInfo(authResult.accessToken, (error, user) => {
      if (error) return;

      localStorage.setItem('accessToken', authResult.accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      setAccessToken(authResult.accessToken);
      setProfile(user);
    });
  };

  lock.on('authenticated', onAuthentication);

  const showLogin = () => {
    lock.show();
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');

    // this.setState({ accessToken: null, profile: null });
    setAccessToken(null);
    setProfile(null);

    lock.logout({
      returnTo: 'http://localhost:3000',
    });
  };

  useEffect(() => {
    const userAccessToken = localStorage.getItem('accessToken');
    const userProfile = localStorage.getItem('profile');

    if (userAccessToken && userProfile) {
      setAccessToken(userAccessToken);
      setProfile(JSON.parse(userProfile));
    }
  }, []);

  const checkFunction = () => {
    axios
      .get('/hello', {
        baseURL: process.env.REACT_APP_API_BASE_URL,
        // headers: {
        //   Authentication: this.state.accessToken ? `Bearer ${this.state.accessToken}` : null
        // }
      })
      .then((res) => {
        setResponse((res && res.data && res.data.message) || 'Invalid response');
      })
      .catch((error) => {
        let errorMessage = '';
        // This is from the docs https://github.com/axios/axios#handling-errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = `Response Error: ${error.response.data}`;
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          errorMessage = `Request Error: ${error.message}`;
        } else if (error.message) {
          // Something happened in setting up the request that triggered an Error
          errorMessage = `Error ${error.message}`;
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = `Error ${error}`;
        }

        setResponse(errorMessage);
      });
  };

  return (
    <Fragment>
      <Main>
        <Container>
          <div>
            <Button type="button" onClick={checkFunction}>
              Hello?
            </Button>
            <Text>Response: {response}</Text>
          </div>
          {accessToken ? (
            <Fragment>
              <Text>{profile.name} is logged in</Text>
              <Button type="button" onClick={logout}>
                Logout
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <Text>User is not logged in</Text>
              <Button type="button" onClick={showLogin}>
                Login
              </Button>
            </Fragment>
          )}
        </Container>
      </Main>
      <GlobalStyle />
    </Fragment>
  );
};

export default App;
