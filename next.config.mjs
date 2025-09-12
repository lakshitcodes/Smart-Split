import nextPWA from "next-pwa";

const withPWA = nextPWA({
    dest: "public", // service worker + manifest go here
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development", // optional: disables PWA locally
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);
