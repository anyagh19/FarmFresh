const conf = {
    appwriteEndpoint: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
    appwriteProjectID : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseID : String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteBucketCollectionID : String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteFarmersCollectionID : String(import.meta.env.VITE_APPWRITE_FARMERS_COLLECTION_ID),
    appwriteProductsCollectionID : String(import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID),
    appwriteCartCollectionID : String(import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID),
    appwriteOrdersCollectionID : String(import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID),
    appwriteWishlistCollectionID : String(import.meta.env.VITE_APPWRITE_WISHLIST_COLLECTION_ID),
    appwriteReviewsCollectionID : String(import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION_ID),
    appwriteUserCollectionID : String(import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID),
    WeatherKey : String(import.meta.env.VITE_WEATHER_API_KEY)
}

export default conf;