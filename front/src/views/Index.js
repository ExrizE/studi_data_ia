import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { expensesByCategory, averageByCategory, getDates } from '../redux/actions/expensesActions.js';
import { getFile } from '../redux/actions/csvActions.js';
import { Bar, Radar } from 'react-chartjs-2';

import IndexNavbar from "../components/Navbars/IndexNavbar.js";
import Footer from "../components/Footers/Footer.js";
import 'chart.js/auto'

export default function Index() {
  const dispatch = useDispatch();
  const expenses = useSelector(state => state.expenses.expenses);
  const averages = useSelector(state => state.expenses.averages);
  const dates = useSelector(state => state.expenses.dates);
  const file = useSelector(state => state.csv.file);
  const [selectedDate, setSelectedDate] = useState('');
  const [rowCount, setRowCount] = useState('')

  useEffect(() => {
    dispatch(getDates());
    dispatch(averageByCategory());
  }, [dispatch]);

  useEffect(() => {
      setSelectedDate(dates[0])
  }, [dates])

  useEffect(() => {
    if (dates.length > 0) {
      if (selectedDate) dispatch(expensesByCategory(selectedDate));
    }
  }, [selectedDate])

  useEffect(() => {
    if (dates.length > 0) {
      if (selectedDate) dispatch(expensesByCategory(selectedDate));
    }
  }, [selectedDate])

  useEffect(() => {
    
    const dateDuJour = new Date();

    let jour = dateDuJour.getDate();
    let mois = dateDuJour.getMonth() + 1; // Les mois sont indexés à partir de 0 en JavaScript
    const annee = dateDuJour.getFullYear();

    if(jour < 10) {
        jour = '0' + jour;
    }
    if(mois < 10) {
        mois = '0' + mois;
    }

    const dateFormatee = '' + annee + mois + jour +  rowCount;
    if (!file) {
        return;
    }

    // Crée un objet URL à partir du Blob
    const url = window.URL.createObjectURL(new Blob([file]));

    // Crée un lien DOM et déclenche le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${dateFormatee}.csv`); // ou tout autre nom de fichier
    document.body.appendChild(link);
    link.click();

    // Nettoie en supprimant le lien une fois le téléchargement effectué
    document.body.removeChild(link);
}, [file]);

  
  const handleDate = (e) => {
    e.preventDefault();
    setSelectedDate(e.target.value);
  };
  const handleRowCount = (e) => {
    e.preventDefault();
    setRowCount(e.target.value);
  };

  const handleFile = async (e) => {
    e.preventDefault();
    await dispatch(getFile(rowCount));
};

  const basLabels = ['Employé', 'Ouvrier', 'Profession intermédiaire', 'Indépendant', 'Cadre', 'Retraité', 'Sans activité'];
  const catLabels = ['alimentaire', 'multimedia', 'épicerie', 'surgelé', 'boulangerie', 'boucherie', 'légumes', 'fruits', 'boissons', 'produits laitiers', 'hygiène', 'beauté', 'jouets', 'vêtements', 'chaussures', 'jardin', 'bricolage'];
  const basOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  const catOptions = {
    responsive: true
  }
  const basData = {
    labels: basLabels,
    datasets: [{
      label: 'Panier moyen',
      data: averages,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  };
  const catData = {
    labels: catLabels,
    datasets: [
      {
        label: 'Employé',
        data: expenses['Employé'],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 0.2)'
      },
      {
        label: 'Ouvrier',
        data: expenses['Ouvrier'],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 0.2)'
      },
      {
        label: 'Profession intermédiaire',
        data: expenses['Profession intermédiaire'],
        fill: true,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 0.2)',
        pointBackgroundColor: 'rgba(255, 206, 86, 0.2)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 206, 86, 0.2)'
      },
      {
        label: 'Indépendant',
        data: expenses['Indépendant'],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 0.2)'
      },
      {
        label: 'Cadre',
        data: expenses['Cadre'],
        fill: true,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 0.2)',
        pointBackgroundColor: 'rgba(153, 102, 255, 0.2)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(153, 102, 255, 0.2)'
      },
      {
        label: 'Retraité',
        data: expenses['Retraité'],
        fill: true,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 0.2)',
        pointBackgroundColor: 'rgba(255, 159, 64, 0.2)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 159, 64, 0.2)'
      },{
        label: 'Sans activité',
        data: expenses['Sans activité'],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 0.2)'
      }
    ]
  };
  return (
    <>
      <IndexNavbar fixed />
      <section className="mt-48 md:mt-40 pb-10 relative">
        <div className="container mx-auto items-center">
          <div className="flex flex-wrap">
            <div className="w-8/12 px-4">
              <h2 className="font-semibold text-4xl text-blueGray-600">
              Les dépenses par catégorie en fonction de la catégorie socioprofessionnelle
              </h2>
            </div>
            <div className="w-full px-4 flex-1">
            <select value={selectedDate} onChange={handleDate}>
              {dates.map((date, index) => (
                <option key={index} value={date}>{date}</option>
              ))}
            </select>
            </div>
          </div>
          <div className="mt-10 min-h-screen-75 max-h-860-px">
              <Radar options={catOptions} data={catData} />;
          </div>
        </div>
      </section>
      
      <hr className="my-6 border-blueGray-300" />

      <section className="mt-1 md:mt-20 pb-40 relative">
        <div className="container mx-auto items-center">
          <div className="flex flex-wrap">
            <div className="w-8/12 px-4">
              <h2 className="font-semibold text-4xl text-blueGray-600">
              la dépense du panier moyen en fonction de la catégorie socioprofessionnelle
              </h2>
            </div>
          </div>
          <div className="mt-10 min-h-screen-75 max-h-860-px">
              <Bar options={basOptions} data={basData} />;
          </div>
        </div>
      </section>

      <section className="pb-16 bg-blueGray-200 relative pt-32">
        <div
          className="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>

        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center bg-blueGray-600 shadow-xl rounded-lg -mt-64 py-16 px-12 relative z-10">
            <div className="w-full text-center text-white lg:w-8/12">
              <p className="text-4xl text-center">
                <span role="img" aria-label="love">
                🗂️
                </span>
              </p>
              <h3 className="font-semibold text-3xl">
                Voulez vous exporter ces données?
              </h3>
              <div className="text-black mt-5">
                <label>Combien de lignes?</label>
                <input min={1} type="number" value={rowCount} onChange={handleRowCount}/>
              </div>
              <div className="sm:block flex flex-col mt-10">
                {rowCount === '' ? (
                    <button
                    className="opacity-50 cursor-not-allowed get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                    disabled
                    type='button'
                    >
                      <i className='fas fa-file-download mr-3'></i>
                      Télécharger
                    </button>
                    ) : 
                    <button
                    onClick={handleFile}
                    className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-base shadow hover:shadow-lg ease-linear transition-all duration-150"
                    type='button'
                  >
                  <i className='fas fa-file-download mr-3'></i>
                    Télécharger
                  </button>
                  }
                
              </div>
              <div className="text-center mt-5"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
