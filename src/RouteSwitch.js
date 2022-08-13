import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Header from "./Header";
import Products from "./Products";
import Cart from "./Cart";
import { Auth } from "./Login";
import { useState, createContext } from "react";


export const cityContext = createContext()

const RouteSwitch = () => {

  const [cart, setCart] = useState([])
  const [inventoryCopy, setInventoryCopy] = useState([])

  const [test1, test2, test3] = ['001', '007', '009']


  return (

    
    <BrowserRouter>

      <cityContext.Provider value={{test1, test2}}>

        <Header cart={cart}/>

        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/products" element={<Products cart={cart} setCart={setCart} inventoryCopy={inventoryCopy} setInventoryCopy={setInventoryCopy}/>} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/login" element={<Auth />} />
        </Routes>

      </cityContext.Provider>

    </BrowserRouter>
    
  );
};

export default RouteSwitch;