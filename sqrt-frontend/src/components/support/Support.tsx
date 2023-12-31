import React from 'react';
import { Link } from 'react-router-dom';
export default function Support() {
    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full">
          <body class="h-full">
          ```
        */}
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-600">Support</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">There is No Support</h1>
            <p className="mt-6 text-base leading-7 text-gray-600">You're on your own. Figure it out. </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/"
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400">
                Go back home
              </Link>
            </div>
          </div>
        </main>
      </>
      )
    }