
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        flex min-h-[calc(100svh-5rem)]
        w-full items-center justify-center
        bg-background
        px-4 py-10
        sm:px-6 lg:px-8
      "
    >
      <div className="w-full max-w-6xl">
        {children}
      </div>
    </section>
  );
}
