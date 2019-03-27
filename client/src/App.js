import { Auth0Lock } from 'auth0-lock';
import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';

import GlobalStyle from './styles/GlobalStyle';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);

  const lock = new Auth0Lock('CLIENT_ID', 'DOMAIN');

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

  const Main = styled.main`
    height: 100vh;
    background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const Container = styled.div`
    display: flex;
    flex-direction: column;
  `;

  const Text = styled.p`
    font-size: 5rem;
    color: snow;
  `;

  const Button = styled.button`
    height: 3.5vmax;
    border: 2px solid #0099cc;
    border-radius: 15px;
    width: 50%;
    font-size: 2rem;

    &:hover {
      transition: all 0.05s ease-in;
      background: #0099cc;
      color: snow;
      text-decoration: none;
      cursor: pointer;
    }
  `;

  return (
    <Fragment>
      <Main>
        {accessToken ? (
          <Container>
            <Text>{profile.name} is logged in</Text>
            <Button type="button" onClick={logout}>
              Logout
            </Button>
          </Container>
        ) : (
          <Container>
            <Text>User is not logged in</Text>
            <Button type="button" onClick={showLogin}>
              Login
            </Button>
          </Container>
        )}
      </Main>
      <GlobalStyle />
    </Fragment>
  );
};

export default App;
