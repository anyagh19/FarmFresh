import React from "react";

function PaymentForms({ selectedPaymentMethod }) {
  if (selectedPaymentMethod === "credit-card") {
    return (
      <div className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Card Number" />
        <input className="w-full border p-2 rounded" placeholder="Expiry (MM/YY)" />
        <input className="w-full border p-2 rounded" placeholder="CVV" />
      </div>
    );
  }
  if (selectedPaymentMethod === "upi") {
    return (
      <div>
        <input className="w-full border p-2 rounded" placeholder="UPI ID (e.g. name@upi)" />
      </div>
    );
  }
  if (selectedPaymentMethod === "cod") {
    return (
      <p className="text-green-600">Cash will be collected at delivery.</p>
    );
  }
  return null;
}

export default PaymentForms;
