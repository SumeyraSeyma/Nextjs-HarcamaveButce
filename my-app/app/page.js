"use client";

import React, { useState } from "react";
import { format, set } from "date-fns";

function Home() {
  const [gider, setGider] = useState("");
  const [gelir, setGelir] = useState("");
  const [giderAçıklama, setGiderAçıklama] = useState("");
  const [gelirAçıklama, setGelirAçıklama] = useState("");
  const [gelirTarih, setGelirTarih] = useState("");
  const [giderTarih, setGiderTarih] = useState("");
  const [isGiderDropdownOpen, setIsGiderDropdownOpen] = useState(false);
  const [isGelirDropdownOpen, setIsGelirDropdownOpen] = useState(false);
  const [giderSelectedCategory, setGiderSelectedCategory] = useState("");
  const [gelirSelectedCategory, setGelirSelectedCategory] = useState("");
  const [toplamGelir, setToplamGelir] = useState(0);

  const [categories,setCategories] = useState([
    { name: "Fatura", color: "bg-red-100 text-red-800",limit: 0, total: 0 },
    { name: "Kira", color: "bg-blue-100 text-blue-800",limit: 0, total: 0 },
    { name: "Yemek", color: "bg-yellow-100 text-yellow-800",limit: 0, total: 0 },
    { name: "Eğlence", color: "bg-purple-100 text-purple-800",limit: 0, total: 0 },
    { name: "Ulaşım", color: "bg-green-100 text-green-800",limit: 0, total: 0 },
    { name: "Kıyafet", color: "bg-pink-100 text-pink-800",limit: 0, total: 0 },
    { name: "Sağlık", color: "bg-indigo-100 text-indigo-800",limit: 0, total: 0 },
    { name: "Eğitim", color: "bg-teal-100 text-teal-800",limit: 0, total: 0 },
    { name: "Diğer", color: "bg-gray-100 text-gray-800",limit: 0, total: 0 },
  ]);

  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd/MM/yyyy");

  const handleLimitChange = (name, newLimit) => {
    const updatedCategories = categories.map((category) =>
      category.name === name ? { ...category, limit: parseFloat(newLimit) || 0 } : category
    );
    setCategories(updatedCategories);
  };

  const handleGiderCategorySelect = (categoryName) => {
    setGiderSelectedCategory(categoryName);
    setIsGiderDropdownOpen(false);
  };
  
  const handleGelirCategorySelect = (categoryName) => {
    setGelirSelectedCategory(categoryName);
    setIsGelirDropdownOpen(false);
  };
  
  const handleAddGider = () => {
    if (!giderSelectedCategory || !gider || isNaN(gider)) {
      alert("Lütfen geçerli bir kategori ve tutar seçin.");
      return;
    }
  
    const updatedCategories = categories.map((category) => {
      if (category.name === giderSelectedCategory) {
        const newTotal = category.total + parseFloat(gider);
  
        // %80'lik limiti aşarsa uyarı göster
        if (newTotal >= category.limit * 0.8 && newTotal < category.limit) {
          alert(
            `${category.name} kategorisi için belirlediğiniz bütçenin %80'ine ulaştınız!`
          );
        } else if (newTotal >= category.limit) {
          alert(`${category.name} kategorisi için belirlediğiniz bütçeyi aştınız!`);
        }
  
        return { ...category, total: newTotal };
      }
      return category;
    });
  
    setCategories(updatedCategories);
  
    // Formu sıfırla
    setGider("");
    setGiderAçıklama("");
    setGiderTarih("");
    setGiderSelectedCategory("");
  };
  
  const handleAddGelir = () => {
    if ( !gelir || isNaN(gelir)) {
      alert("Lütfen geçerli tutar seçin.");
      return;
    }
    
    setToplamGelir(toplamGelir + parseFloat(gelir));
  
    // Formu sıfırla
    setGelir("");
    setGelirAçıklama("");
    setGelirTarih("");
    setGelirSelectedCategory("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-7xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Gelir ve Gider Takip Uygulaması
        </h1>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Bütçe Limitleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {categories.map((category, index) => (
    <div key={index} className="flex items-center gap-4">
      <span
        className={`w-24 px-3 py-1 text-center rounded-md ${category.color}`}
      >
        {category.name}
      </span>

      <input
        type="number"
        value={category.limit}
        onChange={(e) => handleLimitChange(category.name, e.target.value)}
        className="flex-1 border rounded-lg p-2 focus:ring focus:ring-blue-300"
        placeholder="Limit Belirle"
      />
      <span className="w-32 text-sm text-gray-600 text-right">
        {category.total} / {category.limit}{" "}
        {category.limit > 0
          ? `(%${Math.round((category.total / category.limit) * 100)})`
          : ""}
      </span>
    </div>
  ))}
</div>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gider */}
          <div className="p-4 bg-red-50 rounded-lg shadow-md border border-red-200">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Gider</h2>
            {/* Dropdown */}
            <div className="relative">
  <button
    onClick={() => setIsGiderDropdownOpen(!isGiderDropdownOpen)}
    className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
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
    } bg-white rounded-lg shadow-lg w-44 mt-1`}
  >
    <ul className="py-2 text-sm text-gray-700">
      {categories.map((category, index) => (
        <li key={index}>
          <button
            onClick={() => handleGiderCategorySelect(category.name)}
            className={`flex items-center justify-between w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${
              category.color
            } hover:opacity-90`}
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
                <label className="block text-gray-700 font-semibold mb-2">
                  Açıklama
                </label>
                <input
                  type="text"
                  value={giderAçıklama}
                  onChange={(e) => setGiderAçıklama(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-red-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Tutar
                </label>
                <input
                  type="number"
                  value={gider}
                  onChange={(e) => setGider(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-red-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={giderTarih}
                  onChange={(e) => setGiderTarih(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-red-300"
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
          <div className="p-4 bg-green-50 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Gelir</h2>
            {/* Gelir Formu */}
            <div className="space-y-4 mt-16">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Açıklama
                </label>
                <input
                  type="text"
                  value={gelirAçıklama}
                  onChange={(e) => setGelirAçıklama(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-green-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Tutar
                </label>
                <input
                  type="number"
                  value={gelir}
                  onChange={(e) => setGelir(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-green-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={gelirTarih}
                  onChange={(e) => setGelirTarih(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring focus:ring-green-300"
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
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sonuçlar</h2>
          <p className="text-lg">
            Toplam Gelir: <span className="font-bold text-green-600">{toplamGelir} TL</span>
          </p>
          <p className="text-lg">
            Toplam Gider:{" "}
            <span className="font-bold text-red-600">
              {categories.reduce((acc, category) => acc + category.total, 0)} TL
            </span>
          </p>
          <p className="text-lg">
            Toplam Bakiye:{" "}
            <span className="font-bold text-blue-600">
              {toplamGelir - categories.reduce((acc, category) => acc + category.total, 0)} TL
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
