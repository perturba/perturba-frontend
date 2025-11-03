import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
