import Navbar from "@/components/Navbar";
import Sidebar from "../components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "JKARE Admin Portal",
  description:
    "This is Jkare Admin Portal for medical equipment stock, users, and their respective settings management application",
};

export default function RootLayout({ children }) {
  const user = {
    name: "Shivam Awasthi",
    email: "shivamawasthi1129@gmail.com",
    image: "https://lh3.googleusercontent.com/ogw/AF2bZygeRwVcQMEP4l7dEczLQEsPTgrtQzE3JfCWvRV325ubaok=s32-c-mo",
    role: "Super Admin",
  };
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 pl-2">
            <Navbar isLoggedIn={true} user={user} />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
