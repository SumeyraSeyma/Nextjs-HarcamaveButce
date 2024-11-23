import React, { createContext, useContext, useState } from "react";

const GelirGiderContext = createContext();

export const GelirGiderProvider = ({ children }) => {
  const [giderCategories, setGiderCategories] = useState([
    { name: "Fatura", color: "bg-red-100 text-red-800", limit: 0, total: 0 },
    { name: "Kira", color: "bg-blue-100 text-blue-800", limit: 0, total: 0 },
    {
      name: "Yemek",
      color: "bg-yellow-100 text-yellow-800",
      limit: 0,
      total: 0,
    },
    {
      name: "Eğlence",
      color: "bg-purple-100 text-purple-800",
      limit: 0,
      total: 0,
    },
    {
      name: "Ulaşım",
      color: "bg-green-100 text-green-800",
      limit: 0,
      total: 0,
    },
    { name: "Kıyafet", color: "bg-pink-100 text-pink-800", limit: 0, total: 0 },
    {
      name: "Sağlık",
      color: "bg-indigo-100 text-indigo-800",
      limit: 0,
      total: 0,
    },
    { name: "Eğitim", color: "bg-teal-100 text-teal-800", limit: 0, total: 0 },
    { name: "Diğer", color: "bg-gray-100 text-gray-800", limit: 0, total: 0 },
  ]);

  const [gelirCategories, setGelirCategories] = useState([
    { name: "Maaş", color: "bg-red-100 text-red-800", total: 0 },
    { name: "Kira", color: "bg-blue-100 text-blue-800", total: 0 },
    { name: "Yatırım", color: "bg-yellow-100 text-yellow-800", total: 0 },
    { name: "Diğer", color: "bg-gray-100 text-gray-800", total: 0 },
  ]);

  const [giderData, setGiderData] = useState([]);
  const [gelirData, setGelirData] = useState([]);

  return (
    <GelirGiderContext.Provider
      value={{
        giderCategories,
        setGiderCategories,
        giderData,
        setGiderData,
        gelirData,
        setGelirData,
        gelirCategories,
        setGelirCategories,
      }}
    >
      {children}
    </GelirGiderContext.Provider>
  );
};

export const useGelirGider = () => useContext(GelirGiderContext);
