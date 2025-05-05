import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow text-center">
        <div className="text-2xl font-bold text-red-600 mb-4">Order Expired</div>
        <p className="text-gray-600">This order has expired and can no longer be paid.</p>
        <button
          onClick={() => Router.push('/')}
          className="mt-6 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Browse Tickets
        </button>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h1>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">Ticket</span>
          <span className="text-sm font-medium text-gray-900">{order.order.ticket.title}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">Price</span>
          <span className="text-sm font-medium text-gray-900">${order.order.ticket.price}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Time remaining</span>
          <div className="flex items-center">
            <span className={`text-lg font-bold ${
              timeLeft < 60 ? 'text-red-600' : 'text-primary-600'
            }`}>
              {formatTime(timeLeft)}
            </span>
            <span className="ml-1 text-sm text-gray-500">min:sec</span>
          </div>
        </div>
      </div>

      {errors && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-600">{errors}</div>
        </div>
      )}

      <div className="flex justify-center">
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey="pk_test_51RJJaq4GkDkVJeAeu4SAgwanE7VDu7iDQS5Uszt6rzxcOBVbYWk5P9QGeaZC9F2fDQKm2n8DIdfWDjRFrAf60ooz00xUNQwjmd"
          amount={order.order.ticket.price * 100}
          email={currentUser.email}
          currency="USD"
          name={order.order.ticket.title}
          description={`Ticket purchase (Order #${order.order.id})`}
          image="https://stripe.com/img/documentation/checkout/marketplace.png"
        >
          <button className="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            Pay with Credit Card
          </button>
        </StripeCheckout>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        Secure payment processed by Stripe
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;