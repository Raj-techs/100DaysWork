import Header from "@/components/Header";
import "../../styles/globals.css";

export const metadata = {
  title: "100 Days Work",
  description: "Attendance tracking system",
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="min-h-screen">
          <div className="flex justify-center py-4">
            <img 
              src="/images/logo.png" 
              alt="100 Days Work Logo" 
              className="h-12"
            />
          </div>
          <Header />
          <main className="container mx-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}