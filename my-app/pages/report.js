"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useGelirGider } from "../context/GelirGiderContext";
import ComboChart from "./charts/GiderComboChart";
import TotalLineChart from "./charts/MonthlyTotalChart";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";
import GelirComboChart from "./charts/GelirComboChart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AnnualTotalChart from "./charts/AnnualTotalChart";
import { set } from "date-fns";

function Report() {
  const { gelirData, giderData, giderCategories, gelirCategories, limitAsimi } =
    useGelirGider();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleDownloadPDF = async () => {
    const previousMode = isDarkMode;
    setIsDarkMode(false);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = document.getElementById("report-content");
    if (!element) {
      console.error("Element not found: #report-content");
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#fff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const imgRatio = imgHeight / imgWidth;
    const scaledImgHeight = pdfWidth * imgRatio;

    let currentHeight = 0;

    while (currentHeight < imgHeight) {
      const canvasPart = document.createElement("canvas");
      canvasPart.width = canvas.width;
      canvasPart.height = Math.min(
        imgHeight - currentHeight,
        canvas.width * (pdfHeight / pdfWidth)
      );

      const ctx = canvasPart.getContext("2d");
      ctx.drawImage(
        canvas,
        0,
        currentHeight,
        canvas.width,
        canvasPart.height,
        0,
        0,
        canvasPart.width,
        canvasPart.height
      );

      const partImgData = canvasPart.toDataURL("image/png");
      pdf.addImage(
        partImgData,
        "PNG",
        0,
        0,
        pdfWidth,
        (canvasPart.height / canvas.width) * pdfWidth
      );

      currentHeight += canvasPart.height;

      if (currentHeight < imgHeight) {
        pdf.addPage();
      }
    }

    pdf.save("GelirGiderRaporu.pdf");

    setIsDarkMode(previousMode);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-zinc-950">
      <button
        onClick={handleBack}
        className="px-4 py-2 bg-blue-500 text-white text-start rounded-md dark:bg-zinc-800 dark:text-white"
      >
        <svg
          height="20"
          width="20"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.7071 6.29291C14.0976 6.68343 14.0976 7.31658 13.7071 7.7071L7.41422 14H25C25.5522 14 26 14.4477 26 15C26 15.5523 25.5522 16 25 16H7.41422L13.7071 22.2928C14.0976 22.6834 14.0976 23.3166 13.7071 23.7072C13.3166 24.0976 12.6834 24.0976 12.2929 23.7072L4.2929 15.7071C3.90236 15.3166 3.90236 14.6834 4.2929 14.2929L12.2929 6.29291C12.6834 5.90236 13.3166 5.90236 13.7071 6.29291Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
      <div
        id="report-content"
        className="container mx-auto max-w-7xl bg-white shadow-lg rounded-lg p-6 dark:bg-zinc-800 dark:shadow-zinc-600"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 dark:text-indigo-200">
          Gelir ve Gider Raporu
        </h1>

        <ComboChart
          giderCategories={giderCategories}
          gelirData={gelirData}
          giderData={giderData}
        />
        {/* Gider Verileri */}
        <div className="mb-6 mt-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4 dark:text-red-200">
            Giderler
          </h2>
          {giderData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border-collapse border border-gray-300 dark:border-gray-700 dark:text-zinc-400">
                <thead>
                  <tr className="bg-gray-100 dark:bg-zinc-800">
                    <th className="px-4 py-2 text-gray-800 font-semibold dark:text-zinc-300">
                      Kategori
                    </th>
                    <th className="px-4 py-2 text-gray-800 font-semibold dark:text-zinc-300">
                      Tutar (TL)
                    </th>
                    <th className="px-4 py-2 text-gray-800 font-semibold dark:text-zinc-300">
                      Açıklama
                    </th>
                    <th className="px-4 py-2 text-gray-800 font-semibold dark:text-zinc-300">
                      Tarih
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {giderData.map((gider, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-gray-50 dark:bg-zinc-900"
                          : "bg-white dark:bg-zinc-800"
                      } hover:bg-gray-200 dark:hover:bg-zinc-700`}
                    >
                      <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                        {gider.kategori}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                        {gider.tutar} TL
                      </td>
                      <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                        {gider.açıklama || "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                        {gider.tarih}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-zinc-400">
              Henüz gider eklenmedi.
            </p>
          )}
        </div>

        <div>
          {limitAsimi.length > 0 ? (
            <ul className="list-disc pl-5 dark:text-zinc-400">
              {limitAsimi.map((category, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold dark:text-zinc-400">
                    {category.name}
                  </span>{" "}
                  kategorisinde limit aşımı yaşandı. Gelecek ay bu kategoriye
                  daha az harcama yapılması önerilir.
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-zinc-400">
              Şu anda limit aşımı yok.
            </p>
          )}
        </div>
        <GelirComboChart
          gelirCategories={gelirCategories}
          gelirData={gelirData}
        />
        {/* Gelir Verileri */}
        <div className="mb-6 mt-4">
          <h2 className="text-2xl font-bold text-green-600 mb-4 dark:text-green-200">
            Gelirler
          </h2>
          {gelirData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border-collapse border border-gray-300 dark:border-gray-700 dark:text-zinc-400">
                <thead>
                  <tr className="bg-gray-100 dark:bg-zinc-800">
                    <th className="px-4 py-2 text-gray-800 font-semibold dark:text-zinc-300">
                      Kategori
                    </th>
                    <th className="px-4 py-2 text-gray-800 font-semibold dark:text-zinc-300">
                      Tutar (TL)
                    </th>
                    <th className="px-4 py-2 text-gray-800 font-semibold dark:text-zinc-300">
                      Açıklama
                    </th>
                    <th className="px-4 py-2 text-gray-800 font-semibold dark:text-zinc-300">
                      Tarih
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gelirData.map((gelir, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-gray-50 dark:bg-zinc-900"
                          : "bg-white dark:bg-zinc-800"
                      } hover:bg-gray-200 dark:hover:bg-zinc-700`}
                    >
                      <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                        {gelir.kategori}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                        {gelir.tutar} TL
                      </td>
                      <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                        {gelir.açıklama || "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                        {gelir.tarih}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-zinc-400">
              Henüz gelir eklenmedi.
            </p>
          )}
        </div>

        <TotalLineChart gelirData={gelirData} giderData={giderData} />
        <AnnualTotalChart gelirData={gelirData} giderData={giderData} />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-green-500 text-white rounded-md dark:bg-green-700 dark:text-white"
        >
          PDF İndir
        </button>
      </div>
    </div>
  );
}

export default Report;
