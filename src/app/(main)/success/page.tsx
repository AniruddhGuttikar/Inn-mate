'use client'
import React, { useEffect, useState } from 'react';
import  {Button}  from "@/components/ui/button"
import { useRouter } from 'next/navigation';

export default function Success() {
    const [countdown, setCountdown] = useState(3);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const redirectTimeout = setTimeout(() => {
            router.push('/');
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimeout);
        };
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-100">
            <div className="text-center p-6 rounded shadow-lg bg-white">
                <div className="flex items-center justify-center mb-4">
                    <svg
                        className="w-24 h-24 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4M4 12a8 8 0 1116 0 8 8 0 01-16 0z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-green-700">Payment Successful!</h1>
                <p className="mt-2 text-gray-600">Thank you for your payment. Your transaction has been completed.</p>
                <p className="mt-2 text-gray-600">Booking details will be mailed to your registered email</p>

                <p className="mt-4 text-xl">Redirecting in {countdown} seconds...</p>
                <Button className="mt-4 bg-green-600 text-white hover:bg-green-700">
                    Go to Homepage
                </Button>
            </div>
        </div>
    );
}
