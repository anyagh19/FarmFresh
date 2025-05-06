import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import productService from '../../Appwrite/Product';
import farmerService from '../../Appwrite/Farmer';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    amount: state?.totalAmount || 0,
  });

  const [products, setProducts] = useState(state?.products || []);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !paymentMethod) {
      toast.error('Please fill all fields and select payment method');
      return;
    }

    setProcessing(true);

    try {
      if (state?.fromCart) {
       
        const userData = await farmerService.getCurrentUser()
        const userID = userData.$id
        await Promise.all(
          products.map(async (item) => {
            await productService.addToOrders(
               userID, // or userData.$id from redux if you want
              item.productID, 
              item.title,
              item.productImage,
              parseFloat(item.price),
              new Date().toISOString()
            );
          })
        );
        // Empty the cart
        await productService.removeAllCartProduct(products[0]?.userID);
      } else {
        // Single product order (direct Buy Now)
        await productService.addToOrders(
          state.product.userID,
          state.product.productID,
          state.product.title,
          state.product.productImage,
          parseFloat(state.product.price),
          new Date().toISOString()
        );
      }

      toast.success('🎉 Payment Successful!', { position: 'top-center' });
      navigate('/'); // After order redirect home
    } catch (error) {
      console.error('Payment Error', error);
      toast.error('Payment Failed. Try again!');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Payment</h2>

        <form onSubmit={handleSubmit}>
          {/* Name and Email Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Payment Method Radio Buttons */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Payment Method</h3>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  checked={paymentMethod === 'creditCard'}
                  onChange={handlePaymentMethodChange}
                  className="h-5 w-5"
                />
                <span>Credit Card</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={handlePaymentMethodChange}
                  className="h-5 w-5"
                />
                <span>PayPal</span>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Amount</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              value={`₹${form.amount}`}
              disabled
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full py-2 px-6 rounded-md text-white text-lg ${processing ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentPage;
