import React, { useEffect, useState } from 'react'
import productService from '../../Appwrite/Product'
import ProductCard from '../ui/ProductCard'
import farmerService from '../../Appwrite/Farmer'

function Home() {
    const menu = [
        {name: 'All' },
        {name: 'Grain' },
        {name: 'Fruits'},
        {name: 'Vegetables'},
        {name: 'pulses'},
        {name: 'Dairy'},
        {name: 'Poultry'},
        {name: 'Spices'},
        {name: 'Others'}
    ]

    const [products , setProducts] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productService.listAllProducts()
                if(res.documents && res.documents.length > 0){
                    setProducts(res.documents)
                    
                }
                else{
                    setProducts([])
                }
            } catch (error) {
                console.log('home fetch pro erroe' , error)
            }
        }
        fetchProducts()
    },[])

    const listCategory = async (category) => {
        try {
            if(category === 'All'){
                const res = await productService.listAllProducts()
                if(res.documents && res.documents.length > 0){
                    setProducts(res.documents)
                    
                }
            }
            const res = await productService.listProductsByCategory(category)
            if(res.documents && res.documents.length > 0){
                setProducts(res.documents)
            }
            else{
                <h2>no Products to this category</h2>
            }
        } catch (error) {
            console.log('home cate erroe', error)
        }
    }
     
  return (
    <div className=' flex flex-col min-h-screen'>
        <div className=' bg-gradient-to-b from-green-300 via-green-200 to-green-100 flex gap-5 px-2 py-3 overflow-y-auto scroll-smooth md:gap-7 md:px-6'>
            {menu.map((item) => (
                <h3 className='text-lg font-medium text-gray-800 cursor-pointer' onClick={() => listCategory(item.name)}>{item.name}</h3>
            ))}
        </div>
        <div className='grid grid-cols-2 p-3 gap-3 md:grid-cols-5 md:px-6 md:gap-8'>
            {products.map((product) => (
                <div key={product.$id}>
                    <ProductCard 
                    $id = {product.$id}
                    title={product.name}
                    photo={product.photo}
                    price={product.price}
                    farmerID={product.farmerID}
                    />
                </div>
            ))}
        </div>
    </div>
  )
}

export default Home