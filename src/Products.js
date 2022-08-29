import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import './Products.css'
import { mainContext } from "./RouteSwitch";


const Products = () => {

  const {inventoryCopy, setInventoryCopy, cart, setCart} = useContext(mainContext)
  const [filteredInventory, setFilteredInventory] = useState([])
  const [raritySelector, setRaritySelector] = useState('all')

  useEffect(() => {
    
    console.log('getItem effect run')
    getItems()

  }, [])


  useEffect(() => {

    console.log('change rarity')
    if(raritySelector === 'all'){
      setFilteredInventory(inventoryCopy.filter(item => item.rarity.value !== null))
      return
    }
    setFilteredInventory(() => inventoryCopy.filter(item => item.rarity.value === raritySelector))
    return(
      console.log('clean up event')
    )
  }, [raritySelector])


  async function getItems(){

    if(inventoryCopy.length !== 0){
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
    setInventoryCopy([...itemsArr])    
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
    // console.log(setCart)
    const itemInCart = cart.filter(el => el.id === item.id)

    if(itemInCart.length === 0){
      item.qty = 1
    
      setCart([...cart, item])
      console.log(cart)
    }
    else{
      return
    }

  }

  function capitalize(word){
    return word[0].toUpperCase() + word.slice(1)
  }

  const FilterRarity = () => {
    return(

      <div className="rarity_fiter">

        <div className="filter_title">
          Rarity
        </div>

        <button className="filter_selector" onClick={() => setRaritySelector('all')}>All</button>
        <button className="filter_selector" onClick={() => setRaritySelector('epic')}>Epic</button>
        <button className="filter_selector" onClick={() => setRaritySelector('rare')}>Rare</button>
        <button className="filter_selector" onClick={() => setRaritySelector('uncommon')}>Uncommon</button>
      </div>
    )
  }

  const FilterPrice = () => {

    const filter_price = (e) => {
      e.preventDefault()

      const priceRanges = document.querySelectorAll('#price_filter')

      let selectedRange = []

      priceRanges.forEach(item =>{

        if(item.checked){
          let min = parseInt(item.value.split('-')[0]) 
          let max = parseInt(item.value.split('-')[1])
          selectedRange.push([min, max])
        }
      })
      // SAMPLE selectedRange: [[0, 10], [25, 35]]


      let inRangeInventory = []

      selectedRange.forEach(item =>{

        const inRangeItems = filteredInventory === [] ? 

          inventoryCopy.filter(x => x.price > item[0] && x.price <= item[1]) :
          filteredInventory.filter(x => x.price > item[0] && x.price <= item[1])


        inRangeInventory.push(inRangeItems)
      })

      // SAMPLE inRangeInventory: Array(14) => 0:(14), [[Prototype]]: Array(0)
      setFilteredInventory(inRangeInventory[0])
      
      console.log(inRangeInventory)
    }

    return(
      <div className="filter_price">

        <div className="filter_title">
          Price
        </div>

        <form className="filter_price_container">

          <div className="filter_price_item">
            <input name="less5" id="price_filter" type="checkbox" value="0-4.99" />
            <label htmlFor="less5">Less than 5</label>
          </div>

          <div className="filter_price_item">
            <input name="less15" id="price_filter" type="checkbox" value="5-14.99" />
            <label htmlFor="less15">5 to 14.99</label>
          </div>

          <div className="filter_price_item">
            <input name="less35" id="price_filter" type="checkbox" value="15-34.99" />
            <label htmlFor="less35">15 to 34.99</label>
          </div>

          <div className="filter_price_item">
            <input name="more35" id="price_filter" type="checkbox" value="35-999" />
            <label htmlFor="more35">More than 35</label>
          </div>
          
          <div className="price_filter_btn_container">
            <button className="reset_all_filter" onClick={() => setRaritySelector('all')}>Reset</button>
            <button className="apply_filter" onClick={e => filter_price(e)}>Apply</button>
          </div>
          
        </form>
        
      </div>
    )
  }

  return (
    
    <main className="products_container">
      <aside className="sidebar">
        <FilterRarity />
        <FilterPrice />
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