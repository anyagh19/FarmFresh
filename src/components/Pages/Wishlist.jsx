import React, { useEffect, useState } from 'react'
import farmerService from '../../Appwrite/Farmer'
import productService from '../../Appwrite/Product'
import {ProductCard} from '../../Index'

function Wishlist() {
  const [wish , setWish] = useState([])

  useEffect(() => {
    const fetchOrder = async() =>{
      try {
        const userData = await farmerService.getCurrentUser()

        const res = await productService.getWish(userData.$id)
        if(res.documents && res.documents.length > 0){
          setWish(res.documents)
        }
        else{
          setWish([])
        }
      } catch (error) {
        console.log('fetch ord err', error)
      }
    } 
    fetchOrder()
  },[])

  const cancelWish = async (documentID) => {
    try {
      const res = await productService.deleteWishlistById(documentID)
  
      if (res) {
        setWish(prev => prev.filter(item => item.$id !== documentID))
        console.log('Wish cancelled')
      } else {
        console.log('Error cancelling wish')
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-2 p-3 gap-3 md:grid-cols-5 md:px-6 md:gap-8 pb-5">
        {wish && wish.length > 0 ? (
          wish.map((product) => (
            <div key={product.$id}>
              <ProductCard
                $id={product.$id}
                title={product.name}
                photo={product.photo}
                price={product.price}
              />
              <button
                onClick={() => cancelWish(product.$id)}
                className="px-3 py-2 bg-red-300 rounded-lg font-medium mt-2"
              >
                Cancel Wish
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 font-semibold">No orders found.</p>
        )}
      </div>
    </div>
  )
  
}

export default Wishlist