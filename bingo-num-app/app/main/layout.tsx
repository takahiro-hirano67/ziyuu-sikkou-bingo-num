export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className="flex-1 w-full h-full min-w-screen min-h-screen bg-[#fefefe]">
            {children}
        </section>
    );
}