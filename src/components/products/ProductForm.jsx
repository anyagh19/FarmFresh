import React, { useState ,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Input, Button, Select } from '../../Index';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import farmerService from '../../Appwrite/Farmer';

function ProductForm({ product }) {

    const { register, handleSubmit, watch, setValue, getValues } = useForm({
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            quantity: product?.quantity || '',
            price: product?.price || '',
            photo: product?.productImage || '',
            pickUpAddress: product?.pickUpAddress || '',

        }
    });

    const [error, setError] = useState('');
    const [villages, setVillages] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const pincode = watch('pincode');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    // userData = useSelector((state) => state.auth.userData);

    const resetForm = () => {
        setValue('title', '');
        setValue('description', '');
        //setValue('category', '');
        setValue('price', '');
        setValue('address', '');
       
        setFile(null);
    };

    const submit = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const userData = await farmerService.getCurrentUser()
            if (!userData?.$id) {
                toast.error("You need to log in first!", { position: "top-center" });
                return;
            }

            let fileID = null;
            if (file) {
                const uploadedFile = await farmerService.uploadProductFile(file, userData.$id);
                fileID = uploadedFile.$id;
            }

            if (product) {
                if (fileID) {
                    await farmerService.deleteProductFile(product.photo);
                }
                const dbProduct = await farmerService.uploadProductFile(product.$id, {
                    ...data,
                    photo: fileID || product.photo,
                   
                });

                if (dbProduct) {
                    toast.success("Product Updated Successfully!", { position: "top-center" });
                    navigate(`/product/${dbProduct.$id}`);
                }
            } else {
                const dbProduct = await farmerService.addProduct({
                    ...data,
                    photo: fileID,
                    farmerID: userData.$id,
                    pickUpAddress: JSON.stringify({
                        pincode : data.pincode ,
                        state : data.state,
                        district: data.district ,
                        taluka: data.taluka,
                        village: data.village,
                        local: data.local
                    })
                });

                if (dbProduct) {
                    toast.success("Product Added Successfully!", { position: "top-center" });
                    navigate(`/my-products`);
                    resetForm();
                }
            }
        } catch (error) {
            console.error("Error in submission:", error);
            toast.error("Failed to process the request. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

     useEffect(() => {
        if (pincode && pincode.length === 6) {
          setLoadingLocation(true);
          fetch(`https://api.postalpincode.in/pincode/${pincode}`)
            .then(res => res.json())
            .then(data => {
              const postOffices = data[0]?.PostOffice;
              if (postOffices && postOffices.length > 0) {
                const first = postOffices[0];
                const villageNames = postOffices.map(po => po.Name);
    
                setValue('state', first.State);
                setValue('district', first.District);
                setValue('taluka', first.Block || first.Taluk || '');
                setVillages(villageNames);
                setError('');
              } else {
                setError('Invalid Pincode or No data found');
                setVillages([]);
                setValue('state', '');
                setValue('district', '');
                setValue('taluka', '');
              }
            })
            .catch(err => {
              console.error(err);
              setError('Failed to fetch location data');
            })
            .finally(() => setLoadingLocation(false));
        }
      }, [pincode, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="w-full min-h-screen flex flex-col md:flex-row gap-6 p-8 bg-gray-50 rounded-lg shadow-md">
            <div className="flex flex-col gap-6 w-full md:w-1/2">
                <Input
                    label="Title:"
                    type="text"
                    placeholder="Enter title"
                    className="w-full border-gray-300 rounded-lg shadow-sm p-3"
                    {...register("name", { required: true })}
                />
                <Select
                    label="Category"
                    options={["grain" , "fruits" , "vegetables",  "pulses" , "dairy" , "poultry" ,"spices" , "others"]}
                    className="w-full border-gray-300 rounded-lg shadow-sm p-3"
                    {...register("category", { required: true })}
                />
                <Input
                    label="Description"
                    name="description"
                    className="border-gray-300 rounded-lg shadow-sm py-6 px-3"

                    {...register ("description", {required : true})}
                />
                <Input
                    label="Product Image:"
                    type="file"
                    className="border-gray-300 rounded-lg shadow-sm p-3"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                />
                {product?.productImage ? (
                    <div className="w-full">
                        <img
                            src={farmerService.getProductFilePreview(product.productImage)}
                            alt={product.title}
                            className="rounded-lg shadow-md"
                        />
                    </div>
                ) : (
                    <p className="text-gray-500">No preview available</p>
                )}

                <Input
                    label="quantiy"
                    type="text"
                    placeholder="Enter Quantity"
                    className="w-full border-gray-300 rounded-lg shadow-sm p-3"
                    {...register("quantity", { required: true })}
                />
                
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6">
                
            <Input
                    label="Price"
                    type="text"
                    placeholder="Enter price"
                    className="border-gray-300 rounded-lg shadow-sm p-3"
                    {...register("price", { required: true })}
                />
                <Input
                            {...register('pincode', { required: true })}
                            type="number"
                            placeholder="Enter pincode"
                            className='w-full border-gray-300 rounded-lg shadow-sm p-3'
                          />
                
                          <Input 
                          {...register('state', { required: true })} 
                          readOnly placeholder="State" 
                          className='w-full border-gray-300 rounded-lg shadow-sm p-3'
                          />
                          <Input 
                          {...register('district', { required: true })} 
                          readOnly placeholder="District"
                          className='w-full border-gray-300 rounded-lg shadow-sm p-3'
                          />
                          <Input
                           {...register('taluka', { required: true })} 
                           readOnly 
                           placeholder="Taluka" 
                           className='w-full border-gray-300 rounded-lg shadow-sm p-3'
                           />
                
                          <Select
                            label="Village"
                            options={villages}
                            className="w-full border-gray-300 rounded-lg shadow-sm p-3"
                            {...register('village', { required: true })}
                          />
                
                          <Input 
                          {...register('local', { required: true })} 
                          type="text" 
                          placeholder="Enter local address"
                          className='w-full border-gray-300 rounded-lg shadow-sm p-3' 
                           />

                <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
                    {isSubmitting ? "Processing..." : product ? "Update Product" : "Submit Product"}
                </Button>
            </div>
        </form>
    );
}

export default ProductForm;