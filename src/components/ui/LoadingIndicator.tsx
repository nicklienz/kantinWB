import React from "react";

const LoadingIndicator = ({ message = "Memuat..." }: { message?: string }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/80">
    <div className="flex flex-col items-center gap-4">
      <span className="loading loading-spinner loading-lg text-primary" />
      <span className="text-base-content text-lg font-semibold animate-pulse">{message}</span>
    </div>
  </div>
);

export default LoadingIndicator;
