/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', "s3.ap-south-1.amazonaws.com" , "hexerve.com"],
  },
  crossOrigin: 'anonymous',
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false, // Set true for 301 redirect
      },
    ];
  },
};

export default nextConfig;
