/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', "s3.ap-south-1.amazonaws.com"],
  },
  crossOrigin: 'anonymous',
};

export default nextConfig;
