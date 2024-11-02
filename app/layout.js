import "./globals.css";

export const metadata = {
  title: "JKARE Admin Portal",
  description: "This is Jkare Admin Portal for medical equipment stock , users and their respective settings management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
