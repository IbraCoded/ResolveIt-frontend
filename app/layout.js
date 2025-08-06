import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Footer } from "@/components/footer";
import { WebSocketProvider } from "@/components/websocket-provider";

export const metadata = {
  title: "ResolveIt - Modern Mediation Platform",
  description:
    "Resolve disputes efficiently with our comprehensive mediation platform",
};

export default function RootLayout({ children }) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("resolveit_token") : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Pass the token as a key to make the component remount when the the token changes */}
          <WebSocketProvider key={token}>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </WebSocketProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
