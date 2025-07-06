import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const typeFace = localFont({
  src: [
    {
      path: "./fonts/GraphikArabic-Extralight.ttf",
      weight: "100",
    },
    {
      path: "./fonts/GraphikArabic-Light.ttf",
      weight: "200",
    },
    {
      path: "./fonts/GraphikArabic-Thin.ttf",
      weight: "300",
    },
    {
      path: "./fonts/GraphikArabic-Regular.ttf",
      weight: "400",
    },
    {
      path: "./fonts/GraphikArabic-Medium.ttf",
      weight: "500",
    },
    {
      path: "./fonts/GraphikArabic-Semibold.ttf",
      weight: "600",
    },
    {
      path: "./fonts/GraphikArabic-Bold.ttf",
      weight: "700",
    },
    {
      path: "./fonts/GraphikArabic-Black.ttf",
      weight: "800",
    },
    {
      path: "./fonts/GraphikArabic-Super.ttf",
      weight: "900",
    },
  ],
  variable: "--font-graphik-arabic",
});

export default function navLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
