import React, { useState, useEffect } from 'react';
import  { withRouter, useHistory } from 'react-router-dom';
import useToken from '../../customHooks/useToken';
function Verify(): JSX.Element {
    let history = useHistory();
    const [code, setCode] = useState<String>()
    const [username, setUsername] = useState<String>()

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const formData = {
            code: code,
            username: username,
        }
        await submitform(formData);
        history.push('/');
    }

    const submitform = async (formData: {}) => {
        try {
            const response = await fetch( "https://nest-backend-zhsajgp3nq-lz.a.run.app/users/confirmation", {
                method: "POST",
                mode: "cors",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }),
                body: JSON.stringify(formData)
            });
            return ({
                success: response.ok,
            });
        } catch (ex) {
            return ({
                success: false,
            });
        }
    }

    return (
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
                Create an account
              </h2>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleFormSubmission}>
    
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      id="username"
                      name="username"
                      required
                      onChange={e => setUsername(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
  
                <div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Code
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="code"
                      name="code"
                      required
                      onChange={e => setCode(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
    
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )
}
export default withRouter(Verify)