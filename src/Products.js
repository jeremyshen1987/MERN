import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import './Products.css'
import { mainContext } from "./RouteSwitch";


function Products(){

  const noFilter = {
    rarity:'all', 
    query: '', 
    less_5: false,
    less_15: false,
    less_35: false,
    more_35: false,
    custom_range1: null,
    custom_range2: null
  }

  const {cart, setCart, filteredInventory, setFilteredInventory} = useContext(mainContext)
  const [selectFilter, setSelectFilter] = useState(noFilter)
  const price_min = useRef(null)
  const price_max = useRef(null)

  useEffect(() => {
    
    document.title = 'Products'

    const abortControl = new AbortController()

    async function getItems(){

      try{

        console.log('fetching')
        const response = await fetch('https://fortnite-api.com/v2/cosmetics/br/new',{
          signal: abortControl.signal
        })
    
        if(response.status !== 200){
          alert('Error occured while retrive items') 
          return
        }
    
        const responseJSON = await response.json()
        const itemsArr = responseJSON.data.items
    
        itemsArr.map(item => item.price = setPrice(item))
        setFilteredInventory([...itemsArr])

      } catch(err){

        if(err.name === 'AbortError'){
          alert('too many fetch req')
        }
      }
    }

    getItems()

    return ()=>{
      abortControl.abort()
    }

  }, [])



  //item object fetched from API doesn't contain pricing. Set a random price based on rarity
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

  function validat_price_range (min, max){

    if(min > max){
      alert('max must be greater than min!')
      ///return every products
      return [0,999]
    }

    if(isNaN(min) || isNaN(max) ){
      return[isNaN(min)? 0 : min, isNaN(max)? 999 : max]
    }

    return [min, max]
  }

  //Search bar

  function handleQueryChange(e){
    setSelectFilter({
      ...selectFilter,
      query: e.target.value
    })
  }


  function applyFilter(){

    
    //rarity filter
    const data = [...filteredInventory]
    const rarityResult = selectFilter.rarity === 'all' ? data : data.filter(item => item.rarity.value === selectFilter.rarity)

    //search filter
    const searchResult = rarityResult.filter(item => item.name.toUpperCase().includes(selectFilter.query.toUpperCase()))

    //price filter
    let priceResult = []
    let hasPricefilter = false

    if(selectFilter.less_5 === true){
      const result = searchResult.filter(i => i.price < 5)
      priceResult.push(result)
      hasPricefilter = true
    }

    if(selectFilter.less_15 === true){
      const result = searchResult.filter(i => i.price < 15 && i.price >= 5)
      priceResult.push(result)
      hasPricefilter = true
    }

    if(selectFilter.less_35 === true){
      const result = searchResult.filter(i => i.price < 35 && i.price >= 15)
      priceResult.push(result)
      hasPricefilter = true
    }

    if(selectFilter.more_35 === true){
      const result = searchResult.filter(i => i.price >= 35)
      priceResult.push(result)
      hasPricefilter = true
    }

    if(selectFilter.custom_range1 !== null || selectFilter.custom_range2   !== null){

      const [min, max] = validat_price_range(selectFilter.custom_range1, selectFilter.custom_range2)
      const result = searchResult.filter(i => i.price <= max && i.price >= min)
      priceResult.push(result)
      hasPricefilter = true
    }

    priceResult = priceResult.flat()

    if(hasPricefilter === false){
      priceResult = searchResult
    }

    return priceResult
  }


  return (
    
    <main className="products_container">
      <aside className="sidebar">

        <div className="rarity_fiter">

          <div className="filter_title">
            Rarity
          </div>

          <button className={selectFilter.rarity === 'all' ? "filter_selector bg_skyblue": "filter_selector"} 
          onClick={() => setSelectFilter({...selectFilter, rarity: 'all'})}>All</button>
          <button className={selectFilter.rarity === 'epic' ? "filter_selector bg_gold": "filter_selector"} 
          onClick={() => setSelectFilter({...selectFilter, rarity: 'epic'})}>Epic</button>
          <button className={selectFilter.rarity === 'rare' ? "filter_selector bg_purple": "filter_selector"} 
          onClick={() => setSelectFilter({...selectFilter, rarity: 'rare'})}>Rare</button>
          <button className={selectFilter.rarity === 'uncommon' ? "filter_selector bg_green": "filter_selector"} 
          onClick={() => setSelectFilter({...selectFilter, rarity: 'uncommon'})}>Uncommon</button>
        </div>

        <PricePicker selectFilter={selectFilter} setSelectFilter={setSelectFilter} price_min={price_min} price_max={price_max} noFilter={noFilter}/>

        <div className="search_bar">
          <label>Search: </label>
          <input onChange={handleQueryChange}></input>
        </div>

      </aside>

      <div className="main_container">

        <div className="items_container">
          {(applyFilter()).map(item => {

              return <div key={item.id} className='item_box'>
                        <h2>{item.name}</h2>
                        <div className="item_description">{capitalize(item.description)}</div>

                        <div>Type: {capitalize(item.type.value)}</div>
                        <div className={item.rarity.displayValue}>Rarity: {item.rarity.displayValue}</div>
                        <div>Price: <span className="price">${item.price}</span> </div>
                        <img src={item.images.icon} alt={item.name}></img>
                        {cart.map(elm => elm.id).includes(item.id) ? 

                          <Link className="inCart" to='/cart'>View Cart</Link>
                          :
                          <button className="btn_addItem" onClick={() => addItemToCart(item)}>Add to Cart</button>
                        }
                     </div>
          })}
          {applyFilter().length === 0 && <h1>No item fits criteria</h1>}
        </div>
        
      </div>

    </main>
  );
};

