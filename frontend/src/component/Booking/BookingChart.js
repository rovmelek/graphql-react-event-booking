import React from "react";

import { Bar } from "react-chartjs-2";

// enum to define cheap, normal and expensive in price
const BOOKING_BUCKET = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 100000000000,
  },
};

const bookingChart = (props) => {
  const chartData = { labels: [], datasets: [] };
  const dataValue = [];
  for (const bucket in BOOKING_BUCKET) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      return current.event.price > BOOKING_BUCKET[bucket].min &&
        current.event.price <= BOOKING_BUCKET[bucket].max
        ? prev + 1
        : prev;
    }, 0);
    // chartData[bucket] = filteredBookingsCount;
    chartData["labels"].push(bucket);
    dataValue.push(filteredBookingsCount);
  }

  chartData["datasets"].push({
    label: "Price Analysis",
    backgroundColor: "rgba(255,99,132,0.2)",
    borderColor: "rgba(255,99,132,1)",
    borderWidth: 1,
    hoverBackgroundColor: "rgba(255,99,132,0.4)",
    hoverBorderColor: "rgba(255,99,132,1)",
    data: dataValue,
  });

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            min: 0,
          },
        },
      ],
    },
  };

  console.log(chartData);
  return (
    <Bar data={chartData} options={chartOptions} width={100} height={400} />
  );
};

export default bookingChart;
