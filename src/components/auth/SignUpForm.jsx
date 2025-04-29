import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Select, Button } from '../../Index';
import farmerService from '../../Appwrite/Farmer';
import userService from '../../Appwrite/Customer';
import { login } from '../../store/AuthSlice';

function SignUpForm() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState('');
  const [villages, setVillages] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const { register, handleSubmit, watch, reset, setValue } = useForm();
  const pincode = watch('pincode');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    reset(); // Reset form fields when changing role
    setVillages([]);
    setError('');
  };

  useEffect(() => {
    if (pincode && pincode.length === 6) {
      setLoadingLocation(true);
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then(res => res.json())
        .then(data => {
          const postOffices = data[0]?.PostOffice;
          if (postOffices?.length > 0) {
            const first = postOffices[0];
            const villageNames = postOffices.map(po => po.Name);

            setValue('state', first.State || '');
            setValue('district', first.District || '');
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
          console.error('Error fetching pincode:', err);
          setError('Failed to fetch location data');
        })
        .finally(() => setLoadingLocation(false));
    }
  }, [pincode, setValue]);

  const createAccount = async (data) => {
    setError('');
    try {
      if (selectedRole === 'Farmer') {
        const address = {
          pincode: data.pincode,
          state: data.state,
          district: data.district,
          taluka: data.taluka,
          village: data.village,
          local: data.local,
        };

        const res = await farmerService.createFarmer({
          ...data,
          role: selectedRole,
          address: JSON.stringify(address),
        });

        dispatch(login({ userData: res, role: 'Farmer' }));
        navigate('/');
      } else if (selectedRole === 'User') {
        const address = {
          pincode: data.pincode,
          state: data.state,
          district: data.district,
          taluka: data.taluka,
          village: data.village,
          local: data.local,

        };

        const res = await userService.createUser({
          ...data,
          role: selectedRole,
          address: JSON.stringify(address),
        });

        dispatch(login({ userData: res, role: 'User' }));
        navigate('/');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create account');
    }
  };

  return (
    <div className="w-full min-h-screen bg-cover bg-center flex justify-center items-center p-6" style={{ backgroundImage: "url('https://i.pinimg.com/474x/05/31/d7/0531d71e81f5a24dc74889d6c01b6523.jpg')" }}>
      <div className="flex flex-col bg-white/90 py-10 px-10 gap-6 rounded-3xl shadow-2xl w-full max-w-xl backdrop-blur-md animate-fade-in">
        
        <div className="text-center">
          <p className="mt-2 font-semibold text-gray-700 text-lg">Sign up as:</p>
          <div className="flex justify-center gap-4 mt-4">
            {['Farmer', 'User'].map(role => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`px-4 py-2 rounded-md border transition-all duration-300 ${
                  selectedRole === role
                    ? 'bg-[#007b55] text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-[#e0f2f1]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {selectedRole && (
          <>
            {error && <p className="text-red-500 text-center font-medium">{error}</p>}

            <form onSubmit={handleSubmit(createAccount)} className="flex flex-col gap-5">
              <Input {...register('name', { required: true })} placeholder="Enter full name" />
              <Input {...register('email', { required: true })} type="email" placeholder="Enter email" />
              <Input {...register('phone', { required: true })} type="text" placeholder="Enter phone number" />
              <Input {...register('password', { required: true })} type="password" placeholder="Enter password" />

              <Input {...register('pincode', { required: true })} type="number" placeholder="Enter pincode" />
              <Input {...register('state', { required: true })} readOnly placeholder="State" />
              <Input {...register('district', { required: true })} readOnly placeholder="District" />
              <Input {...register('taluka', { required: true })} readOnly placeholder="Taluka" />
              <Select {...register('village', { required: true })} label="Village" options={villages} />
              <Input {...register('local', { required: true })} type="text" placeholder="Enter local address" />

              <Link to="/login" className="text-center text-sm text-[#007b55] hover:underline">
                Already have an account?
              </Link>

              <Button type="submit" className="bg-[#007b55] hover:bg-[#005a3c] text-white py-3 rounded-md text-lg font-semibold transition duration-300">
                {loadingLocation ? 'Loading location...' : `Sign Up as ${selectedRole}`}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUpForm;
