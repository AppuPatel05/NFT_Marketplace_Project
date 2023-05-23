import React from 'react'
import { Row} from "react-bootstrap";
import NFTCardListItem from './NFTCardListItem';
import '../pages/Home/Home.css'
function NFTCardList({items,buyMarketItem,selectCategory}) {
    
  return (
    <div className="px-5 container nft-card-list" >
                  <Row xs={1} md={2} lg={3} className="g-2 py-5">
                    {items.map((item, idx) => (
                      (item.category===selectCategory || selectCategory==='All' )?(
                        <NFTCardListItem item={item}  idx={idx} buyMarketItem={buyMarketItem} key={idx}></NFTCardListItem>
                      ):''
                      
                    ))}
                  </Row>
                </div>
  )
}

export default NFTCardList

