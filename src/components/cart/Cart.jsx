import React, { useEffect, useState } from 'react'
import farmerService from '../../Appwrite/Farmer'
import productService from '../../Appwrite/Product'
import ProductCard from '../ui/ProductCard'
import { toast } from 'react-toastify'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { useForm } from 'react-hook-form'
import userService from '../../Appwrite/Customer'

function Cart() {
  const [cartProducts, setCartProducts] = useState([])
  const [address, setAddress] = useState()
  const [villages, setVillages] = useState([]);
  const [open, setOpen] = useState(false)
  

  const { register, handleSubmit } = useForm()
  const [uID, setUID] = useState()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userData = await farmerService.getCurrentUser()
        console.log(userData.prefs.role)
        setUID(userData.$id)
  
        let addressData = null
  
        if (userData.prefs.role === 'farmer') {
          const response = await farmerService.getFarmerById(userData.$id)
          addressData = JSON.parse(response.address)
        } else {
          const response = await userService.getUserById(userData.$id)
          addressData = JSON.parse(response.address)
        }
  
        setAddress(addressData)
  
        const res = await productService.getCartProducts(userData.$id)
        if (res.documents && res.documents.length > 0) {
          setCartProducts(res.documents)
        } else {
          setCartProducts([])
        }
  
      } catch (error) {
        console.log('fetch cart err', error)
      }
    }
  
    fetchCart()
  }, [])
  

  const remove = async (productID) => {
    try {
      const res = await productService.removeFromCart(productID)
      if (res) {
        setCartProducts((prev) => prev.filter((product) => product.$id !== productID))
        toast.info('Removed from cart', { position: 'top-center' })
      }
    } catch (error) {
      console.log('rem cart er', error)
    }
  }

  const calculateTotal = () => {
    return cartProducts.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2)
  }

  const addOrder = async () => {
    try {
      await Promise.all(
        cartProducts.map(async (item) => {
          await productService.addToOrders({
            productID: item.$id,
            userID: uID,
            name: item.name,
            price: item.price,
            photo: item.photo,
            address: JSON.stringify(address)
          })
        })
      )

      await productService.removeAllCartProduct(uID)
      setCartProducts([])
      toast.success('🎉 Order placed successfully!', { position: 'top-center' })
    } catch (error) {
      console.log('but add ord err', error)
    }
  }

  return (
    <div>
      <div className='grid grid-cols-2 p-3 gap-3 md:grid-cols-5 md:px-6 md:gap-8 pb-5 border-b-2 border-gray-500'>
        {cartProducts.map((product) => (
          <div key={product.$id}>
            <ProductCard
              $id={product.$id}
              title={product.name}
              photo={product.photo}
              price={product.price}
            />
            <button onClick={() => remove(product.$id)} className='px-3 py-2 bg-red-300 rounded-lg font-medium mt-2'>Remove </button>
          </div>
        ))}
      </div>

      <div className='p-3 flex flex-col gap-5 items-center'>
        {address ? (
          <h2 className='text-xl font-medium'> {address.state} ,{address.district}, {address.taluka} ,{address.village} ,{address.pincode}</h2>
        ) : (
          <h2>Loading address...</h2>
        )}
        <button onClick={() => setOpen(!open)} className='w-[200px] py-2 px-4 rounded-xl bg-red-400 font-medium'>change Address</button>
      </div>

      {open && (
        <div className='flex flex-col gap-3 px-4 py-2'>
          <input
            type='text'
            placeholder='Enter Pincode'
            className='px-3 py-2 border rounded'
            onChange={async (e) => {
              const pin = e.target.value;
              setAddress((prev) => ({ ...prev, pincode: pin }));

              if (pin.length === 6) {
                try {
                  const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                  const data = await res.json();
                  const postOffices = data[0]?.PostOffice || [];

                  if (postOffices.length > 0) {
                    const { State, District, Block } = postOffices[0];

                    const villageList = postOffices.map(po => po.Name);
                    setVillages(villageList);

                    setAddress((prev) => ({
                      ...prev,
                      state: State,
                      district: District,
                      taluka: Block
                    }));
                  } else {
                    setVillages([]);
                  }
                } catch (err) {
                  console.error("Failed to fetch location:", err);
                }
              } else {
                setVillages([]);
              }
            }}
          />

          {/* Show fetched details */}
          {address.state && (
            <div className='text-sm bg-white p-2 rounded'>
              <p><strong>State:</strong> {address.state}</p>
              <p><strong>District:</strong> {address.district}</p>
              <p><strong>Taluka:</strong> {address.taluka}</p>
            </div>
          )}

          {/* Village Dropdown */}
          {villages.length > 0 && (
            <select
              className='px-3 py-2 border rounded'
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, village: e.target.value }))
              }
            >
              <option value="">Select Village</option>
              {villages.map((village, idx) => (
                <option key={idx} value={village}>{village}</option>
              ))}
            </select>
          )}

          {/* Local Address */}
          <textarea
            placeholder='Enter Local Address'
            className='px-3 py-2 border rounded resize-none'
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, localAddress: e.target.value }))
            }
          />

          {/* Submit */}
          <button
            onClick={() => {
              console.log("Final Address:", address);
              setOpen(false);
            }}
            className='bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-all mt-2'
          >
            Save Address
          </button>
        </div>
      )}

      
      

      <div className=' flex justify-between px-8 py-3'>
        <h2 className='text-xl font-semibold'>Total: Rs.{calculateTotal()}</h2>
        <button onClick={addOrder} className='py-2 px-4 rounded-xl bg-red-400 font-medium'>Buy</button>
      </div>
    </div>
  )
}

export default Cart