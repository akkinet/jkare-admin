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

// to avoid server-side issue
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

// Chart.js imports
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

const Dashboard = () => {
  const [filter, setFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredData, setFilteredData] = useState({
    orders: [],
    sales: [],
    totalOrders: 0,
    totalSales: 0,
  });
  const [apiData, setApiData] = useState(null);
  const [isClient, setIsClient] = useState(false);
  console.log("Dashboard page is rendered");

  useEffect(() => {
    setIsClient(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/dashboard");
      const data = await response.json();
      setApiData(data);
      applyFilter("Year 2023", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const currentMonthIndex = new Date().getMonth();
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

  const data = {
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
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Statistic Chart`,
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

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (selectedFilter) => {
    setFilter(selectedFilter);
    applyFilter(selectedFilter, apiData);
    closeMenu();
  };

  const applyFilter = (filterOption, data) => {
    const fullOrdersData = data?.stats.orders || [];
    const fullSalesData = data?.stats.sales || [];

    let orders = [];
    let sales = [];
    let totalOrders = 0;
    let totalSales = 0;

    if (filterOption === "1 Month") {
      orders = [fullOrdersData[currentMonthIndex]];
      sales = [fullSalesData[currentMonthIndex]];
    } else if (filterOption === "3 Months") {
      orders = fullOrdersData.slice(
        Math.max(currentMonthIndex - 2, 0),
        currentMonthIndex + 1
      );
      sales = fullSalesData.slice(
        Math.max(currentMonthIndex - 2, 0),
        currentMonthIndex + 1
      );
    } else if (filterOption === "6 Months") {
      orders = fullOrdersData.slice(
        Math.max(currentMonthIndex - 5, 0),
        currentMonthIndex + 1
      );
      sales = fullSalesData.slice(
        Math.max(currentMonthIndex - 5, 0),
        currentMonthIndex + 1
      );
    } else if (filterOption === "Year 2023") {
      orders = fullOrdersData;
      sales = fullSalesData;
    }

    totalOrders = orders.reduce((acc, val) => acc + val, 0);
    totalSales = sales.reduce((acc, val) => acc + val, 0);

    setFilteredData({ orders, sales, totalOrders, totalSales });
  };

  const handleClearFilter = () => {
    setFilter("");
    applyFilter("Year 2023", apiData);
  };

  if (!isClient) return null;

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
          <Box display="flex" alignItems="center" mb={2} flexWrap="wrap" 
               sx={{position:"absolute" , top: 18 , left: 140}}
             >
            {filter && (
              <>
                <Chip
                  label={`Dates: ${filter}`}
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
            <MenuItem onClick={() => handleFilterSelect("1 Month")}>
              1 Month
            </MenuItem>
            <MenuItem onClick={() => handleFilterSelect("3 Months")}>
              3 Months
            </MenuItem>
            <MenuItem onClick={() => handleFilterSelect("6 Months")}>
              6 Months
            </MenuItem>
            <MenuItem onClick={() => handleFilterSelect("Year 2023")}>
              A Year
            </MenuItem>
          </Menu>
        </Box>
        <Box height={{ xs: 300, sm: 400 }} width="100%">
          <Bar data={data} options={options} />
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
