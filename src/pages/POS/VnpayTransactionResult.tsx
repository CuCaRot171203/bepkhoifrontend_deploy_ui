import React from "react";
import { useSearchParams } from "react-router-dom";
import VnpaySuccess from "./VnpaySuccess";
import VnpayFailure from "./VnpayFailure";

const VnpayTransactionResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resultParam = searchParams.get("result");
  const result = resultParam === "true";

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {result ? <VnpaySuccess /> : <VnpayFailure />}
    </div>
  );
};

export default VnpayTransactionResult;
