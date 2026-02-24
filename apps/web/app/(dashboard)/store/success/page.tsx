import { redirect } from 'next/navigation';

export default async function StoreSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ payment_intent?: string; payment_intent_client_secret?: string; redirect_status?: string }>;
}) {
    const params = await searchParams;
    const { payment_intent, payment_intent_client_secret, redirect_status } = params;

    if (!payment_intent || !payment_intent_client_secret) {
        redirect('/store');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
            <div className="bg-emerald-100 p-4 rounded-full">
                <svg
                    className="w-16 h-16 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>

            <h1 className="text-3xl font-bold text-center">Payment Successful!</h1>

            <p className="text-gray-400 text-center max-w-md">
                Thank you for your purchase. Your premium currency has been added to your account.
            </p>

            {redirect_status === 'succeeded' && (
                <div className="bg-gray-800 p-4 rounded-lg text-sm font-mono text-gray-300 w-full max-w-md break-all">
                    <p className="mb-2"><strong>Transaction ID:</strong></p>
                    <p className="text-emerald-400">{payment_intent}</p>
                </div>
            )}

            <a
                href="/game"
                className="mt-8 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-colors"
            >
                Return to Game
            </a>
        </div>
    );
}
