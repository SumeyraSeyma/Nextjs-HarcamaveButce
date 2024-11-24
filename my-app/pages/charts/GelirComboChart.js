import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const GelirComboChart = ({ gelirCategories, gelirData }) => {
  const chartRef = useRef(null);

  const colorMap = {
    "bg-red-100": "rgba(255, 99, 132, 0.6)",
    "bg-blue-100": "rgba(54, 162, 235, 0.6)",
    "bg-yellow-100": "rgba(255, 206, 86, 0.6)",
    "bg-purple-100": "rgba(153, 102, 255, 0.6)",
    "bg-green-100": "rgba(75, 192, 192, 0.6)",
    "bg-pink-100": "rgba(255, 159, 64, 0.6)",
    "bg-indigo-100": "rgba(99, 132, 255, 0.6)",
    "bg-teal-100": "rgba(64, 224, 208, 0.6)",
    "bg-gray-100": "rgba(192, 192, 192, 0.6)",
  };

  const groupDataByMonth = (data) => {
    const monthlyTotals = Array(12).fill(0); 

    data.forEach((entry) => {
      const monthIndex = new Date(entry.tarih).getMonth(); 
      monthlyTotals[monthIndex] += entry.tutar;
    });

    return monthlyTotals; 
  };

  const getCurrentYearData = (data) => {
    const currentYear = new Date().getFullYear();
    return data.filter((entry) => new Date(entry.tarih).getFullYear() === currentYear);
  };

    useEffect(() => {
      const currentYearGelirData = getCurrentYearData(gelirData);

      const categoryDataByMonth = gelirCategories.map((category) => {
        const monthlyTotals = Array(12).fill(0);
        currentYearGelirData.forEach((gelir) => {
          const monthIndex = new Date(gelir.tarih).getMonth();
          if (gelir.kategori === category.name) {
            monthlyTotals[monthIndex] += gelir.tutar;
          }
        });
        return monthlyTotals;
      });    

    const chart = new ChartJS(chartRef.current, {

        type: "bar",
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
  
            ...gelirCategories.map((category, index) => ({
              type: "bar",
              label: category.name,
              data: categoryDataByMonth[index],
              backgroundColor: colorMap[category.color.split(" ")[0]] || "rgba(0, 0, 0, 0.6)",
            })),
          ],
        },
        options: {
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: `Aylık Gelir Dağılımı (${new Date().getFullYear()})`,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
        });



    return () => chart.destroy();
  }, [gelirCategories, gelirData]);

  return <canvas ref={chartRef}></canvas>;
};

export default GelirComboChart;
