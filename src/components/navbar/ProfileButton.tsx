"use client";

import React from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "lucide-react";
import Link from "next/link";

const ProfileButton = () => {
  const { user } = useKindeBrowserClient();

  if (!user) {
    return;
  }

  const links = [{ label: "Bookings", link: `bookings/${user.id}` }];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <User className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="grid gap-4">
          <div className="font-medium">{user?.email}</div>
          {links.map((link) => (
            <Link href={link.link}>
              <Button
                key={link.label}
                variant="ghost"
                className="w-full justify-start"
              >
                {link.label}
              </Button>
            </Link>
          ))}
          <LogoutLink>
            <Button variant="ghost" className="w-full justify-start">
              Log out
            </Button>
          </LogoutLink>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileButton;
