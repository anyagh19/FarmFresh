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

    fetchCart();
  }, []);

  const calculateTotal = () => {
    const subtotal = cartProducts.reduce((total, item) => total + parseFloat(item.price), 0);
    return {
      subtotal,
      delivery: 50,
      tax: 20,
      total: subtotal + 50 + 20
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
                      taluka: Block
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

          <button
            onClick={() => setOpen(false)}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Save Address
          </button>
        </div>
      )}

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

            <div className="flex gap-4 mb-2">
              <label>
                <input
                  type="radio"
                  value="credit-card"
                  checked={paymentMethod === "credit-card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                /> Credit Card
              </label>
              <label>
                <input
                  type="radio"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                /> UPI
              </label>
              <label>
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                /> COD
              </label>
            </div>

            {paymentMethod === "credit-card" && (
              <div className="space-y-2 mb-2">
                <input className="w-full border p-2 rounded" placeholder="Card Number" />
                <input className="w-full border p-2 rounded" placeholder="Expiry (MM/YY)" />
                <input className="w-full border p-2 rounded" placeholder="CVV" />
              </div>
            )}
            {paymentMethod === "upi" && (
              <input className="w-full border p-2 rounded mb-2" placeholder="UPI ID (e.g. name@upi)" />
            )}
            {paymentMethod === "cod" && (
              <p className="text-green-600 mb-2">Cash will be collected at delivery.</p>
            )}

            <div className="text-lg font-bold mb-2">
              Total: ₹{calculateTotal().total.toFixed(2)}
            </div>

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
