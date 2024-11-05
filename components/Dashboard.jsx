"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";

// to avoid server-side issues
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({data}) => {
  const [filter, setFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredData, setFilteredData] = useState({
    orders: data.stats.orders,
    sales: data.stats.sales,
    totalOrders: data.totalOrders,
    totalSales: data.totalSales,
  });
  const [apiData, setApiData] = useState(data);


  const fetchData = async (year) => {
    try {
      const response = await fetch(
        `/api/dashboard?year=${year}`
      );
      const data = await response.json();
      setApiData(data);
      setFilteredData({
        orders: data.stats.orders,
        sales: data.stats.sales,
        totalOrders: data.totalOrders,
        totalSales: data.totalSales,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const graphData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Orders",
        data: filteredData.orders || [],
        backgroundColor: "#00BFFF",
      },
      {
        label: "Total Sale",
        data: filteredData.sales || [],
        backgroundColor: "#FF1493",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Statistic Chart for ${filter || new Date().getFullYear()}`,
      },
    },
    maintainAspectRatio: false,
  };

  const stats = [
    {
      title: "Total Orders",
      value: apiData?.totalOrders || 0,
      color: "linear-gradient(135deg, #4e54c8, #8f94fb)",
    },
    {
      title: "Pending Prescriptions",
      value: apiData?.pendingPrescription || 0,
      color: "linear-gradient(135deg, #42e695, #3bb2b8)",
    },
    {
      title: `Completed Orders`,
      value: apiData?.completedOrders || 0,
      color: "linear-gradient(135deg, #fc67fa, #f681c5)",
    },
    {
      title: `Total Sales`,
      value: `$${apiData?.totalSales || 0}`,
      color: "linear-gradient(135deg, #667eea, #764ba2)",
    },
  ];

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleFilterSelect = (selectedYear) => {
    setFilter(selectedYear);
    fetchData(selectedYear);
    closeMenu();
  };

  const handleClearFilter = () => {
    const currentYear = new Date().getFullYear().toString();
    setFilter(""); // Clear the filter label from the UI
    fetchData(currentYear); // Fetch data for the current year in the background
  };

  return (
    <Box p={3} bgcolor="#f4f6f8" maxWidth="100%" height="100%">
      <Box
        bgcolor="white"
        p={3}
        borderRadius={2}
        boxShadow={1}
        overflow="hidden"
        position="relative"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Button
            variant="outlined"
            startIcon={<FilterAltIcon />}
            sx={{ position: "absolute", top: 16, left: 16 }}
            onClick={openMenu}
          >
            Filter
          </Button>
          <Box
            display="flex"
            alignItems="center"
            mb={2}
            flexWrap="wrap"
            sx={{ position: "absolute", top: 18, left: 140 }}
          >
            {filter && (
              <>
                <Chip
                  label={`Year: ${filter}`}
                  onDelete={handleClearFilter}
                  deleteIcon={<ClearIcon />}
                  sx={{ marginRight: 2 }}
                />
                <Typography
                  variant="body1"
                  color="primary"
                  onClick={handleClearFilter}
                  sx={{ cursor: "pointer", fontWeight: "bold", marginLeft: 2 }}
                >
                  Clear filter
                </Typography>
              </>
            )}
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
          >
            <MenuItem onClick={() => handleFilterSelect("2024")}>
              Year 2024
            </MenuItem>
            <MenuItem onClick={() => handleFilterSelect("2023")}>
              Year 2023
            </MenuItem>
            <MenuItem onClick={() => handleFilterSelect("2022")}>
              Year 2022
            </MenuItem>
          </Menu>
        </Box>
        <Box height={{ xs: 300, sm: 400 }} width="100%">
          <Bar data={graphData} options={options} />
        </Box>
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        mt={3}
        gap={2}
      >
        {stats.map((stat, index) => (
          <Card
            key={index}
            sx={{
              flex: "1 1 200px",
              maxWidth: "calc(50% - 8px)",
              background: stat.color,
              color: "white",
              borderRadius: 2,
              boxShadow: 2,
              marginBottom: 2,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {stat.title}
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;