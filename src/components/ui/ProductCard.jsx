import React, { useEffect, useState } from 'react'
import farmerService from '../../Appwrite/Farmer'
import { Link } from 'react-router-dom'
import productService from '../../Appwrite/Product'
import { toast } from 'react-toastify'

function ProductCard({ $id, title, price, photo, farmerID }) {
    const [currentUserID, setCurrentUserID] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await farmerService.getCurrentUser()
                if (user) {
                    setCurrentUserID(user.$id)
                }
            } catch (error) {
                console.log('card fetch error', error)
            }
        }
        fetchUser()
    }, [])

    const addCart = async () => {
        try {
            const userData = await farmerService.getCurrentUser()
            const res = await productService.addToCart({
                productID: $id,
                userID: userData.$id,
                name: title,
                price,
                photo,
            })

            if (res) {
                toast.success('Added to cart', { position: 'top-center' })
            } else {
                console.log('add failed')
            }
        } catch (error) {
            console.log('card cart error', error)
        }
    }

    const productImageUrl = photo
        ? farmerService.getProductFilePreview(photo)
        : "/default-image.png"

    const showAddToCartButton = farmerID !== currentUserID

    return (
        <div className="bg-white shadow rounded-xl p-3 w-full max-w-xs hover:shadow-lg transition">
            <Link to={`/product/${$id}`}>
                <img
                    src={productImageUrl}
                    alt={title}
                    className="w-full h-48 object-cover rounded-md mb-3"
                />
                <h3 className="text-base font-semibold text-gray-800 truncate mb-1">{title}</h3>
            </Link>
            <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">₹{price}</span>
                {showAddToCartButton && (
                    <button
                        onClick={addCart}
                        className="text-sm font-medium text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md"
                    >
                        Add
                    </button>
                )}
                
            </div>
        </div>
    )
}

export default ProductCard
