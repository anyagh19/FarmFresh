import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import farmerService from '../../Appwrite/Farmer';
import productService from '../../Appwrite/Product';
import { toast } from 'react-toastify';

function ProductPage() {
    const { productID } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    useEffect(() => {
        async function fetchProductAndReviews() {
            try {
                const fetchedProduct = await productService.getProduct(productID);
                const fetchedReviews = await productService.getReviews(productID); // You should implement this in your service
                if (fetchedProduct) {
                    setProduct(fetchedProduct);
                }
                if(fetchedReviews.documents && fetchedReviews.documents.length > 0){
                    setReviews(fetchedReviews.documents)
                }
            } catch (error) {
                console.error('Error fetching product/reviews:', error);
            }
        }

        fetchProductAndReviews();
    }, [productID]);

    const addCart = async (data) => {
        try {
            const userData = await farmerService.getCurrentUser();
            const res = await productService.addToCart({ ...data, userID: userData.$id });
            if (res) toast.success('Added to cart', { position: 'top-center' });
        } catch (error) {
            toast.error('Error adding to cart');
        }
    };

    const addWish = async (data) => {
        try {
            const userData = await farmerService.getCurrentUser();
            const res = await productService.addToWishlist({ ...data, userID: userData.$id });
            if (res) toast.success('Added to wishlist', { position: 'top-center' });
        } catch (error) {
            toast.error('Error adding to wishlist');
        }
    };

    const submitReview = async () => {
        if (!rating || !reviewText) {
            return toast.warning("Please fill out both rating and review.");
        }

        try {
            const userData = await farmerService.getCurrentUser();
            const newReview = {
                productID,
                userID: userData.$id,
                rate: rating.toString(),
                view: reviewText,
                userName: userData.name || 'Anonymous'
            };

            await productService.addReview(newReview);
            toast.success("Review submitted!");
            setReviews(prev => [...prev, newReview]);
            setShowReviewForm(false);
            setRating(0);
            setReviewText("");
        } catch (error) {
            toast.error("Error submitting review.");
        }
    };

    if (!product) {
        return <div className="p-4 text-lg">Loading product details...</div>;
    }

    return (
        <div className="p-4 flex gap-7 flex-col md:flex-row relative">
            <div>
                <img
                    src={farmerService.getProductFilePreview(product.photo)}
                    alt={product.name}
                    className="md:w-[400px] md:h-[500px] md:ml-0 h-[400px] w-[80%] ml-[10%] object-fill rounded-lg shadow-md"
                />
            </div>
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                <p className="text-2xl font-semibold text-green-700">₹{product.price}</p>

                <div className='flex gap-5'>
                    <button
                        onClick={() => addWish({ name: product.name, price: product.price, photo: product.photo, productID: product.$id })}
                        className="bg-white border-green-300 text-green-500 px-4 py-2 rounded-lg shadow hover:bg-green-100 transition-all w-1/2"
                    >
                        Wish
                    </button>
                    <button
                        onClick={() => addCart({ name: product.name, price: product.price, photo: product.photo, productID: product.$id })}
                        className="bg-white border-red-300 text-red-500 px-4 py-2 rounded-lg shadow hover:bg-red-100 transition-all w-1/2"
                    >
                        Add
                    </button>
                </div>

                <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-white border-blue-300 text-blue-500 px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition-all w-[50%]"
                >
                    Review
                </button>

                {/* Previous Reviews */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
                    {reviews.length > 0 ? (
                        <div className="space-y-3">
                            {reviews.map((rev, index) => (
                                <div key={index} className="border p-3 rounded-md shadow-sm bg-gray-50">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold">{rev.userName}</span>
                                        <span className="text-yellow-500">⭐ {rev.rate}</span>
                                    </div>
                                    <p>{rev.view}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No reviews yet.</p>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {showReviewForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] md:w-[400px] flex flex-col gap-4 animate-fadeIn">
                        <h2 className="text-xl font-bold">Leave a Review</h2>
                        <label className="text-sm font-medium">Rating (1 to 5)</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="border rounded-md p-2"
                        />
                        <label className="text-sm font-medium">Your Review</label>
                        <textarea
                            rows="4"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="border rounded-md p-2"
                            placeholder="Write your experience..."
                        />
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                onClick={() => setShowReviewForm(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReview}
                                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductPage;
