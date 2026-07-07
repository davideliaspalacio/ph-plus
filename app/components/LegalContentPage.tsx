import Footer from "./Footer";
import Header from "./Header";

type LegalContentPageProps = {
  title: string;
  intro: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
};

export default function LegalContentPage({
  title,
  intro,
  sections,
}: LegalContentPageProps) {
  return (
    <>
      <Header />
      <main className="bg-white px-5 py-10 text-[#1e3a8a] lg:px-10 lg:py-16">
        <article className="ph-condensed mx-auto max-w-[920px]">
          <h1 className="ph-display text-center text-[34px] uppercase leading-none lg:text-[48px]">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-[760px] text-center text-[20px] font-bold leading-tight text-[#6b7280] lg:text-[26px]">
            {intro}
          </p>
          <div className="mt-10 grid gap-6">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-[10px] border border-[#d7d7d7] bg-[#f8f8f8] px-5 py-5 shadow-[3px_4px_0_rgba(0,0,0,0.18)] lg:px-7 lg:py-6"
              >
                <h2 className="text-[24px] font-bold leading-tight lg:text-[30px]">
                  {section.title}
                </h2>
                <p className="mt-3 whitespace-pre-line text-[18px] font-bold leading-relaxed text-[#4b5563] lg:text-[22px]">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
