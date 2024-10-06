"use client";

import { useState } from "react";
import ListPropertyButton from "./ListPropertyButton";
import UnifiedSearchBox from "./SearchBox";

export default function PropertyBookingDashboard() {
  return (
    <nav className="flex flex-col  w-full items-center mx-auto p-6 md:flex-row">
      <h1 className="text-3xl font-bold left-6">INNMATE</h1>
      <UnifiedSearchBox />
      <ListPropertyButton />
    </nav>
  );
}
