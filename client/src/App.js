import { Auth0Lock } from 'auth0-lock';
import React, { Fragment, useEffect, useState } from 'react';

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

  return (
    <Fragment>
      <header>
        {accessToken ? (
          <div>
            <p>{profile.name} is logged in</p>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div>
            <p>User is not logged in</p>
            <button type="button" onClick={showLogin}>
              Login
            </button>
          </div>
        )}
      </header>
      <GlobalStyle />
    </Fragment>
  );
};

export default App;
