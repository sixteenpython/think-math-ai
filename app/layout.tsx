import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ThinkMath.ai",
  description: "Socratic Math Mentor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#050505', color: 'white' }}>
        {children}
      </body>
    </html>
  );
}
