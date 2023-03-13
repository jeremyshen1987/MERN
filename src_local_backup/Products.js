import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import './Products.css'
import { mainContext } from "./RouteSwitch";


const Products = () => {

  const {inventoryCopy, setInventoryCopy, cart, setCart, filteredInventory, setFilteredInventory, searchResult, authUser, util, setUtil} = useContext(mainContext)
  const [raritySelector, setRaritySelector] = useState('all')

  useEffect(() => {
    
    document.title = 'Products'
  }, [])

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

    // if(inventoryCopy.length !== 0){
    //   return
    // }
    console.log('fetch prod')

    const response = await fetch('https://fortnite-api.com/v2/cosmetics/br/new')

    if(response.status !== 200){
      return 'Error occured while retrive items'
    }

    const responseJSON = await response.json()
    const itemsArr = responseJSON.data.items


    itemsArr.map(item => item.price = setPrice(item))

    setFilteredInventory([...itemsArr])
    setInventoryCopy([...itemsArr])    

    console.log('fetch prod complete')
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
    
    const itemInCart = cart.filter(el => el.id === item.id)

    if(itemInCart.length === 0){

      item.qty = 1
      setCart([...cart, item])
    }

  }

  function capitalize(word){
    return word[0].toUpperCase() + word.slice(1)
  } 

  //sort by price and alphabatic order

  const toBeSorted = filteredInventory || inventoryCopy

  const sortPriceAscend = () => {

    const sorted =  [...toBeSorted].sort((a, b) => a.price - b.price)
    setFilteredInventory(sorted)
  }

  const sortPriceDescend = () => {

    const sorted = [...toBeSorted].sort((a, b) => b.price - a.price)
    setFilteredInventory(sorted)
  }

  const sortAZ = () => {

    const sorted = [...toBeSorted].sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1)
    setFilteredInventory(sorted)
  }

  const sortZA = () => {

    const sorted = [...toBeSorted].sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? 1 : -1)
    setFilteredInventory(sorted)
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

      let result_custom_price_range = []

      const input_price_low = document.querySelector('#price_picker_low').value
      const input_price_high = document.querySelector('#price_picker_high').value

      //if there is at least one input field is filled:
      if(input_price_low !== '' || input_price_high !== ''){

        const price_min = input_price_low || 0
        const price_max = input_price_high || 999
  
        console.log('low end:', price_min)
        console.log('high end:', price_max)
  
        if( !validat_price_range(price_min, price_max) ){
          return
        }
  
        const currentInventory = filteredInventory || inventoryCopy
        result_custom_price_range = currentInventory.filter(item => item.price >= price_min && item.price <= price_max)

      }

    
      const priceRanges = document.querySelectorAll('#price_filter')

      const selectedCheckbox = [...priceRanges]
      const nonChecked = selectedCheckbox.every(item => item.checked === false)


      let result_checkboxs = []

      //check if at least one checkbox is checked. if none is checked, use result_checkboxes instead
      if(!nonChecked){

        // if more than one boxes are checked, items meet critieria will become inRangeItems(array), then pushed to result array, which lead to nested array
        let result_checkbox_nested = []
        let selectedRange = []

        priceRanges.forEach(item =>{
  
          if(item.checked){
            let min = parseInt(item.value.split('-')[0]) 
            let max = parseInt(item.value.split('-')[1])
            selectedRange.push([min, max])
          }
        })
        // SAMPLE selectedRange: [[0, 10], [25, 35]]
  
        selectedRange.forEach(item =>{
  
          const inRangeItems = filteredInventory === [] ? 
  
            inventoryCopy.filter(x => x.price > item[0] && x.price <= item[1]) :
            filteredInventory.filter(x => x.price > item[0] && x.price <= item[1])
  
  
          result_checkbox_nested.push(inRangeItems)
        })
        // Flatten result array
        result_checkboxs = result_checkbox_nested.reduce((preVal, nextVal) => preVal.concat(nextVal), [])

      }

      // SAMPLE result_checkboxs: Array(14) => 0:(14), [[Prototype]]: Array(0)
      console.log('price range:',result_custom_price_range)
      console.log('checkbox:', result_checkboxs)

      const combined_result = result_custom_price_range.concat(result_checkboxs)

      console.log('combined: ', combined_result)

      const filter_combined = combined_result.reduce((iniVal, nextVal) => {

        const arr_id = iniVal.map(item => item.id)
        if(arr_id.indexOf(nextVal.id) === -1){
          iniVal.push(nextVal)
        }
        return iniVal

      }, [])


      setFilteredInventory(filter_combined)

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

          <div className="filter_price_custom">
            <input name="price_picker_low" id="price_picker_low" type="number" min='1' max='999' placeholder="min" />
            <span>&nbsp; - &nbsp;</span>
            <input name="price_picker_high" id="price_picker_high" type="number" min='2' placeholder="max" />
          </div>

          <div className="price_filter_btn_container">
            <button className="reset_all_filter" onClick={() => setRaritySelector('all')}>Reset</button>
            <button className="apply_filter" onClick={e => filter_price(e)}>Apply</button>
          </div>
          
        </form>
        
      </div>
    )
  }

  const validat_price_range = (min, max) => {
    if( isNaN(min) || isNaN(min) ){
      alert('please enter a number!')
      return false
    }

    if(min < 0){
      alert('we do not sell for a loss!')
      return false
    }
    if(min > max){
      alert('max must be greater than min!')
      return false
    }
    return true
  }

  
  return (
    
    <main className="products_container">
      <aside className="sidebar">
        <FilterRarity />
        <FilterPrice />
      </aside>

      <div className="main_container">
        <div className="sort_container">
          <span className="sort_title">Sort By:</span>
          <button className="sort_price_ascend" onClick={sortPriceAscend}>Price: Lowest First</button>
          <button className="sort_price_descend" onClick={sortPriceDescend}>Price: Highest First</button>
          <button className="alphabat_ascend" onClick={sortAZ}>A-Z</button>
          <button className="alphabat_descend" onClick={sortZA}>Z-A</button>
        </div>


        <div className="items_container">
          {filteredInventory.length === 0 || authUser.noResult === true
          ? <h1>No items fits critieria</h1> 
          : (searchResult.length === 0 ?  filteredInventory : searchResult).map((item) => {
              return <div key={item.id} className='item_box'>
                        <h2>{item.name}</h2>
                        <div className="item_description">{capitalize(item.description)}</div>

                        <div>Type: {capitalize(item.type.value)}</div>
                        <div className={item.rarity.displayValue}>Rarity: {item.rarity.displayValue}</div>
                        <div>Price: <span style={{fontSize: "1.5rem", fontWeight: 700}}>${item.price}</span> </div>
                        <img src={item.images.icon} alt={item.name}></img>
                        {cart.map(elm => elm.id).includes(item.id) ? 

                          <Link className="inCart" to='/cart'>View Cart</Link>
                          :
                          <button className="btn_addItem" onClick={() => addItemToCart(item)}>Add to Cart</button>
                        }
                      
                    </div>
          })}
        </div>
        
      </div>

    </main>
  );
};
  
export default Products;