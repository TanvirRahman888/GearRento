import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6FAFB] px-6 dark:bg-[#091821]">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-[#122633] dark:text-[#F0F9FC]">
          Welcome to GearRento
        </h1>

        <p className="mt-4 text-lg text-[#526675] dark:text-[#A8C0CB]">
          Rent smarter. Build bigger.
        </p>

        <Button className="mt-6 bg-[#FFB547] text-[#17212B] hover:bg-[#F2A333]">
          GearRento
        </Button>
      </div>
    </main>
  );
}