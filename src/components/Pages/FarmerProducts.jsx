import React, { useEffect, useState } from 'react'
import farmerService from '../../Appwrite/Farmer'
import {ProductCard} from '../../Index'

function FarmerProducts() {
    const [products , setProducts] = useState([])
    const [id , setID] = useState()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const userData = await farmerService.getCurrentUser()
                console.log('usrer',userData.$id)
                setID(userData.$id)
                if(userData){
                    const res = await farmerService.listFarmerProducts(userData.$id)
                    if(res.documents && res.documents.length > 0){
                        setProducts(res.documents)
                    }
                    else{
                        setProducts([])
                        
                    }
                }
            } catch (error) {
                console.log('farm fetch error', error)
            }
        }
        fetchProducts()
    },[])
  return (
    <div><div className='grid grid-cols-2 p-3 gap-3 md:grid-cols-5 md:px-6 md:gap-8'>
    {products.map((product) => (
    <div key={product.$id}>
        <ProductCard 
            $id={product.$id}
            title={product.name}
            photo={product.photo}
            price={product.price}
             // pass the farmerID of the product
        />
    </div>
))}

</div></div>
  )
}

export default FarmerProducts