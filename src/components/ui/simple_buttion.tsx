'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
const PrimaryButton = () => {
  const router=useRouter()
    const onClick=()=>{
      router.push('/')
    }
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
    >
      Go Home
    </button>
  );
};

export default PrimaryButton;
