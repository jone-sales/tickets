const OrderIndex = ({ orders }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order.id}>
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-primary-600 truncate">
                      {order.ticket.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Price: {order.ticket.price}$
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'complete' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
  
  OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
  
    return { orders: data };
  };
  
  export default OrderIndex;
  