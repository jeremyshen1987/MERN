import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./Header";
import Products from "./Products";
import Cart from "./Cart";
import Auth from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import "./MainCSS.css";
import { useState, createContext } from "react";


export const mainContext = createContext()

const RouteSwitch = () => {

  const [authUser, setAuthUser] = useState({})
  const [cart, setCart] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])

  return (

    
    <BrowserRouter>

      <mainContext.Provider value={{
        cart, 
        setCart, 
        authUser, 
        setAuthUser, 
        filteredInventory, 
        setFilteredInventory, 
        }}>

        <Header cart={cart}/>

        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

      </mainContext.Provider>

    </BrowserRouter>
    
  );
};

export default RouteSwitch;