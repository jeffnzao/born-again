import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nouvelle Création",
  description: "Application spirituelle - Combat spirituel, Bible, Journal, IA Salomon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        {children}
      </body>
    </html>
  );
}
