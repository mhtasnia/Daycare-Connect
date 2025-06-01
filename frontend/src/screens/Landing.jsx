import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import WhoItsFor from '../components/WhoItsFor'
import WhyChoose from '../components/WhyChoose'
import Reviews from '../components/Reviews'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import LandingNavbar from '../components/LandingNavbar'


function Landing() {
  return (
    <div>
      <section id="landingnavbar">
        <LandingNavbar />
      </section>
      {/* Add margin below navbar */}
      <div style={{ marginTop: '10rem' }} />
      <section id="hero">
        <Hero />
      </section>
      <section id="howitworks">
        <HowItWorks />
      </section>
      <section id="whoitsfor">
        <WhoItsFor />
      </section>
      <section id="whychoose">
        <WhyChoose />
      </section>
      <section id="reviews">
        <Reviews />
      </section>
      <section id="faq">
        <FAQ />
      </section>
      <Footer />
    </div>
  )
}

export default Landing
