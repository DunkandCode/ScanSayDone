import { LoginCard } from "@/components/auth/login-card";
import { LoginVisual } from "@/components/auth/login-visual";

export default function EntrarPage() {
  return (
    <main
      className="min-h-screen w-full px-4 py-12 lg:p-0"
      style={{
        backgroundImage:
          "linear-gradient(180deg, var(--color-background-page) 0%, var(--color-surface-elevated) 100%)",
      }}
    >
      <div className="mx-auto grid min-h-screen w-full max-w-[1680px] grid-cols-1 items-center justify-items-center gap-10 lg:grid-cols-2 lg:gap-0">
        {/* Left column — access card */}
        <div className="w-full self-center lg:px-12 lg:py-14">
          <LoginCard />
        </div>

        {/* Right column — decorative piece (hidden below lg) */}
        <LoginVisual />
      </div>
    </main>
  );
}
