export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-red-500 flex items-center justify-center min-h-screen">
        {children}
      </body>
    </html>
  );
}
