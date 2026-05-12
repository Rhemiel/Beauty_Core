import '../src/index.css';

export const metadata = {
  title: 'BeautyCore',
  description: 'Salon Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
