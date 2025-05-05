import Router from 'next/router';
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
      url: '/api/orders',
      method: 'post',
      body: { ticketId: ticket.id },
      onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    });
  
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                <div className="mt-2 flex items-center">
                  <span className="text-lg font-semibold text-primary-600">
                    ${ticket.price}
                  </span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                </div>
              </div>
            </div>
            
            {errors && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <div className="text-sm text-red-600">
                  {errors}
                </div>
              </div>
            )}
  
            <div className="mt-8">
              <button
                onClick={() => doRequest()}
                className="w-full md:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Purchase Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };;

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);

    return { ticket: data };
}

export default TicketShow;