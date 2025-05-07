import { configureStore } from "@reduxjs/toolkit";
import authSlice from './AuthSlice'
import addressReducer from './AddressSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        address: addressReducer,
    }
})

export default store