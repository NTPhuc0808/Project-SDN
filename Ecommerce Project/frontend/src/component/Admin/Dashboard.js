import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./Dashboard.css";
import { Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";
import MetaData from "../layout/MetaData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import RobotoRegular from "./fronts/Roboto-Regular.ttf";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement, 
  LineElement,  
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement, 
  LineElement    
);

const Dashboard = () => {
    const dispatch = useDispatch();
  
    const { products = [] } = useSelector((state) => state.products); // Default as empty array
    const { orders = [] } = useSelector((state) => state.allOrders); // Default as empty array
    const { users = [] } = useSelector((state) => state.allUsers); // Default as empty array
  
    let outOfStock = 0;
  
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });
  
    useEffect(() => {
      dispatch(getAdminProduct());
      dispatch(getAllOrders());
      dispatch(getAllUsers());
    }, [dispatch]);
  
    let totalAmount = 0;
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });
  
    const lineState = {
      labels: ["Initial Amount", "Amount Earned"],
      datasets: [
        {
          label: "TOTAL AMOUNT",
          backgroundColor: ["tomato"],
          hoverBackgroundColor: ["rgb(197, 72, 49)"],
          data: [0, totalAmount],
        },
      ],
    };
  
    const doughnutState = {
        labels: ["Out of Stock", "In Stock"],
        datasets: [
          {
            backgroundColor: ["#00A6B4", "#6800B4"],
            hoverBackgroundColor: ["#4B5000", "#35014F"],
            data: [outOfStock, products.length - outOfStock], 
          },
        ],
      };

    // Function to export all data to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();

        // Embedding custom Roboto font
        doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        doc.setFont("Roboto"); 
        
        
        doc.text(`Dashboard Daily Report: ${new Date().toDateString()}`, 14, 15);

        // Total Amount and Stock Summary
        doc.text(`Total Amount: ${totalAmount} VND`, 14, 25);
        doc.text(`Out of Stock Products: ${outOfStock}`, 14, 30);
        doc.text(`In Stock Products: ${products.length - outOfStock}`, 14, 35);

        // Products Table
        const productColumn = ["Product Name", "Stock", "Price"];
        const productRows = products.map(product => [product.name, product.Stock, product.price]);

        doc.autoTable({
            head: [productColumn],
            body: productRows,
            startY: 40,
            margin: { top: 10 },
            theme: 'grid',
            headStyles: { fillColor: [0, 131, 143] },
        });

        // Orders Table
        const orderColumn = ["Order ID", "Total Price", "Order Status"];
        const orderRows = orders.map(order => [order._id, order.totalPrice, order.orderStatus]);

        doc.autoTable({
            head: [orderColumn],
            body: orderRows,
            startY: doc.autoTable.previous.finalY + 10,
            margin: { top: 10 },
            theme: 'grid',
            headStyles: { fillColor: [100, 149, 237] },
        });

        // Users Table
        const userColumn = ["User ID", "Name", "Email", "Role"];
        const userRows = users.map(user => [user._id, user.name, user.email, user.role]);

        doc.autoTable({
            head: [userColumn],
            body: userRows,
            startY: doc.autoTable.previous.finalY + 10,
            margin: { top: 10 },
            theme: 'grid',
            headStyles: { fillColor: [46, 139, 87] },
        });

        doc.save("DashboardReport.pdf");
    };

    return (
        <div className="dashboard">
          <MetaData title="Dashboard - Admin Panel" />
          <Sidebar />
    
          <div className="dashboardContainer">
            <Typography component="h1">Dashboard</Typography>
    
            <div className="dashboardSummary">
              <div>
                <p>Total Amount <br /> {totalAmount} VND</p>
                <Button variant="contained" color="primary" onClick={exportToPDF}>
                  Export Dashboard to PDF
                </Button>
              </div>
              <div className="dashboardSummaryBox2">
                <Link to="/admin/products">
                  <p>Products</p>
                  <p>{products.length}</p>
                </Link>
                <Link to="/admin/orders">
                  <p>Orders</p>
                  <p>{orders.length}</p>
                </Link>
                <Link to="/admin/users">
                  <p>Users</p>
                  <p>{users.length}</p>
                </Link>
              </div>
            </div>
    
            <div className="lineChart">
              <Line data={lineState} />
            </div>
    
            <div className="doughnutChart">
              <Doughnut data={doughnutState} />
            </div>
          </div>
        </div>
      );
};
  
export default Dashboard;
