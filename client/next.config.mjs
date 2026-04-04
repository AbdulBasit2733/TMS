/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || (
      process.env.NODE_ENV === "production"
        ? "https://tms-1kga.onrender.com"
        : "http://localhost:5000"
    );

    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
}

export default nextConfig
