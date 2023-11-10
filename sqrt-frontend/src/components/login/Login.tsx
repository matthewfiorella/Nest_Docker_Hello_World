import React, { ReactNode, useState }  from 'react';
import './Login.css';
import PropTypes from 'prop-types';
import { userTokenType } from '../../customHooks/userTokenInterface';
import { useHistory } from 'react-router';

async function loginUser(credentials: {}) {
    return fetch('http://localhost:8080/users/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then( data => {
         return data.json()
        }, err => {
          console.log(err)
        })
   }
   
export default function Login( {setToken}: {setToken: (arg: userTokenType) => void}) {
  const [username, setUserName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loginFailure, setLoginFailure] = useState<boolean>(false)
  const history = useHistory()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const token = await loginUser({
      username: username,
      password: password,
    });
    if (token && token.tokens) {
      setToken(token.tokens.AccessToken);
      setLoginFailure(false)
      history.push("/")
    }
    else {
      setLoginFailure(true)
    }

  }

  return(
    <>
    {/*
      This example requires updating your template:

      ```
      <html class="h-full bg-white">
      <body class="h-full">
      ```
    */}
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Login to an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                required
                onChange={e => setUserName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={e => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </div>
          {loginFailure && <div className="d-flex justify-content-center">
            Incorrect Credentials!
          </div>}
        </form>
      </div>
    </div>
  </>
  )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }