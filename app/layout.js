import Sidebar from "../components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "JKARE Admin Portal",
  description: "This is Jkare Admin Portal for medical equipment stock, users, and their respective settings management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 pl-2">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
