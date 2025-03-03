import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Schools from "./pages/Schools";
import Parents from "./pages/Parents";
import Students from "./pages/Students";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import ReportFormSchool from "./components/ReportFormSchool";
import ReportFormStudent from "./components/ReportFormStudent";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/parents" element={<Parents />} />
        <Route path="/students" element={<Students />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reportSchool" element={<ReportFormSchool />} />
        <Route path="/reportStudent" element={<ReportFormStudent />} />
      </Routes>
    </div>
  );
}

export default App;
