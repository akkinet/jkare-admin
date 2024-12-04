import Layout from "@/components/Layout";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";


export const metadata = {
  title: "JKARE Admin Portal",
  description:
    "This is Jkare Admin Portal for medical equipment stock, users, and their respective settings management application",
};

export default async function RootLayout({ children }) {
 
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
