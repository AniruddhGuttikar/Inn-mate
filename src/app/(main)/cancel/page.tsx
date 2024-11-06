'use client'
import React, { useEffect, useState } from 'react';
import  {Button}  from "@/components/ui/button"
import { useRouter } from 'next/navigation';

export default function Cancel() {
    const [countdown, setCountdown] = useState(3);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const redirectTimeout = setTimeout(() => {
            router.push('/');
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimeout);
        };
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-100">
            <div className="text-center p-6 rounded shadow-lg bg-white">
                <div className="flex items-center justify-center mb-4">
                    <svg
                        className="w-24 h-24 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-red-700">Payment Failed!</h1>
                <p className="mt-2 text-gray-600">Something went wrong with your transaction. Please try again.</p>
                <p className="mt-4 text-xl">Redirecting in {countdown} seconds...</p>
                <Button className="mt-4 bg-red-600 text-white hover:bg-red-700">
                    Go to Homepage
                </Button>
            </div>
        </div>
    );
}
