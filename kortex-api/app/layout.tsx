import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kortex FC | Cérebro Analítico',
  description: 'Motor matemático e dashboard de telemetria.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-gray-950 text-gray-100 antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
