/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.05)",
      },
      colors: {
        brandblue: "#3B5BDB",
        accentyellow: "#F4B400",
        darkgray: "#1F1F1F",
        lightbg: "#F5F5F7",
        mutedtext: "#6B7280",
        sidebar: "#1F1F1F",
      },
    },
  },
  plugins: [],
};
