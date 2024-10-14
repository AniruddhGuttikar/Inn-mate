"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RegisterButton = () => {
  return (
    <Link href={"/auth"}>
      <Button>Sign Up</Button>
    </Link>
  );
};

export default RegisterButton;
