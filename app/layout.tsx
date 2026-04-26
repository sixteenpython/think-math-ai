export const metadata = { title: "ThinkMath.ai" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#050505', color: 'white' }}>{children}</body>
    </html>
  );
}
