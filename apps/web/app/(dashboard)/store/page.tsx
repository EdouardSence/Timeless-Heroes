'use client';

import { useEffect, useState } from 'react';
import { CheckoutForm } from '../../../components/stripe/CheckoutForm';
import { StripeProvider } from '../../../components/stripe/StripeProvider';

export default function StorePage() {
    const [clientSecret, setClientSecret] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Example of how you would fetch a payment intent
    // This should point to your actual backend API route that calls StripeService.createPaymentIntent
    const fetchPaymentIntent = async () => {
        setIsLoading(true);
        setError('');
        try {
            // In a real app, you would pass the item details here
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // NOTE: Add an Authorization header here using the authenticated user's session/JWT
                    // once your authentication flow is wired up.
                },
                body: JSON.stringify({
                    amountCents: 1500, // $15.00
                    currency: 'eur',
                    productType: 'PREMIUM_CURRENCY',
                    productData: {
                        amount: 1000,
                    },
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to create payment intent');
            }

            const data = await res.json();
            setClientSecret(data.clientSecret);
        } catch (err) {
            console.error(err);
            setError('Could not initialize checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-emerald-400">Premium Store</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Store Items Example */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">1000 LoC Gems</h2>
                    <p className="text-gray-400 mb-6">Boost your progression instantly!</p>
                    <div className="text-2xl font-bold mb-6">€15.00</div>

                    {!clientSecret ? (
                        <button
                            onClick={fetchPaymentIntent}
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Loading...' : 'Buy Now'}
                        </button>
                    ) : (
                        <div className="text-emerald-500 font-medium">Proceeding to checkout...</div>
                    )}

                    {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
                </div>

                {/* Checkout Form Area */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-6">Checkout</h2>

                    {!clientSecret ? (
                        <div className="text-gray-500 flex items-center justify-center h-40 border-2 border-dashed border-gray-700 rounded-lg">
                            Select an item to purchase
                        </div>
                    ) : (
                        <StripeProvider clientSecret={clientSecret}>
                            <CheckoutForm />
                        </StripeProvider>
                    )}
                </div>
            </div>
        </div>
    );
}
