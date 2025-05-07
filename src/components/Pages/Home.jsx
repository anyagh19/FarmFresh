import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import productService from '../../Appwrite/Product';
import ProductCard from '../ui/ProductCard';

function Home() {
    const menu = [
        { name: 'All' },
        { name: 'Grain' },
        { name: 'Fruits' },
        { name: 'Vegetables' },
        { name: 'Pulses' },
        { name: 'Dairy' },
        { name: 'Poultry' },
        { name: 'Spices' },
        { name: 'Others' }
    ];

    const location = useLocation();
    const [address, setAddress] = useState(location.state?.address || {});
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Fetch products based on address pincode
   // Fetch products based on address pincode
useEffect(() => {
    const fetchProductsByPincode = async () => {
        try {
            const res = await productService.listAllProducts();

            if (res.documents) {
                const filteredProducts = res.documents.filter((product) => {
                    try {
                        const pickUpAddress = typeof product.pickUpAddress === 'string'
                            ? JSON.parse(product.pickUpAddress)
                            : product.pickUpAddress;

                        // Log the actual address of each filtered product
                        console.log("Product Address:", pickUpAddress);
                        console.log("Selected Address:", address);

                        return pickUpAddress?.pincode === address.pincode;
                    } catch (error) {
                        console.error('Error parsing pickUpAddress:', error);
                        return false;
                    }
                });

                setProducts(filteredProducts);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products by pincode:', error);
            setProducts([]);
        }
    };

    if (address.pincode) {
        fetchProductsByPincode();
    }
}, [address]);

    
    // Sync address with location state
    useEffect(() => {
        const newAddress = location.state?.address || {};
        if (JSON.stringify(address) !== JSON.stringify(newAddress)) {
            setAddress(newAddress);
        }
    }, [location.state]);
   

    // Filter products by selected category
    const listCategory = async (category) => {
        try {
            let res;
            if (category === 'All') {
                res = await productService.listAllProducts();
            } else {
                res = await productService.listProductsByCategory(category);
            }

            if (res.documents && res.documents.length > 0) {
                setProducts(res.documents);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching category products:', error);
        }
    };

    // Handle category change
    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        listCategory(category);
    };

    // Handle address change from location
    useEffect(() => {
        const newAddress = location.state?.address || {};
        if (JSON.stringify(address) !== JSON.stringify(newAddress)) {
            setAddress(newAddress);
        }
    }, [location.state]);

    return (
        <div className='flex flex-col min-h-screen'>
            {/* Category Select Dropdown */}
            <div className='bg-gradient-to-b from-green-300 via-green-200 to-green-100 flex items-center justify-end gap-4 px-4 py-3'>
                <select
                    className='px-4 py-2 rounded-md text-sm font-medium border-2 border-gray-800'
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    {menu.map((item) => (
                        <option key={item.name} value={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Product List */}
            <div className='grid grid-cols-2 p-3 gap-3 md:grid-cols-5 md:px-6 md:gap-8'>
                {products.map((product) => (
                    <div key={product.$id}>
                        <ProductCard
                            $id={product.$id}
                            title={product.name}
                            photo={product.photo}
                            price={product.price}
                            farmerID={product.farmerID}
                        />
                    </div>
                ))}
            </div>

            {/* Show message if no products are found */}
            {products.length === 0 && (
                <div className='text-center text-gray-500 my-10'>
                    No products found for the selected location.
                </div>
            )}
        </div>
    );
}

export default Home;
