import React, { useEffect, useState } from 'react'
import farmerService from '../../Appwrite/Farmer'
import productService from '../../Appwrite/Product'
import {ProductCard} from '../../Index'

function Orders() {
  const [order , setOrder] = useState([])

  useEffect(() => {
    const fetchOrder = async() =>{
      try {
        const userData = await farmerService.getCurrentUser()

        const res = await productService.getOrder(userData.$id)
        if(res.documents && res.documents.length > 0){
          setOrder(res.documents)
        }
        else{
          setOrder([])
        }
      } catch (error) {
        console.log('fetch ord err', error)
      }
    } 
    fetchOrder()
  },[])

  const cancelOrder = async (productID) => {
    try {
      const userData = await farmerService.getCurrentUser()
      const res = await productService.removeOrder({ productID, userID: userData.$id })
  
      if (res) {
        // ✅ Update UI
        setOrder(prev => prev.filter(item => item.$id !== productID))
        console.log('Order cancelled')
      } else {
        console.log('Error cancelling order')
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-2 p-3 gap-3 md:grid-cols-5 md:px-6 md:gap-8 pb-5">
        {order && order.length > 0 ? (
          order.map((product) => (
            <div key={product.$id}>
              <ProductCard
                $id={product.$id}
                title={product.name}
                photo={product.photo}
                price={product.price}
              />
              <div className=' flex justify-between'>
              <button
                onClick={() => cancelOrder(product.$id)}
                className="px-3 py-2 bg-red-300 rounded-lg font-medium mt-2"
              >
                Cancel
              </button>
              <button
                
                className="px-3 py-2 bg-yellow-300 rounded-lg font-medium mt-2"
              >
                track
              </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 font-semibold">No orders found.</p>
        )}
      </div>
    </div>
  )
  
}

export default Orders