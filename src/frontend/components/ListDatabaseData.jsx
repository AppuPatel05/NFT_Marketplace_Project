
import React,{ useEffect, useState } from 'react'
import loadData from './loadData';


function ListDatabaseData(props) {
    
    const [nftCount, setNftCount] = useState();
    const [userCount, setUserCount] = useState();
    const [transactionCount, setTransactionCount] = useState();
  
    useEffect(()=>{
        loadData()
          .then((response) => {

          })
          .catch((error) => {
          });
    }, [])
  return (
    <ul className="ul_list">
              <li className="li_home_list">
                <p className="home_body_number">{nftCount}+</p>
                <p className="li_body_text">Total NFTs</p>
              </li>
              <li className="li_home_list">
                <p className="home_body_number">{userCount}+</p>
                <p className="li_body_text">Total Users</p>
              </li>
              <li className="li_home_list">
                <p className="home_body_number">{transactionCount}+</p>
                <p className="li_body_text">Total Transactions</p>
              </li>
            </ul>
  )
}

export default ListDatabaseData