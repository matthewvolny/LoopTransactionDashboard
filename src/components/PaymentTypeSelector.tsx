import React from "react";

interface PaymentTypeSelectorProps {
  fetchPaymentInfo: (processor: string) => void;
}

export const PaymentTypeSelector = ({
  fetchPaymentInfo,
}: PaymentTypeSelectorProps) => {
  return (
    <div>
      <button
        onClick={(e) => {
          fetchPaymentInfo("success"); //add processor, add network
        }}
      >
        Successful payments
      </button>
      <button
        onClick={(e) => {
          fetchPaymentInfo("failure");
        }}
      >
        Failed Payments
      </button>
    </div>
  );
};
