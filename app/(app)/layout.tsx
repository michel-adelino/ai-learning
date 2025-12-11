import { Providers } from "@/components/Providers";
import { TutorWidget } from "@/components/tutor";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div>{children}</div>
      <TutorWidget />
    </Providers>
  );
}

export default AppLayout;
