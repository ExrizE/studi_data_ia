/*eslint-disable*/
import React, { useState } from 'react';
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logoutRequest } from '../../redux/actions/authActions'
import { isAdmin } from '../../utils/auth';

export default function Navbar(props) {
const [navbarOpen, setNavbarOpen] = React.useState(false);
const dispatch = useDispatch();
const history = useHistory();
const location = useLocation();
const { from } = location.state || { from: { pathname: "/" } }; // par défaut, rediriger vers la page d'accueil
  
const handleLogout = async (e) => {
  e.preventDefault();
  try {
    await dispatch(logoutRequest());
    toast.success("Connexion réussie !");
    history.push(from); // rediriger vers l'emplacement précédent
  } catch (error) {
    console.log(error)
    if (error && error.response && error.response.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Une erreur inattendue s'est produite lors de la connexion.");
    }
  }
};  
  return (
    <>
    <ToastContainer />
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              to="/"
              className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            >
              GoldenLine
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block" : " hidden")
            }
            id="example-navbar-warning"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">

              {isAdmin() ? (<li className="flex items-center">
                <a
                  className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                  href="/admin/dashboard"
                  target="_blank"
                >
                  <i className="text-blueGray-400 fas fa-users text-lg leading-lg " />

                  <span className="inline-block ml-2">Users</span>
                </a>
              </li>) : ''}

              <li className="flex items-center">
                <button onClick={handleLogout}
                  className="bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                  type="button"
                >
                  <i className="fas fa-sign-out-alt"></i> Se deconnecter
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
