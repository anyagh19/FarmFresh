import React, { useEffect, useState } from 'react';
import farmerService from '../../Appwrite/Farmer';
import productService from '../../Appwrite/Product';
import userService from '../../Appwrite/Customer';
import ProductCard from '../ui/ProductCard';
import { toast } from 'react-toastify';

// Replace with your Razorpay key
const RAZORPAY_KEY_ID = 'rzp_test_kxwK4KltT9lbKS';

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [address, setAddress] = useState({});
  const [villages, setVillages] = useState([]);
  const [open, setOpen] = useState(false);
  const [uID, setUID] = useState();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [processing, setProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userData = await farmerService.getCurrentUser();
        setUID(userData.$id);

        const userResponse = userData.prefs.role === 'Farmer'
          ? await farmerService.getFarmerById(userData.$id)
          : await userService.getUserById(userData.$id);

        const addressData = JSON.parse(userResponse.address);
        setAddress(addressData);

        const cartResponse = await productService.getCartProducts(userData.$id);
        setCartProducts(cartResponse.documents || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = () => {
    const subtotal = cartProducts.reduce((total, item) => total + parseFloat(item.price), 0);
    return {
      subtotal,
      total: subtotal,
    };
  };

  const remove = async (productID) => {
    try {
      await productService.removeFromCart(productID);
      setCartProducts((prev) => prev.filter((p) => p.$id !== productID));
      toast.info('Removed from cart', { position: 'top-center' });
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentSuccess = async () => {
    try {
      await Promise.all(
        cartProducts.map((item) =>
          productService.addToOrders({
            productID: item.$id,
            userID: uID,
            name: item.name,
            price: item.price,
            photo: item.photo,
            address: JSON.stringify(address),
          })
        )
      );
      await productService.removeAllCartProduct(uID);
      setCartProducts([]);
      toast.success('🎉 Payment Successful!', { position: 'top-center' });
      setShowPaymentForm(false);
    } catch (error) {
      console.error('Payment processing error', error);
      toast.error('Payment Failed. Try again!');
    }
  };

  const handleRazorpayPayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const totalAmount = calculateTotal().total * 100; // Convert to paise

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: totalAmount,
      currency: 'INR',
      name: 'FarmFresh',
      description: 'Payment for your farm products',
      image: '/logo.png',
      handler: handlePaymentSuccess,
      prefill: {
        name: form.name,
        email: form.email,
      },
      notes: {
        address: JSON.stringify(address),
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-4">
      {/* Cart Items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b pb-5">
        {cartProducts.map((product) => (
          <div key={product.$id}>
            <ProductCard
              $id={product.$id}
              title={product.name}
              photo={product.photo}
              price={product.price}
            />
            <button onClick={() => remove(product.$id)} className="mt-2 px-3 py-2 bg-red-400 rounded">
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Address Section */}
      <div className="mt-4 flex flex-col items-center gap-4">
        {address ? (
          <p className="text-lg font-semibold">
            {address.state}, {address.district}, {address.taluka}, {address.village}, {address.pincode}
          </p>
        ) : (
          <p>Loading address...</p>
        )}
        <button onClick={() => setOpen(!open)} className="bg-blue-400 px-4 py-2 rounded text-white">
          Change Address
        </button>
      </div>

      {/* Address Form */}
      {open && (
        <div className="mt-4 space-y-3 px-2">
          <input
            type="text"
            placeholder="Enter Pincode"
            className="w-full border p-2 rounded"
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
                    const villageList = postOffices.map((po) => po.Name);
                    setVillages(villageList);
                    setAddress((prev) => ({
                      ...prev,
                      state: State,
                      district: District,
                      taluka: Block,
                    }));
                  }
                } catch (err) {
                  console.error("Failed to fetch location:", err);
                }
              } else {
                setVillages([]);
              }
            }}
          />
          {villages.length > 0 && (
            <select
              className="w-full border p-2 rounded"
              onChange={(e) => setAddress((prev) => ({ ...prev, village: e.target.value }))}
            >
              <option value="">Select Village</option>
              {villages.map((v, i) => (
                <option key={i} value={v}>{v}</option>
              ))}
            </select>
          )}
          <textarea
            placeholder="Enter Local Address"
            className="w-full border p-2 rounded"
            onChange={(e) => setAddress((prev) => ({ ...prev, localAddress: e.target.value }))}
          />
          <button onClick={() => setOpen(false)} className="bg-green-500 text-white py-2 px-4 rounded">
            Save Address
          </button>
        </div>
      )}

      {/* Buy Button */}
      <div className="mt-6 text-center">
        <button onClick={handleRazorpayPayment} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default Cart;
