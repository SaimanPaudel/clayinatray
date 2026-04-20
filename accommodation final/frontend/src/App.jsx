import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accommodation from "./pages/Accommodation";
import PropertyDetail from "./pages/PropertyDetail";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accommodation />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/accommodation/:id" element={<PropertyDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;