import React,{useEffect, useState} from 'react'
import axios from 'axios'
function Detail({ forTotPrice,forURI, nft, marketplace }) {
  const [img,setImg] = useState([])
  const [loading,setLoading] = useState(true)
  const loadDetails = async () => {
    axios.get(forURI)
    .then((response)=>{
      setImg([response.data])
    }
    
    )
    

  }
  useEffect(()=>{
    loadDetails()
    setLoading(!loading)
  },[])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <h1>
      {img.map((item)=> <>
      <h1>{item.name}</h1>
      <img src={item.image}></img>
      <h3>{item.description}</h3>
      </>)}
    </h1>
  )
}

export default Detail