function PricePicker({selectFilter, setSelectFilter, price_min, price_max, noFilter}){

  function handlePriceRangeChange(e){

    console.log('name', e.target.value)
    console.log('checked', e.target.checked)

    setSelectFilter({
      ...selectFilter,
      [e.target.value]: e.target.checked
    })

  }

  return(
    <div className="filter_price">

      <div className="filter_title">
        Price
      </div>

      <div className="filter_price_container">

        <div className="filter_price_item">
          <input  id="less_5" type="checkbox" checked={selectFilter.less_5} value='less_5' onChange={handlePriceRangeChange}/>
          <label htmlFor="less_5">Less than 5</label>
        </div>

        <div className="filter_price_item">
          <input  id="less_15" type="checkbox" checked={selectFilter.less_15} value='less_15' onChange={handlePriceRangeChange}/>
          <label htmlFor="less_15">5 to 14.99</label>
        </div>

        <div className="filter_price_item">
          <input  id="less_35" type="checkbox" checked={selectFilter.less_35} value='less_35' onChange={handlePriceRangeChange}/>
          <label htmlFor="less_35">15 to 34.99</label>
        </div>

        <div className="filter_price_item">
          <input  id="more_35" type="checkbox" checked={selectFilter.more_35} value='more_35' onChange={handlePriceRangeChange}/>
          <label htmlFor="more_35">More than 35</label>
        </div>


        <div className="filter_price_custom">
          <input ref={price_min} id="price_picker_low" type="number" min='1' max='999' placeholder="min" />
          <span>&nbsp; - &nbsp;</span>
          <input ref={price_max} id="price_picker_high" type="number" min='2' placeholder="max" />
        </div>

        <div className="price_filter_btn_container">
          <button className="reset_all_filter" onClick={() => setSelectFilter(noFilter)}>Reset</button>
          <button className="apply_filter" onClick={() =>{
          setSelectFilter({
            ...selectFilter, 
            custom_range1: parseInt(price_min.current.value), 
            custom_range2: parseInt(price_max.current.value) 
            })
          }
            }>Apply</button>
        </div>
        
      </div>
      
    </div>
  )
}
  
export default Products;