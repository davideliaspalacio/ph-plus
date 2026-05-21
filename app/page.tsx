import Header from "./components/Header";
import Hero from "./components/Hero";
import WhyPhPlus from "./components/WhyPhPlus";
import Products from "./components/Products";
import Testimonial from "./components/Testimonial";
import Cta from "./components/Cta";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <WhyPhPlus />
        <Products />
        <Testimonial />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
