async function test(){

    const response = await fetch('https://fortnite-api.com/v2/cosmetics/br/new')
    const items = await response.json()
    
    console.log(items)

}