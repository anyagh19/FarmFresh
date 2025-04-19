import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import farmerService from '../../Appwrite/Farmer';
import productService from '../../Appwrite/Product';

function ProductPage() {
    const { productID } = useParams();
    const [product, setProduct] = useState(null);
    const [isAddedToCart, setIsAddedToCart] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const fetchedProduct = await productService.getProduct(productID);
                if (fetchedProduct) {
                    setProduct(fetchedProduct);
                    console.log('Fetched product:', fetchedProduct);
                } else {
                    console.log('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        }

        fetchProduct();
    }, [productID]);

    const addCart = async ({ name, price, photo, productID }) => {
        try {
            const userData = await farmerService.getCurrentUser();

            const res = await productService.addToCart({
                productID,
                userID: userData.$id,
                name,
                price,
                photo,
            });

            if (res) {
                console.log('add success');
                toast.success('Added to cart', { position: 'top-center' });
            } else {
                console.log('Add to cart failed');
            }
        } catch (error) {
            console.log('Add to cart error', error);
        }
    };


    if (!product) {
        return <div className="p-4 text-lg">Loading product details...</div>;
    }

    return (
        <div className="p-4 flex gap-7 flex-col md:flex-row">
            <div>
                <img
                    src={farmerService.getProductFilePreview(product.photo)}
                    alt={product.name}
                    className="md:w-[400px] md:h-[500px] md:ml-0 h-[400px] w-[80%] ml-[10%] object-fill"
                />
            </div>
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-semibold">{product.name}</h1>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                <p className="font-semibold text-2xl">₹{product.price}</p>

                <button
                    onClick={() =>
                        addCart({
                            name: product.name,
                            price: product.price,
                            photo: product.photo,
                            productID: product.$id,
                        })
                    }
                    className="bg-white border-red-200 border-[1.5px] text-red-400 px-3 py-2 rounded-lg font-medium w-[50%]"
                >
                    Add
                </button>

            </div>
        </div>
    );
}

export default ProductPage;
