import React, { useEffect, useState } from 'react';
import farmerService from '../../Appwrite/Farmer';
import productService from '../../Appwrite/Product';
import ProductCard from '../ui/ProductCard';
import { toast } from 'react-toastify';
import userService from '../../Appwrite/Customer';

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [address, setAddress] = useState();
  const [villages, setVillages] = useState([]);
  const [open, setOpen] = useState(false);
  const [uID, setUID] = useState();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [processing, setProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };

    const fetchCart = async () => {
      try {
        const userData = await farmerService.getCurrentUser();
        setUID(userData.$id);

        let addressData;
        if (userData.prefs.role === 'Farmer') {
          const response = await farmerService.getFarmerById(userData.$id);
          addressData = JSON.parse(response.address);
        } else {
          const response = await userService.getUserById(userData.$id);
          addressData = JSON.parse(response.address);
        }

        setAddress(addressData);
        const res = await productService.getCartProducts(userData.$id);
        setCartProducts(res.documents || []);
      } catch (error) {
        console.log('fetch cart err', error);
      }
    };

    loadRazorpay();
    fetchCart();
  }, []);

  const calculateTotal = () => {
    const subtotal = cartProducts.reduce((total, item) => total + parseFloat(item.price), 0);
    return {
      subtotal,
      total: subtotal
    };
  };

  const remove = async (productID) => {
    try {
      await productService.removeFromCart(productID);
      setCartProducts((prev) => prev.filter((p) => p.$id !== productID));
      toast.info('Removed from cart', { position: 'top-center' });
    } catch (error) {
      console.log('rem cart err', error);
    }
  };

  const handlePayment = async () => {
    if (!form.name || !form.email || !paymentMethod) {
      toast.error('Please fill all fields and select payment method');
      return;
    }

    setProcessing(true);
    try {
      await Promise.all(
        cartProducts.map((item) =>
          productService.addToOrders({
            productID: item.$id,
            userID: uID,
            name: item.name,
            price: item.price,
            photo: item.photo,
            address: JSON.stringify(address)
          })
        )
      );
      await productService.removeAllCartProduct(uID);
      setCartProducts([]);
      toast.success('🎉 Payment Successful!', { position: 'top-center' });
      setShowPaymentForm(false);
    } catch (error) {
      console.error('Payment error', error);
      toast.error('Payment Failed. Try again!');
    } finally {
      setProcessing(false);
    }
  };

  const handleUPIPayment = () => {
    const totalAmount = calculateTotal().total.toFixed(2) * 100; // Convert to paise

    const options = {
      key: "YOUR_RAZORPAY_KEY",  // Replace with your Razorpay API key
      amount: totalAmount,
      currency: "INR",
      name: "Ecomove",
      description: "Purchase on Ecomove",
      handler: function (response) {
        toast.success("Payment successful!");
        handlePayment();
      },
      prefill: {
        name: form.name,
        email: form.email,
      },
      notes: {
        address: JSON.stringify(address),
      },
      theme: {
        color: "#3399cc",
      },
      method: {
        upi: true,
      },
      upi: {
        vpa: "razorpay.me/@aniketshankarmarkad"  // Your Razorpay.me UPI ID
      }
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

      {/* Buy Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowPaymentForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          Buy
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowPaymentForm(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Payment</h2>

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <button 
              onClick={handleUPIPayment} 
              className="w-full bg-green-500 text-white py-2 rounded mb-2"
            >
              Pay with UPI (Razorpay)
            </button>

            <button
              onClick={handlePayment}
              className={`w-full py-2 rounded ${processing ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white`}
              disabled={processing}
            >
              {processing ? "Processing..." : "Complete Payment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
