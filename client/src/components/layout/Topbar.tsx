import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';

const curren: Currency[] = ['USD', 'EUR', 'GBP', 'CAD'];
const Topbar = () => {
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [currencyOpen, setCurrencyOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [languageOpen, setLanguageOpen] = useState<boolean>(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | Event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
      if (
        currencyRef.current &&
        !currencyRef.current.contains(event.target as Node)
      ) {
        setCurrencyOpen(false);
      }
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      {/* Top Row */}
      <div className="px-5 py-1">
        <div className="flex flex-col flex-wrap items-center justify-between md:flex-row">
          {/* Left Side - Desktop Links */}
          <div className="hidden items-center space-x-4 lg:flex">
            <a
              href=""
              className="text-sm text-gray-200 transition-colors hover:text-white"
            >
              About
            </a>
            <a
              href=""
              className="text-sm text-gray-200 transition-colors hover:text-white"
            >
              Contact
            </a>
            <a
              href=""
              className="text-sm text-gray-200 transition-colors hover:text-white"
            >
              Help
            </a>
            <a
              href=""
              className="text-sm text-gray-200 transition-colors hover:text-white"
            >
              FAQs
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {/* Account Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                className="flex items-center space-x-1 rounded bg-white px-2 py-1 text-sm transition-colors hover:bg-gray-200 dark:bg-betano-light"
                onClick={() => setAccountOpen(!accountOpen)}
              >
                <span>My Account</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {accountOpen && (
                <div className="absolute right-0 z-10 mt-1 w-32 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:bg-betano-light">
                  <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200">
                    Sign in
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200">
                    Sign up
                  </button>
                </div>
              )}
            </div>

            {/* Currency Dropdown */}
            <div className="relative" ref={currencyRef}>
              <button
                type="button"
                className="flex items-center space-x-1 rounded bg-white px-2 py-1 text-sm transition-colors hover:bg-gray-200 dark:bg-betano-light"
                onClick={() => setCurrencyOpen(!currencyOpen)}
              >
                <span>{currency}</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {currencyOpen && (
                <div className="absolute right-0 z-10 mt-1 w-32 rounded-md border border-gray-200 bg-white shadow-lg dark:bg-betano-light">
                  {curren.map((currency) => (
                    <button
                      key={currency}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
                      onClick={() => {
                        setCurrency(currency);
                        setCurrencyOpen(false);
                      }}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Dropdown */}
            <div className="relative" ref={languageRef}>
              <button
                type="button"
                className="flex items-center space-x-1 rounded bg-white px-2 py-1 text-sm transition-colors hover:bg-gray-200 dark:bg-betano-light"
                onClick={() => setLanguageOpen(!languageOpen)}
              >
                <span>EN</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {languageOpen && (
                <div className="absolute right-0 z-10 mt-1 w-32 rounded-md border border-gray-200 bg-white shadow-lg dark:bg-betano-light">
                  {['FR', 'AR', 'RU'].map((lang) => (
                    <button
                      key={lang}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Icons */}
            <div className="flex items-center space-x-2 lg:hidden">
              <Link to="cuotas" className="relative p-1">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-gray-800 bg-white text-xs dark:bg-betano-light">
                  0
                </span>
              </Link>
              <Link to="home" className="relative p-1">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-gray-800 bg-white text-xs dark:bg-betano-light">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Desktop Only */}
      <div className="hidden items-center bg-gray-100 px-5 py-3 dark:bg-betano-light lg:flex">
        <div className="w-1/3">
          <a href="" className="inline-flex no-underline">
            <span className="bg-gray-800 px-2 py-1 text-2xl font-bold uppercase text-blue-600">
              Multi
            </span>
            <span className="bg-blue-600 px-2 py-1 text-2xl font-bold uppercase text-gray-800">
              Shop
            </span>
          </a>
        </div>

        <div className="w-1/3 px-4">
          <form>
            <div className="flex">
              <input
                type="text"
                className="flex-1 rounded-l border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for products"
              />
              <button
                type="button"
                className="rounded-r border border-l-0 border-gray-300 bg-transparent px-3 py-2 text-blue-600 hover:bg-gray-50"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div className="w-1/3 text-right">
          <p className="mb-1 text-sm text-gray-600">Customer Service</p>
          <h5 className="text-lg font-bold text-gray-800">+012 345 6789</h5>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
