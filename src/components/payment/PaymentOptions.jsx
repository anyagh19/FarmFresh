import React from "react";

function PaymentOptions({ selected, onSelect }) {
  const methods = ["credit-card", "upi", "cod"];

  return (
    <div className="flex flex-wrap gap-3">
      {methods.map((method) => (
        <button
          key={method}
          type="button"
          className={`border p-2 rounded-lg flex-1 ${
            selected === method ? "bg-green-500 text-white" : ""
          }`}
          onClick={() => onSelect(method)}
        >
          {method.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default PaymentOptions;
