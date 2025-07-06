import "./(navbar)/globals.css";

export const metadata = {
  title: "Waffir Marketing",
  description: "...",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  );
}
