import Navbar from "@/components/Navbar";
import Sidebar from "../components/Sidebar";
import AuthProvider from "@/components/AuthProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/authOption";
import "./globals.css";

export const metadata = {
  title: "JKARE Admin Portal",
  description:
    "This is Jkare Admin Portal for medical equipment stock, users, and their respective settings management application",
};

export default async function RootLayout({ children }) {
  const user = {
    name: "Shivam Awasthi",
    email: "shivamawasthi1129@gmail.com",
    image:
      "https://lh3.googleusercontent.com/ogw/AF2bZygeRwVcQMEP4l7dEczLQEsPTgrtQzE3JfCWvRV325ubaok=s32-c-mo",
    role: "Super Admin",
  };
  const session = await getServerSession(authOptions);
  console.log("session", session);
  return (
    <html lang="en">
      <body>
        <AuthProvider session={session}>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 pl-2">
              <Navbar
              // isLoggedIn={true} user={user} 
              />
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
