import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="flex flex-col w-full items-center mx-auto justify-between p-6 md:flex-row">
          <h1 className="text-3xl mx-auto font-bold">INNMATE</h1>
        </nav>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
