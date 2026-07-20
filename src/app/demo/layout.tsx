import { DemoBanner } from "@/components/demo/DemoBanner";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
}
