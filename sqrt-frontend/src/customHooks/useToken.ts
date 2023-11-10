import { useState } from 'react';
import { userTokenType } from './userTokenInterface';
export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    if( tokenString ) {
      const userToken = JSON.parse(tokenString);
      return userToken
    }
    return null
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: userTokenType) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    if (userToken) {
        setToken(userToken.tokenString);
    }
  };
  return {
    setToken: saveToken,
    token, 
  }
}