// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Sensor Data Dashboard',
  description: 'Visualización de datos del sensor en tiempo real.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
