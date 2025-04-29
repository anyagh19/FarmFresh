import React, { useEffect, useState } from 'react';
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

    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');  // Track selected category

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productService.listAllProducts();
                if (res.documents && res.documents.length > 0) {
                    setProducts(res.documents);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.log('home fetch pro error', error);
            }
        };
        fetchProducts();
    }, []);

    const listCategory = async (category) => {
        try {
            if (category === 'All') {
                const res = await productService.listAllProducts();
                if (res.documents && res.documents.length > 0) {
                    setProducts(res.documents);
                }
            } else {
                const res = await productService.listProductsByCategory(category);
                if (res.documents && res.documents.length > 0) {
                    setProducts(res.documents);
                } else {
                    setProducts([]);
                }
            }
        } catch (error) {
            console.log('home cate error', error);
        }
    };

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        listCategory(category);
    };

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
        </div>
    );
}

export default Home;
