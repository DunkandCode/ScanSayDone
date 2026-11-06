import { SiteHeader } from "@/components/chrome/site-header";
import { SiteFooter } from "@/components/chrome/site-footer";
import { MAIN_ID } from "@/components/chrome/chrome-ids";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main
        id={MAIN_ID}
        tabIndex={-1}
        className="flex-1 pt-[76px] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
      >
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
