"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const ListPropertyButton = ({
  userId,
}: {
  userId: string | undefined;
}) => {
  const router = useRouter();
  return (
    <Button
      className="m-2"
      onClick={() => {
        if (!userId) {
          router.push("/auth");
          return;
        }
        router.push(`/user/${userId}/properties`);
      }}
    >
      List Your Property
    </Button>
  );
};
