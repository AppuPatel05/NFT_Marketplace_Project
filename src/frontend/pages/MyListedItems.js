import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'

function renderSoldItems(items) {
  return (
    <>
      <h2>Sold</h2>
      
      <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            color:'white'
                          }}>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>Name:{item.name} </Card.Footer>
                  <Card.Footer>Price:{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
    </>
  )
}

export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx)
      if (i.seller.toLowerCase() === account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(item)
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item)
      }
    }
    setLoading(false)
    setListedItems(listedItems)
    setSoldItems(soldItems)
  }
  useEffect(() => {
    loadListedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center" style={{color:'white'}}>
      <h2 className='data_h2'>Listed Items</h2>
    {listedItems.length > 0 ?
      <div className="px-5 container">
        
        <Row xs={1} md={2} lg={4} className="g-4 py-5">
          {listedItems.map((item, idx) => (
            <Col key={idx} className="overflow-hidden">
              <Card style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          color:'white'
                        }}>
                <Card.Img variant="top" src={item.image} />
                <Card.Footer>Name:{item.name} </Card.Footer>
                <Card.Footer>Price:{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        {soldItems.length > 0 && renderSoldItems(soldItems)}
      </div>
    // <div className="flex justify-center">
    //   {listedItems.length > 0 ?
    //     <div className="px-5 py-3 container">
    //         <h2>Listed</h2>
    //       <Row xs={1} md={2} lg={4} className="g-4 py-3">
    //         {listedItems.map((item, idx) => (
    //           <Col key={idx} className="overflow-hidden">
    //             <Card>
    //               <Card.Img variant="top" src={item.image} />
    //               <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
    //             </Card>
    //           </Col>
    //         ))}
    //       </Row>
    //         {soldItems.length > 0 && renderSoldItems(soldItems)}
    //     </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}