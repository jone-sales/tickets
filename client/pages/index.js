import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Available Tickets</h1>
                {currentUser && (
                    <Link 
                        href="/tickets/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Sell New Ticket
                    </Link>
                )}
            </div>

            {tickets.length === 0 ? (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No tickets available</h3>
                    <p className="mt-1 text-sm text-gray-500">Check back later or create a new ticket.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{ticket.title}</h3>
                                <p className="text-2xl font-semibold text-primary-600 mb-4">
                                    ${parseFloat(ticket.price).toFixed(2)}
                                </p>
                                <div className="flex justify-end">
                                    <Link
                                        href="/tickets/[ticketId]"
                                        as={`/tickets/${ticket.id}`}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
};

export default LandingPage;