"use client";

import React from "react";
import { useGelirGider } from "../context/GelirGiderContext";
import ComboChart from "./ComboChart";
import TotalLineChart from "./TotalLineChart";

function Report() {
  const { gelirData, giderData, categories } = useGelirGider();
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-7xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Gelir ve Gider Raporu
        </h1>

        {/* Gelir Verileri */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Gelirler</h2>
          <ul className="list-disc pl-5">
            {gelirData.length > 0 ? (
              gelirData.map((gelir, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold">{gelir.kategori}:</span>{" "}
                  {gelir.tutar} TL ({gelir.açıklama})
                </li>
              ))
            ) : (
              <p>Henüz gelir eklenmedi.</p>
            )}
          </ul>
        </div>

        {/* Gider Verileri */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Giderler</h2>
          <ul className="list-disc pl-5">
            {giderData.length > 0 ? (
              giderData.map((gider, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold">{gider.kategori}:</span>{" "}
                  {gider.tutar} TL ({gider.açıklama})
                </li>
              ))
            ) : (
              <p>Henüz gider eklenmedi.</p>
            )}
          </ul>
        </div>

        {/* Kategori Durumları */}
        <div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Kategori Durumları
          </h2>
          <ul className="list-disc pl-5">
            {categories.map((category, index) => (
              <li key={index} className="mb-2">
                <span className="font-bold">{category.name}:</span> {category.total} TL / {category.limit} TL
                {category.limit > 0
                  ? ` (%${Math.round((category.total / category.limit) * 100)})`
                  : ""}
              </li>
            ))}
          </ul>
        </div>
        <ComboChart categories={categories} gelirData={gelirData} giderData={giderData} />
        < TotalLineChart gelirData={gelirData} giderData={giderData} />
      </div>
      
    </div>
  );
}

export default Report;
