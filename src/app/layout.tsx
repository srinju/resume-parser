import "globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Resume Parser",
  description:
    "Resume Parser for French Recruitement Company known as Harmen and Botts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex text-center justify-center">
          <div className="flex text-center">
            <p className="text-bold text-4xl">Resume parser</p>
          </div>
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
