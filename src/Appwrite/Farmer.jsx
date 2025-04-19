import {Client, Account , Databases , ID , Query , Storage, Permission , Role} from 'appwrite'
import conf from '../conf/conf'

export class FarmerService{
    client = new Client()
    account
    database
    bucket

    constructor(){
        this.client
            .setEndpoint(conf.appwriteEndpoint) 
            .setProject(conf.appwriteProjectID) 

        this.account = new Account(this.client)
        this.database = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    async createFarmer({farmerID = ID.unique(), name, email, phone, password ,address, role}){
        try {
            const farmer = await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteFarmersCollectionID,
                farmerID,
                {
                    farmerID,
                    name,
                    email,
                    phone,
                    password,
                    address,
                    role
                }
            )

            if(!farmer) {
                throw new Error("Failed to create farmer")
            }
            else{
                const res = await this.account.create(farmerID, email, password, name)

                

                if(!res) {
                    throw new Error("Failed to create account")
                }
                else{
                    const res2 =await this.farmerLogin({email, password})

                    if(res2){
                        await this.account.updatePrefs(
                            {role: role}
                        )
                    }
                }
            }
        } catch (error) {
            console.error("Error creating farmer:", error)
            throw error
        }
    }

    async farmerLogin({email, password}){
        try {
            const session = await this.account.createEmailPasswordSession(
                email,
                password
            )

            if(!session) {
                throw new Error("Failed to login farmer")
            }
            return session;
        } catch (error) {
            console.error("Error logging in farmer:", error)
            throw error
        }
    }

    async logout(){
        try {
            return this.account.deleteSession('current')
        } catch (error) {
            console.log('app log out error' , error)
        }
    }

    async getCurrentUser(){
        try {
            return this.account.get()
        } catch (error) {
            console.error("Error getting current user:", error)

        }
    }

    async getFarmerById(farmerID){
        try {
            return this.database.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteFarmersCollectionID,
                farmerID
            )
        } catch (error) {
            console.error("Error getting farmer by ID:", error)
        }
    }

    async addProduct({productID=ID.unique() , farmerID , name , description , photo , price , quantity , pickUpAddress, category}){
        try {
            return this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteProductsCollectionID,
                productID,
                {
                    productID,
                    farmerID,
                    name,
                    description,
                    photo,
                    price,
                    quantity ,
                    pickUpAddress,
                    category
                }
            )
        } catch (error) {
            console.log('product creation error', error)
        }
    }

    async uploadProductFile(file, userID) {
        try {
            if (!userID) throw new Error("User ID is required for permission handling.");

            const fileID = ID.unique(); // Generate a unique ID for the file
            const permissions = [
                Permission.read(Role.any()), // Public read
                Permission.write(Role.user(userID)), // User write access
            ];

            const uploadedFile = await this.bucket.createFile(
                conf.appwriteBucketCollectionID,
                fileID,
                file,
                permissions
            );

            console.log('File uploaded with ID:', uploadedFile.$id);
            return uploadedFile;
        } catch (error) {
            console.log('upload file error', error);
            throw error;
        }
    }

    async deleteProductFile(fileID) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketCollectionID,
                fileID
            )
            return true;
        } catch (error) {
            console.log('delete file error', error);
            throw error;
        }
    }

    getProductFilePreview(fileID) {
        if (!fileID) {
            console.warn("Warning: fileId is missing in getProductFilePreview");
            return "/default-image.png"; // Provide a placeholder image
        }
        // Log the file ID
        return this.bucket.getFileView(
            conf.appwriteBucketCollectionID,
            fileID
        );
    }

    async listFarmerProducts(farmerID){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteProductsCollectionID,
                [Query.equal('farmerID', farmerID)]
            )
        } catch (error) {
            console.log('list farmer pro erroe', error)
        }
    }

}


export const farmerService = new FarmerService();

export default farmerService;