import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Products.css'


const Products = (props) => {

  const [filteredInventory, setFilteredInventory] = useState([])
  const [raritySelector, setRaritySelector] = useState('all')

  useEffect(() => {
    
    console.log('getItem effect run')
    getItems()

  }, [])


  useEffect(() => {

    console.log('change rarity')
    if(raritySelector === 'all'){
      setFilteredInventory(props.inventoryCopy.filter(item => item.rarity.value !== null))
      return
    }
    setFilteredInventory(() => props.inventoryCopy.filter(item => item.rarity.value === raritySelector))
    return(
      console.log('clean up event')
    )
  }, [raritySelector])


  async function getItems(){

    if(props.inventoryCopy.length !== 0){
      return
    }

    const response = await fetch('https://fortnite-api.com/v2/cosmetics/br/new')

    if(response.status !== 200){
      return 'Error occured while retrive items'
    }

    const responseJSON = await response.json()
    const itemsArr = responseJSON.data.items


    itemsArr.map(item => item.price = setPrice(item))

    setFilteredInventory([...itemsArr])
    props.setInventoryCopy([...itemsArr])    
  }

  function setPrice(item){

    switch (item.rarity.value){
      case 'uncommon':
        return Math.ceil(Math.random() * 10 + .01)

      case 'rare':
        return Math.ceil(Math.random() * 10 + 10)

      case 'epic':
        return Math.ceil(Math.random() * 10 + 30)

      default:
        return Math.ceil(Math.random() * 10 + .5)
    }

  }

  function addItemToCart(item){
    console.log(item)
    // console.log(props.setCart)
    const itemInCart = props.cart.filter(el => el.id === item.id)

    if(itemInCart.length === 0){
      item.qty = 1
    
      props.setCart([...props.cart, item])
      console.log(props.cart)
    }
    else{
      return
    }

  }



  function capitalize(word){
    return word[0].toUpperCase() + word.slice(1)
  }

  return (
    
    <main className="products_container">

      <aside className="sidebar">
        <div className="rarity_fiter">
          <div className="filter_title">Rarity</div>
          <button className="filter_selector" onClick={() => setRaritySelector('all')}>All</button>
          <button className="filter_selector" onClick={() => setRaritySelector('epic')}>Epic</button>
          <button className="filter_selector" onClick={() => setRaritySelector('rare')}>Rare</button>
          <button className="filter_selector" onClick={() => setRaritySelector('uncommon')}>Uncommon</button>
        </div>
      </aside>


      <div className="items_container">
      {filteredInventory.map((item) => {
        return <div key={item.id} className='item_box'>
                <h2>{item.name}</h2>
                <div className="item_description">{capitalize(item.description)}</div>

                <div>Type: {capitalize(item.type.value)}</div>
                <div className={item.rarity.displayValue}>Rarity: {item.rarity.displayValue}</div>
                <div>Price: <span style={{fontSize: "1.5rem", fontWeight: 700}}>${item.price}</span> </div>
                <img src={item.images.icon} alt={item.name}></img>
                <button className="btn_addItem" onClick={() => addItemToCart(item)}>Add to Cart</button>
               </div>
      })}
      </div>


    </main>
  );
};
  
export default Products;