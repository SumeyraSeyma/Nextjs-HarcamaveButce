"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import "tailwindcss/tailwind.css";
import { useGelirGider } from "../context/GelirGiderContext";

function Home() {
  const { giderCategories, setGiderCategories, giderData, setGiderData, gelirData, setGelirData, gelirCategories, setGelirCategories } = useGelirGider();
  const [gider, setGider] = useState("");
  const [gelir, setGelir] = useState("");
  const [giderAçıklama, setGiderAçıklama] = useState("");
  const [gelirAçıklama, setGelirAçıklama] = useState("");
  const [giderSelectedCategory, setGiderSelectedCategory] = useState("");
  const [gelirSelectedCategory, setGelirSelectedCategory] = useState("");
  const [giderTarih, setGiderTarih] = useState(format(new Date(), "yyyy-MM-dd"));
  const [gelirTarih, setGelirTarih] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isGiderDropdownOpen, setIsGiderDropdownOpen] = useState(false);
  const [isGelirDropdownOpen, setIsGelirDropdownOpen] = useState(false);
  const toplamGelir = gelirData.reduce((acc, gelir) => acc + gelir.tutar, 0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setIsDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);


  const handleLimitChange = (categoryName, newLimit) => {
    const updatedCategories = giderCategories.map((category) =>
      category.name === categoryName ? { ...category, limit: parseFloat(newLimit) || 0 } : category
    );
    setGiderCategories(updatedCategories);
  };


  const handleGiderCategorySelect = (categoryName) => {
    setGiderSelectedCategory(categoryName);
    setIsGiderDropdownOpen(false);
  };

  const handleGelirCategorySelect = (categoryName) => {
    setGelirSelectedCategory(categoryName);
    setIsGelirDropdownOpen(false);
  };  

  const handleAddGelir = () => {
    if (!gelir || isNaN(gelir) || !gelirSelectedCategory) {
      alert("Lütfen geçerli bir tutar giriniz.");
      return;
    }

    const newGelir = {
      kategori: gelirSelectedCategory,
      tutar: parseFloat(gelir),
      açıklama: gelirAçıklama,
      tarih: gelirTarih,
    };

    setGelirData([...gelirData, newGelir]);

    const updatedCategories = gelirCategories.map((category) =>
      category.name === gelirSelectedCategory
        ? { ...category, total: category.total + parseFloat(gelir) }
        : category
    );
    setGelirCategories(updatedCategories);

    // Formu sıfırla
    setGelir("");
    setGelirAçıklama("");
    setGelirSelectedCategory("");
  };

  const handleAddGider = () => {
    if (!giderSelectedCategory || !gider || isNaN(gider)) {
      alert("Lütfen geçerli bir kategori ve tutar seçin.");
      return;
    }

    const newGider = {
      kategori: giderSelectedCategory,
      tutar: parseFloat(gider),
      açıklama: giderAçıklama,
      tarih: giderTarih,
    };

    setGiderData([...giderData, newGider]);


    const updatedCategories = giderCategories.map((category) =>
      category.name === giderSelectedCategory
        ? { ...category, total: category.total + parseFloat(gider) }
        : category
    );
    setGiderCategories(updatedCategories);

    // Formu sıfırla
    setGider("");
    setGiderAçıklama("");
    setGiderSelectedCategory("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-zinc-950 dark:text-gray-100">
      <div className="container mx-auto max-w-7xl bg-white shadow-lg rounded-lg p-6 dark:bg-zinc-900 dark:text-gray-100 dark:shadow-zinc-900">

      <button
        onClick={() =>
          document.documentElement.classList.toggle("dark")
        }
        className="px-4 py-2 bg-blue-500 dark:bg-zinc-800 text-white dark:text-white rounded"
      >
        Dark Mode
      </button>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 dark:bg-zinc-900 dark:text-indigo-200">
          Gelir ve Gider Takip Uygulaması
        </h1>
        <div className="mb-6 dark:bg-zinc-900 dark:text-gray-100">
          <h2 className="text-2xl font-bold mb-4 dark:bg-zinc-900 dark:text-zinc-400">Bütçe Limitleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 dark:bg-zinc-900 dark:text-gray-300">
            {giderCategories.map((category, index) => (
              <div key={index} className="flex items-center gap-4 dark:bg-zinc-900 dark:text-gray-300">
                <span
                  className={`w-24 px-3 py-1 text-center rounded-md dark:bg-zinc-800 dark:text-indigo-200 ${category.color}`}
                >
                  {category.name}
                </span>

                <input
                  type="number"
                  value={category.limit}
                  min={0}
                  onChange={(e) =>
                    handleLimitChange(category.name, e.target.value)
                  }
                  className="flex-1 border rounded-lg p-2 focus:ring focus:ring-blue-300 dark:bg-zinc-900 dark:text-gray-300 dark:border-gray-700 dark:focus:ring-blue-300"
                  placeholder="Limit Belirle"
                />
                <span className="w-32 text-sm text-gray-600 text-right dark:bg-zinc-900 dark:text-gray-300">
                  {category.total} / {category.limit}{" "}
                  {category.limit > 0
                    ? `(%${Math.round(
                        (category.total / category.limit) * 100
                      )})`
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {/* Gider */}
          <div className="p-4 bg-red-50 rounded-lg shadow-md border border-red-200 dark:bg-zinc-900 dark:text-gray-300 dark:border dark:border-gray-700 dark:shadow-white ">
            <h2 className="text-2xl font-bold text-red-600 mb-4 dark:text-red-300">Gider</h2>
            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsGiderDropdownOpen(!isGiderDropdownOpen)}
                className="text-white bg-cyan-700 dark:focus:ring-0 hover:bg-cyan-800 focus:ring-4 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border dark:border-gray-700 dark:text-cyan-200 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                type="button"
              >
                {giderSelectedCategory || "Kategori Seç"}
                <svg
                  className="w-2.5 h-2.5 ml-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                className={`absolute z-10 ${
                  isGiderDropdownOpen ? "block" : "hidden"
                } bg-white rounded-lg shadow-lg w-44 mt-1 dark:bg-zinc-900`}
              >
                <ul className="py-2 text-sm text-gray-700 ">
                  {giderCategories.map((category, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleGiderCategorySelect(category.name)}
                        className={`flex items-center justify-between w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${category.color} hover:opacity-90 dark:bg-zinc-800 dark:text-cyan-200 dark:hover:bg-zinc-700 dark:border dark:border-gray-700`} 
                      >
                        <span>{category.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Gider Formu */}
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 dark:text-cyan-200">
                  Açıklama
                </label>
                <input
                  type="text"
                  value={giderAçıklama}
                  onChange={(e) => setGiderAçıklama(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-red-300 dark:bg-zinc-800 dark:text-gray-300 dark:border dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 dark:text-cyan-200">
                  Tutar
                </label>
                <input
                  type="number"
                  value={gider}
                  onChange={(e) => setGider(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-red-300 dark:bg-zinc-800 dark:text-gray-300 dark:border dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 dark:text-cyan-200">
                  Tarih
                </label>
                <input
                  type="date"
                  value={giderTarih}
                  onChange={(e) => setGiderTarih(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-red-300 dark:bg-zinc-800 dark:text-gray-300 dark:border dark:border-gray-700"
                />
              </div>
              <button
                onClick={handleAddGider}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Gider Ekle
              </button>
            </div>
          </div>
          {/* Gelir */}
          <div className="p-4 bg-green-50 rounded-lg shadow-md border border-green-200 dark:bg-zinc-900 dark:text-gray-300 dark:border dark:border-gray-700 dark:shadow-white">
            <h2 className="text-2xl font-bold text-green-600 mb-4 dark:text-green-200">Gelir</h2>
            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsGelirDropdownOpen(!isGelirDropdownOpen)}
                className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-zinc-800 dark:text-cyan-200 dark:focus:ring-0 dark:hover:bg-zinc-700 dark:border dark:border-gray-700" 
                type="button"
              >
                {gelirSelectedCategory || "Kategori Seç"}
                <svg
                  className="w-2.5 h-2.5 ml-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              <div
                className={`absolute z-10 ${
                  isGelirDropdownOpen ? "block" : "hidden"
                } bg-white rounded-lg shadow-lg w-44 mt-1 dark:bg-zinc-900`}
              >
                <ul className="py-2 text-sm text-gray-700 ">
                  {gelirCategories.map((category, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleGelirCategorySelect(category.name)}
                        className={`flex items-center justify-between w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${category.color} hover:opacity-90 dark:bg-zinc-800 dark:text-cyan-200 dark:hover:bg-zinc-700 dark:border dark:border-gray-700`}  
                      >
                        <span>{category.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Gelir Formu */}
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 dark:text-cyan-200">
                  Açıklama
                </label>
                <input
                  type="text"
                  value={gelirAçıklama}
                  onChange={(e) => setGelirAçıklama(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-green-300 dark:bg-zinc-800 dark:text-gray-300 dark:border dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 dark:text-cyan-200">
                  Tutar
                </label>
                <input
                  type="number"
                  value={gelir}
                  onChange={(e) => setGelir(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-green-300 dark:bg-zinc-800 dark:text-gray-300 dark:border dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 dark:text-cyan-200">
                  Tarih
                </label>
                <input
                  type="date"
                  value={gelirTarih}
                  onChange={(e) => setGelirTarih(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-green-300 dark:bg-zinc-800 dark:text-gray-300 dark:border dark:border-gray-700"
                />
              </div>
              <button
                onClick={handleAddGelir}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Gelir Ekle
              </button>
            </div>
          </div>
        </div>
        {/* Sonuç */}
        <div className="grid grid-cols-1 ">
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md border dark:bg-zinc-800 dark:text-zinc-400">
            <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-zinc-400">Sonuçlar</h2>
            <p className="text-lg">
              Toplam Gelir:{" "}
              <span className="font-bold text-green-600">{toplamGelir} TL</span>
            </p>
            <p className="text-lg">
              Toplam Gider:{" "}
              <span className="font-bold text-red-600">
                {giderCategories.reduce((acc, category) => acc + category.total, 0)}{" "}
                TL
              </span>
            </p>
            <p className="text-lg">
              Toplam Bakiye:{" "}
              <span className="font-bold text-blue-600">
                {toplamGelir -
                  giderCategories.reduce(
                    (acc, category) => acc + category.total,
                    0
                  )}{" "}
                TL
              </span>
            </p>
          </div>
          {/* Raporlar Sayfasına Yönlendirme Butonu */}
          <div className="mt-4">
            <Link href="/report">
              <p className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block text-center">
                Raporları Görüntüle
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
