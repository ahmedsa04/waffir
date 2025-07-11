"use client";
import localFont from "next/font/local";
import "../../(navbar)/globals.css";

export const typeFace = localFont({
  src: [
    {
      path: "../../(navbar)/fonts/GraphikArabic-Extralight.ttf",
      weight: "100",
    },
    {
      path: "../../(navbar)/fonts/GraphikArabic-Light.ttf",
      weight: "200",
    },
    {
      path: "../../(navbar)/fonts/GraphikArabic-Thin.ttf",
      weight: "300",
    },
    {
      path: "../../(navbar)/fonts/GraphikArabic-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../(navbar)/fonts/GraphikArabic-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../(navbar)/fonts/GraphikArabic-Semibold.ttf",
      weight: "600",
    },
    {
      path: "../../(navbar)/fonts/GraphikArabic-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../(navbar)/fonts/GraphikArabic-Black.ttf",
      weight: "800",
    },
    {
      path: "../../(navbar)/fonts/GraphikArabic-Super.ttf",
      weight: "900",
    },
  ],
  variable: "--font-graphik-arabic",
});

export default function Layout({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
