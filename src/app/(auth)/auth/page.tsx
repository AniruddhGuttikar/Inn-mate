import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Card className="max-w-md w-full shadow-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Welcome to Innmate
          </CardTitle>
          <p className="text-sm text-gray-600">
            Your stay, your way—find your perfect escape with Innmate!
          </p>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col">
          <LoginLink>
            <Button className="w-full py-6">Sign in</Button>
          </LoginLink>
          <RegisterLink>
            <Button variant="outline" className="py-6 w-full">
              Sign up
            </Button>
          </RegisterLink>
        </CardContent>
      </Card>
    </div>
  );
}
