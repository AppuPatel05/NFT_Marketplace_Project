import React from 'react'
import { Col, Card, Button } from "react-bootstrap";
import { ethers } from "ethers";
import '../pages/Home/Home.css'
function NFTCardListItem({item,idx,buyMarketItem}) {
    
  return (
<Col key={idx} className="overflow-hidden">
                        <Card
                          style={{
                            
                          }}
                        >
                          <Card.Img
                            variant="top"
                            style={{ padding: "20px", paddingBottom: "0px",height:'30vh' }}
                            src={item.image}
                          />
                          <Card.Body
                            color="secondary"
                            style={{ 
                              color: "white" ,
                              height:'100px',
                              position: 'relative',
                              width: '100%',
                            }}
                          >
                            <Card.Text
                              className="card-text-username"
                            >
                              @{item.username}
                            </Card.Text>
                            <br></br>
                            <Card.Title
                              
                            >
                              {item.name}
                            </Card.Title>

                            <Card.Text
                              className='card-text-price'
                            >
                              <span
                                className='card-text-price-p'
                              >
                                Price
                              </span>
                              <br></br>
                              {ethers.utils.formatEther(item.totalPrice)}{" "} ETH
                            </Card.Text>
                          </Card.Body>
                          <Card.Footer>
                            <div className="d-grid">
                              
                                <Button
                                  onClick={() => buyMarketItem(item)}
                                  variant="primary"
                                  size="lg"
                                  style={{
                                    background:
                                      " linear-gradient(214.02deg, #B75CFF 6.04%, #671AE4 92.95%)",
                                    outline: "none",
                                    border: "none",
                                  }}
                                >
                                  Buy
                                </Button>
                            </div>
                          </Card.Footer>
                        </Card>
                      </Col>
                        )
                    }
                    
export default NFTCardListItem