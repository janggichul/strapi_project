import React, { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged, getAuth } from "firebase/auth";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { LoginState } from "../component/LoginState";
import { Auth } from "../App";
import {useCookies} from "react-cookie"

export default function Main() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggined, setIsLoggined] = useState(false);
  const [idValue, setIdValue] = useRecoilState(LoginState);
  const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"])
  const [isRemember, setIsRemember] = useState(false)

  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (user) => {
      if (user) {
        setIsLoggined(true);
      } else {
        setIsLoggined(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if(cookies.rememberUserId !== undefined) {
      setEmail(cookies.rememberUserId)
      console.log('ff',cookies.rememberUserId)
      setIsRemember(true)
    }
  },[])

  const signIn = () => {
    signInWithEmailAndPassword(Auth, email, password).then((result) => {
      console.log(result);
      navigate("/bank")
      window.location.reload(); 
      setIdValue(result);
    });
  };

  const handelLogin = (e) => {
    e.preventDefault();
    signIn();
  };

  const openUserAuthPage = () => {
    navigate("/SignIn");
  };

  const handleCheck = (e) => {
    setIsRemember(e.target.checked);
    if(e.target.checked) {
      setCookie("rememberUserId", email, {maxAge:2000})
    } else {
      removeCookie('rememberUserId')
    }
  };
  
  return (
    <>
    {isLoggined ? "로그인됨" : "로그인안됨"}
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              <Header title="Zero-bank"></Header>
            </h2>
            <p className="font-medium text-indigo-600 hover:text-indigo-500 mt-2 text-center text-sm text-gray-600">
              이용 전 사용자 인증 또는 로그인을 하십시요
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handelLogin}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  defaultValue={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={isRemember}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  onChange={handleCheck}
                />
                <label
                  className="ml-2 block text-sm text-gray-900"
                >
                  아이디 저장
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-500	 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-green-700 group-hover:text-green-400" />
                </span>
                로그인
              </button>
              <br></br>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={openUserAuthPage}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
