import React, { useEffect, useState } from "react";
import Head from "next/head";
import { signOut, signIn } from 'next-auth/react'
import Link from "next/link";
import Image from "next/image";

const Sidebar = ({ session }) => {

  function openSidebar() {
    document.querySelector(".sidebar").classList.toggle("hidden");
  }

  function setActive() {

    const path = window.location.pathname

    try {
      //document.querySelector(`a[href="${path}"] div`).classList.add('active')
      document.querySelector(`a[href="${path}"]`).children[0].classList.add('bg-zinc-900', 'font-bold')

      if (document.querySelector(`a[href="${path}"]`).parentElement.id.includes('submenu')) {
        const menuId = document.querySelector(`a[href="${path}"]`).parentElement.id.split('submenu-')[1]

        document.querySelector(`#submenu-${menuId}`).classList.toggle("hidden");
        document.querySelector(`#arrow-${menuId}`).classList.toggle("rotate-180");
      }
    } catch (e) {
      // not on sidebar
    }

  }
  useEffect(() => {
    setActive()
  }, [])

  return (
    <>
      <span className="absolute text-white text-2xl top-5 left-4 cursor-pointer" onClick={(e) => openSidebar() }>
        <i className="bi bi-filter-left px-2 bg-slate-900 rounded-md"></i>
      </span>
      <aside className="bg-zinc-950 rounded-md sidebar hidden fixed top-0 bottom-0 lg:block left-0 p-2 w-[250px] overflow-y-auto text-center font-semibold z-10">
      <div className="">
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center justify-center">
            <div className="px-2 py-1">
              <Image
                src="/vercel.svg"
                alt="my app logo"
                draggable="false"
                width={75}
                height={35}
                className="invert"
              />
            </div>
            <i
              className="bi bi-x cursor-pointer ml-28 lg:hidden"
              onClick={(e) => openSidebar() }
            ></i>
          </div>
          <div className="my-2 bg-gray-600 h-[1px]"></div>
        </div>
        <Link href='/'>
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-zinc-700 text-white">
                <i className="bi bi-house"></i>
                <span className="text-[15px] ml-4 text-gray-200">Home</span>
            </div>
        </Link>
        <Link href='/crypto'>
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-zinc-700 text-white">
                <i className="bi bi-currency-bitcoin"></i>
                <span className="text-[15px] ml-4 text-gray-200">Crypto</span>
            </div>
        </Link>
        <Link href='#'>
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-zinc-700 text-white">
                <i className="bi bi-calculator-fill"></i>
                <span className="text-[15px] ml-4 text-gray-200">Finances</span>
            </div>
        </Link>
        <Link href='#'>
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-zinc-700 text-white">
                <i className="bi bi-graph-up-arrow"></i>
                <span className="text-[15px] ml-4 text-gray-200">Stocks</span>
            </div>
        </Link>
        <div
          className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-zinc-700 text-white w-100"
          onClick={session ? (e) => signOut() : (e) => signIn()}
        >
          {session ?
            <>
              <i className="bi bi-box-arrow-in-left"></i>
              <span className="text-[15px] ml-4 text-gray-200">Logout</span>
            </>
            :
            <>
              <i className="bi bi-box-arrow-in-right"></i>
              <span className="text-[15px] ml-4 text-gray-200">Login</span>
            </>
          }
          
        </div>
      </div>

    </aside>
    </>
  );
};

export default Sidebar;