export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* No navbar here */}
        <main>{children}</main>
      </body>
    </html>
  );
}
