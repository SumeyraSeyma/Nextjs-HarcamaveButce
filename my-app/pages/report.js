"use client";

import React from "react";
import { useGelirGider } from "../context/GelirGiderContext";
import ComboChart from "./charts/GiderComboChart";
import TotalLineChart from "./charts/MonthlyTotalChart";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";
import GelirComboChart from "./charts/GelirComboChart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Report() {
  const { gelirData, giderData, giderCategories, gelirCategories } = useGelirGider();

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-content");
    if (!element) {
      console.error("Element not found: #report-content");
      return;
    }
  
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
  
    const pdfWidth = pdf.internal.pageSize.getWidth(); // PDF sayfasının genişliği
    const pdfHeight = pdf.internal.pageSize.getHeight(); // PDF sayfasının yüksekliği
  
    const imgWidth = canvas.width; // Canvas genişliği
    const imgHeight = canvas.height; // Canvas yüksekliği
  
    const imgRatio = imgHeight / imgWidth; // Görüntü oranı
    const scaledImgHeight = pdfWidth * imgRatio; // PDF'ye sığacak şekilde ölçeklendirilmiş görüntü yüksekliği
  
    let currentHeight = 0;
  
    while (currentHeight < imgHeight) {
      const canvasPart = document.createElement("canvas");
      canvasPart.width = canvas.width;
      canvasPart.height = Math.min(imgHeight - currentHeight, canvas.width * (pdfHeight / pdfWidth));
  
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
      pdf.addImage(partImgData, "PNG", 0, 0, pdfWidth, (canvasPart.height / canvas.width) * pdfWidth);
  
      currentHeight += canvasPart.height;
  
      if (currentHeight < imgHeight) {
        pdf.addPage(); // Yeni sayfa ekle
      }
    }
  
    pdf.save("GelirGiderRaporu.pdf");
  };
  

  return (
    <div  className="min-h-screen bg-gray-100 p-6 dark:bg-zinc-950">
      <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-500 text-white text-start rounded-md dark:bg-zinc-800 dark:text-white"
        >
          <svg height="20" width="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7071 6.29291C14.0976 6.68343 14.0976 7.31658 13.7071 7.7071L7.41422 14H25C25.5522 14 26 14.4477 26 15C26 15.5523 25.5522 16 25 16H7.41422L13.7071 22.2928C14.0976 22.6834 14.0976 23.3166 13.7071 23.7072C13.3166 24.0976 12.6834 24.0976 12.2929 23.7072L4.2929 15.7071C3.90236 15.3166 3.90236 14.6834 4.2929 14.2929L12.2929 6.29291C12.6834 5.90236 13.3166 5.90236 13.7071 6.29291Z" fill="currentColor"></path></svg>

        </button>
      <div id="report-content"  className="container mx-auto max-w-7xl bg-white shadow-lg rounded-lg p-6 dark:bg-zinc-900 dark:shadow-zinc-900">
      
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 dark:text-indigo-200">
          Gelir ve Gider Raporu
        </h1>   
        {/* Gelir Verileri */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-600 mb-4 dark:text-green-200">Gelirler</h2>
          <ul className="list-disc pl-5 dark:text-zinc-400">
            {gelirData.length > 0 ? (
              gelirData.map((gelir, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold dark:text-zinc-400">{gelir.kategori}:</span>{" "}
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
          <h2 className="text-2xl font-bold text-red-600 mb-4 dark:text-red-200">Giderler</h2>
          <ul className="list-disc pl-5 dark:text-zinc-400">
            {giderData.length > 0 ? (
              giderData.map((gider, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold dark:text-zinc-400">{gider.kategori}:</span>{" "}
                  {gider.tutar} TL ({gider.açıklama})
                </li>
              ))
            ) : (
              <p>Henüz gider eklenmedi.</p>
            )}
          </ul>
        </div>

        {/* Kategori Durumları */}
        {/* <div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Kategori Durumları
          </h2>
          <ul className="list-disc pl-5">
            {giderCategories.map((category, index) => (
              <li key={index} className="mb-2">
                <span className="font-bold">{category.name}:</span> {category.total} TL / {category.limit} TL
                {category.limit > 0
                  ? ` (%${Math.round((category.total / category.limit) * 100)})`
                  : ""}
              </li>
            ))}
          </ul>
        </div> */}
        <ComboChart giderCategories={giderCategories} gelirData={gelirData} giderData={giderData} />
        <GelirComboChart gelirCategories = {gelirCategories} gelirData={gelirData} />
        < TotalLineChart gelirData={gelirData} giderData={giderData} />
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
