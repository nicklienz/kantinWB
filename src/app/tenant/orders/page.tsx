export default function OrdersPage() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-1 w-full bg-base-100 rounded shadow p-4">
        {/* Order List Component */}
        <h2 className="text-xl font-bold mb-4">Order List</h2>
        {/* Placeholder for order list */}
        <p>No orders available.</p>
      </div>
      <div className="w-full md:w-96 bg-base-100 rounded shadow p-4 max-h-screen overflow-y-auto">
        {/* Add Order Component */}
        <h2 className="text-xl font-bold mb-4">Add New Order</h2>
        {/* Placeholder for add order form */}
        <p>Form to add a new order will go here.</p>
      </div>
    </div>
  );
}