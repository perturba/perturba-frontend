import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex flex-col h-screen overflow-hidden">
        <AuthProvider>
          <Header />
          <main className="flex-1 min-h-0 flex flex-col overflow-hidden">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
