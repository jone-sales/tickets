import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    }

    const onBlur = () => {
        const value = parseFloat(price);
        if(isNaN(value)) return;
        setPrice(value.toFixed(2));
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
                    <p className="mt-2 text-sm text-gray-600">Fill in the details for your new ticket listing</p>
                </div>
                
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <div className="mt-1">
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Enter ticket title"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price ($)
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                id="price"
                                type="text"
                                value={price}
                                onBlur={onBlur}
                                onChange={(e) => setPrice(e.target.value)}
                                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="0.00"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">USD</span>
                            </div>
                        </div>
                    </div>

                    {errors && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-600">
                                {errors}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => Router.push('/')}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Create Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewTicket;