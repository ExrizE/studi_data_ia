import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-blueGray-200 pt-8 pb-6">
        <div className="container mx-auto px-4">
          <hr className="mb-6 border-b-1 border-blueGray-600" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-blueGray-500 font-semibold py-1">
              Copyright © {new Date().getFullYear()} Data & IA by {"Rafih Youness | "} 
              <a href="https://www.studi.com/fr" className="hover:text-blueGray-300 text-sm font-bold py-1">Studi</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
