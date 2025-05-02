import { Client , Databases , ID , Storage , Query } from "appwrite";
import conf from "../conf/conf";

export class ProductService {
    client = new Client()
    database
    bucket

    constructor(){
        this.client
            .setEndpoint(conf.appwriteEndpoint)
            .setProject(conf.appwriteProjectID)

        this.database = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    async listAllProducts(){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteProductsCollectionID
            )
        } catch (error) {
            console.log('list all pro error' , error)
        }
    }

    async listProductsByCategory(category){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteProductsCollectionID,
                [Query.equal('category', category)]
            )
        } catch (error) {
            console.log('list by cate error', error)
        }
    }

    async getProduct(productID) {
        try {
            if (!productID) {
                console.log('product id error')
            }
            return await this.database.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteProductsCollectionID,
                productID
            )
        } catch (error) {
            console.log('get error', error)
            throw error
        }
    }

    async addToCart({productID , userID , name , photo , price , }){
        try {
            return this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCartCollectionID,
                ID.unique(),
                {
                    productID,
                    userID,
                    name,
                    price,
                    photo,
                    
                }
            )
        } catch (error) {
            console.log('add cart error' , error)
        }
    }

    async removeFromCart(productID){
        try {
            return await this.database.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCartCollectionID,
                productID
            )
        } catch (error) {
            console.log('rem erroe', error)
        }
    }

    async getCartProducts(userID){
        try {
            return this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteCartCollectionID,
                [Query.equal('userID' , userID)]
            )
        } catch (error) {
            console.log('get cart errror', error)
        }
    }

    async removeAllCartProduct(userID){
        try {
            const item = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteCartCollectionID,
                [Query.equal('userID', userID)]
            )

            await Promise.all(item.documents.map(item => this.database.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCartCollectionID,
                item.$id
            )))
        } catch (error) {
            console.log('all rem err'), error
        }
    }

    async addToOrders({productID , userID , name , price , photo , address , }){
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteOrdersCollectionID,
                ID.unique(),
                {
                    productID,
                    userID,
                    name,
                    photo,
                    price,
                    address,
                    
                }
            )
        } catch (error) {
            console.log("add to ord error" , error)
        }
    }

    async getOrder(userID){
        try {
            return this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteOrdersCollectionID,
                [Query.equal('userID' , userID)]
            )
        } catch (error) {
            console.log('get ord error' ,error)
        }
    }

    async removeOrder({ productID, userID }) {
        try {
          const items = await this.database.listDocuments(
            conf.appwriteDatabaseID,
            conf.appwriteOrdersCollectionID,
            [
              Query.equal('productID', productID),
              Query.equal('userID', userID),
            ]
          )
      
          await Promise.all(
            items.documents.map(item =>
              this.database.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteOrdersCollectionID,
                item.$id
              )
            )
          )
      
          return true // ✅ Return success
        } catch (error) {
          console.log('del ord err', error)
          return false // ✅ Return failure
        }
      }
      
      async searchProduct(queryText){
        try {
            const response = await this.database.listDocuments(
              conf.appwriteDatabaseID,
              conf.appwriteProductsCollectionID,
              [
                Query.or([
                  Query.startsWith("name", queryText),
                  Query.startsWith("category", queryText),
                ])
              ]
            );
            return response.documents;
          } catch (error) {
            console.log("Search error", error);
            return [];
          }
      }

      async addToWishlist({productID , userID , name , price , photo}){
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteWishlistCollectionID,
                ID.unique(),
                {
                    productID,
                    userID,
                    name, 
                    photo , 
                    price
                }
            )
        } catch (error) {
            console.log(error)
        }
      }

      async getWish(userID){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteWishlistCollectionID,
                [Query.equal('userID' , userID)]
            )
        } catch (error) {
            console.log('get ord error' ,error)
        }
    }

    async deleteWishlistById(documentID) {
        try {
          return await this.database.deleteDocument(
            conf.appwriteDatabaseID,
            conf.appwriteWishlistCollectionID,
            documentID
          )
        } catch (error) {
          console.log('deleteWishlistById error:', error)
          return null
        }
      }
      
    
      async addReview({productID , userID , rate , view}){
        try {
            return this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteReviewsCollectionID,
                ID.unique(),
                {
                    productID,
                    userID,
                    rate,
                    view
                }
            )
        } catch (error) {
            console.log(error)
        }
      }

      async getReviews(productID){
        try {
            return this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteReviewsCollectionID,
                [
                    Query.equal('productID', productID)
                ]
            )
        } catch (error) {
            console.log(error)
        }
      }
}


export const productService = new ProductService()

export default productService;