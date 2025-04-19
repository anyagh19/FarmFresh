import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from '../../Index';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import farmerService from '../../Appwrite/Farmer';
import { login } from '../../store/AuthSlice';

function SignUpForm() {
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue } = useForm();

  const [villages, setVillages] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const pincode = watch('pincode');

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

  const create = async (data) => {
    setError('');
    try {
      const address = {
        pincode : data.pincode ,
        state : data.state,
        district: data.district ,
        taluka: data.taluka,
        village: data.village,
        local: data.local

      }
      const res = await farmerService.createFarmer({
        ...data,
        
        address: JSON.stringify(address)
      });
      dispatch(login({ userData: res, role: data.role }));

      navigate('/'); // or wherever
    } catch (error) {
      console.log('error in sign form', error);
      setError('Failed to create farmer');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex justify-center items-center p-6">
      <div className="flex flex-col bg-white py-10 px-10 gap-6 rounded-2xl shadow-lg w-full max-w-md">
        {error && <p className="text-red-500 text-center font-medium">{error}</p>}

        <form onSubmit={handleSubmit(create)} className="flex flex-col gap-5">
          <Input 
          {...register('name', { required: true })}
           placeholder="Enter name" 
           className='w-full border-gray-300 rounded-lg shadow-sm p-3'
           />
          <Input 
          {...register('email', { required: true })} 
          type="email" 
          placeholder="Enter email" 
         className='w-full border-gray-300 rounded-lg shadow-sm p-3'
          />
          <Input 
          {...register('phone', { required: true })} 
          type="number"
           placeholder="Enter phone number" 
           className='w-full border-gray-300 rounded-lg shadow-sm p-3'
           />
          <Input
           {...register('password', { required: true })} 
           type="password" 
           placeholder="Enter password"
            className='w-full border-gray-300 rounded-lg shadow-sm p-3'
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
          <Input 
          {...register('role', { required: true })}
           type="text"
            placeholder="Enter role" 
           className='w-full border-gray-300 rounded-lg shadow-sm p-3'
             />

          <Link to="/login" className="text-lg font-medium text-[#007b55] hover:underline text-center">
            Already have an account?
          </Link>

          <Button type="submit" className="bg-[#007b55] hover:bg-[#005a3c] text-white py-3 rounded-md text-lg font-medium">
            {loadingLocation ? 'Loading location...' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
