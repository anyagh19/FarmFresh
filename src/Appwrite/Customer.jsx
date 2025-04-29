import { Account, Client, Databases, ID } from "appwrite";
import conf from "../conf/conf";

export class UserService {
    client = new Client();
    account;
    database;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteEndpoint)
            .setProject(conf.appwriteProjectID);

        this.database = new Databases(this.client);
        this.account = new Account(this.client);  // fix: pass client here
    }

    async createUser({ userID = ID.unique(), name, email, phone, password, address, role }) {
        try {
            // Create a document in the database
            const user = await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteUserCollectionID,
                userID,
                {
                    userID,
                    name,
                    email,
                    phone,
                    password,
                    address,
                    role
                }
            );

            console.log("Database user created:", user);

            if (!user || !user.$id) {
                throw new Error("Failed to create user document");
            }

            // Create an account in Appwrite auth
            const res = await this.account.create(userID, email, password, name);
            console.log("Account created:", res);

            if (!res) {
                throw new Error("Failed to create Appwrite account");
            }

            // Login after account creation
            const session = await this.login({ email, password });
            console.log("Session created:", session);

            if (session) {
                // Update user's preferences (e.g., role)
                await this.account.updatePrefs({ role });
            }

            return { user, session }; // returning both document and session
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);

            if (!session) {
                throw new Error("Failed to login user");
            }
            return session;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    async getCustomerById(userID){
        try {
            return this.database.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteFarmersCollectionID,
                userID
            )
        } catch (error) {
            console.error("Error getting farmer by ID:", error)
        }
    }
}

export const userService = new UserService();
export default userService;
