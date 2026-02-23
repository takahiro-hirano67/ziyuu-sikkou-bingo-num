import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
    variable: "--font-noto-sans-jp",
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Bingo Num App",
    description: "自由ヶ丘執行委員会のビンゴで使用する番号を管理するアプリです",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
