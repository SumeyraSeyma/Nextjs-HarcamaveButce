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

const TotalLineChart = ({ gelirData, giderData }) => {
  const chartRef = useRef(null);

  const groupDataByMonth = (data) => {
    const monthlyTotals = Array(12).fill(0);

    data.forEach((entry) => {
      const monthIndex = new Date(entry.tarih).getMonth();
      monthlyTotals[monthIndex] += entry.tutar;
    });

    return monthlyTotals;
  };

  useEffect(() => {
    const gelirByMonth = groupDataByMonth(gelirData);
    const giderByMonth = groupDataByMonth(giderData);

    const chart = new ChartJS(chartRef.current, {
      type: "line",
      data: {
        labels: [
          "Ocak",
          "Şubat",
          "Mart",
          "Nisan",
          "Mayıs",
          "Haziran",
          "Temmuz",
          "Ağustos",
          "Eylül",
          "Ekim",
          "Kasım",
          "Aralık",
        ],
        datasets: [
          {
            label: "Toplam Gelir",
            data: gelirByMonth,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
            fill: false,
            tension: 0.3,
          },
          {
            label: "Toplam Gider",
            data: giderByMonth,
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
            text: "Aylık Toplam Gelir ve Gider",
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

export default TotalLineChart;
