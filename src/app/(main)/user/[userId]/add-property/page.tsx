import AddPropertyForm from "@/components/property/AddPropertyForm";
import React from "react";

export default function AddPropertyPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Add New Property</h1>
      <AddPropertyForm />
    </div>
  );
}
