import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const YearlyTotalChart = ({ gelirData, giderData }) => {
  const chartRef = useRef(null);


  const groupDataByYear = (data) => {
    const yearlyTotals = {};

    data.forEach((entry) => {
      const year = new Date(entry.tarih).getFullYear();
      if (!yearlyTotals[year]) {
        yearlyTotals[year] = 0;
      }
      yearlyTotals[year] += entry.tutar;
    });


    return Object.keys(yearlyTotals)
      .sort((a, b) => a - b)
      .map((year) => ({
        year: parseInt(year),
        total: yearlyTotals[year],
      }));
  };

  useEffect(() => {

    const groupedGelir = groupDataByYear(gelirData);
    const groupedGider = groupDataByYear(giderData);

    const years = Array.from(
      new Set([
        ...groupedGelir.map((item) => item.year),
        ...groupedGider.map((item) => item.year),
      ])
    ).sort((a, b) => a - b);

    const gelirTotals = years.map(
      (year) => groupedGelir.find((item) => item.year === year)?.total || 0
    );
    const giderTotals = years.map(
      (year) => groupedGider.find((item) => item.year === year)?.total || 0
    );


    const chart = new ChartJS(chartRef.current, {
      type: "line",
      data: {
        labels: years, 
        datasets: [
          {
            label: "Toplam Gelir",
            data: gelirTotals,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
            fill: false,
            tension: 0.3,
          },
          {
            label: "Toplam Gider",
            data: giderTotals,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(255, 99, 132, 1)",
            fill: false,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Yıllık Toplam Gelir ve Gider",
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => chart.destroy();
  }, [gelirData, giderData]);

  return <canvas ref={chartRef}></canvas>;
};

export default YearlyTotalChart;
