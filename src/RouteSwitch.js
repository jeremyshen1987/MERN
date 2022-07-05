import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Header from "./Header";
import Products from "./Products";
import Cart from "./Cart";
import { useState } from "react";

const RouteSwitch = () => {

  const [cart, setCart] = useState([])
  const [inventoryCopy, setInventoryCopy] = useState([])



  return (

    
    <BrowserRouter>

      <Header qty={cart.length}/>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/products" element={<Products cart={cart} setCart={setCart} inventoryCopy={inventoryCopy} setInventoryCopy={setInventoryCopy}/>} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
      </Routes>

    </BrowserRouter>
    
  );
};

export default RouteSwitch;