import React, { useEffect, useState } from 'react'
import farmerService from '../../Appwrite/Farmer'
import { Link } from 'react-router-dom'
import productService from '../../Appwrite/Product'
import { toast } from 'react-toastify'

function ProductCard({ $id, title, price, photo, farmerID }) {
    const [role, setRole] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await farmerService.getCurrentUser()
                if (user) {
                    setRole(user.role)
                }
            } catch (error) {
                console.log('card fetch error', error)
            }
        }
        fetchUser()
    }, [])

    const addCart = async (product) => {
        try {
            const userData = await farmerService.getCurrentUser()
            

            const res = await productService.addToCart({
                productID: $id,
                userID : userData.$id,
                name: title,
                price : price,
                photo: photo,
                
            })

            if(res){
                console.log('add secc')
                toast.success('added to cart', {position: 'top-center'})
            }
            else{
                console.log(error)
            }
        } catch (error) {
            console.log('card cart error', error)
        }
    }

    const productImageUrl = photo
        ? farmerService.getProductFilePreview(photo)
        : "/default-image.png";
    
    // Hide the button if the logged-in user is the farmer of the product
    const showAddToCartButton = farmerID !== farmerService.getCurrentUser().$id  ;

    return (
        
            <div className='flex flex-col gap-2 '>
                <Link to={`/product/${$id}`}>
                <div>
                    <img src={productImageUrl} alt={title} 
                        className="w-full h-48 md:h-[300px] object-fill rounded-md" 
                    />
                </div>
                <h3 className='font-medium'>{title}</h3>
                </Link>
                <div className=' flex gap-2 items-center md:justify-between'>
                    <h2 className='font-semibold'>Rs.{price}</h2>
                    {showAddToCartButton && (
                        <button onClick={() => addCart({name: title , price , photo})} className='bg-white border-red-200 border-[1.5px] text-red-400 px-3 py-2 rounded-lg font-medium w-[50%]'>
                            Add 
                        </button>
                    )}
                </div>
            </div>
        
    )
}

export default ProductCard
