'use client';

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';

export function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/store/success`,
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error) {
            if (error.type === 'card_error' || error.type === 'validation_error') {
                setErrorMessage(error.message ?? 'An unknown error occurred');
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
            <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Processing...</div> : 'Pay now'}
                </span>
            </button>

            {/* Show any error or success messages */}
            {errorMessage && (
                <div id="payment-message" className="text-red-500 text-sm mt-4 text-center">
                    {errorMessage}
                </div>
            )}
        </form>
    );
}
