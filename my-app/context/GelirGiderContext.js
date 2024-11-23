import React, { createContext, useContext, useState, useEffect } from "react";

const GelirGiderContext = createContext();

export const GelirGiderProvider = ({ children }) => {
  const [limitAsimi, setLimitAsimi] = useState([]);
  const [giderCategories, setGiderCategories] = useState([
    { name: "Fatura", color: "bg-red-100 text-red-800", limit: '', total: 0 },
    { name: "Kira", color: "bg-blue-100 text-blue-800", limit: '', total: 0 },
    {
      name: "Yemek",
      color: "bg-yellow-100 text-yellow-800",
      limit: '',
      total: 0,
    },
    {
      name: "Eğlence",
      color: "bg-purple-100 text-purple-800",
      limit: '',
      total: 0,
    },
    {
      name: "Ulaşım",
      color: "bg-green-100 text-green-800",
      limit: '',
      total: 0,
    },
    { name: "Kıyafet", color: "bg-pink-100 text-pink-800", limit: '', total: 0 },
    {
      name: "Sağlık",
      color: "bg-indigo-100 text-indigo-800",
      limit: '',
      total: 0,
    },
    { name: "Eğitim", color: "bg-teal-100 text-teal-800", limit: '', total: 0 },
    { name: "Diğer", color: "bg-gray-100 text-gray-800", limit: '', total: 0 },
  ]);

  const [gelirCategories, setGelirCategories] = useState([
    { name: "Maaş", color: "bg-red-100 text-red-800", total: 0 },
    { name: "Kira", color: "bg-blue-100 text-blue-800", total: 0 },
    { name: "Yatırım", color: "bg-yellow-100 text-yellow-800", total: 0 },
    { name: "Diğer", color: "bg-gray-100 text-gray-800", total: 0 },
  ]);

  const [giderData, setGiderData] = useState([]);
  const [gelirData, setGelirData] = useState([]);

  useEffect(() => {
    const storedGiderData = localStorage.getItem("giderData");
    const storedGelirData = localStorage.getItem("gelirData");
    const storedLimitAsimi = localStorage.getItem("limitAsimi");
    const storedGiderCategories = localStorage.getItem("giderCategories");
    const storedGelirCategories = localStorage.getItem("gelirCategories");

    setGiderData(storedGiderData ? JSON.parse(storedGiderData) : []);
    setGelirData(storedGelirData ? JSON.parse(storedGelirData) : []);
    setLimitAsimi(storedLimitAsimi ? JSON.parse(storedLimitAsimi) : []);
    setGiderCategories(
      storedGiderCategories
        ? JSON.parse(storedGiderCategories)
        : [
            { name: "Fatura", color: "bg-red-100 text-red-800", limit: "", total: 0 },
            { name: "Kira", color: "bg-blue-100 text-blue-800", limit: "", total: 0 },
          ]
    );
    setGelirCategories(
      storedGelirCategories
        ? JSON.parse(storedGelirCategories)
        : [
            { name: "Maaş", color: "bg-red-100 text-red-800", total: 0 },
            { name: "Yatırım", color: "bg-yellow-100 text-yellow-800", total: 0 },
          ]
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("giderData", JSON.stringify(giderData));
    localStorage.setItem("gelirData", JSON.stringify(gelirData));
    localStorage.setItem("limitAsimi", JSON.stringify(limitAsimi));
    localStorage.setItem("giderCategories", JSON.stringify(giderCategories));
    localStorage.setItem("gelirCategories", JSON.stringify(gelirCategories));
  }, [giderData, gelirData, limitAsimi, giderCategories, gelirCategories]);

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
        limitAsimi,
        setLimitAsimi,
      }}
    >
      {children}
    </GelirGiderContext.Provider>
  );
};

export const useGelirGider = () => useContext(GelirGiderContext);
