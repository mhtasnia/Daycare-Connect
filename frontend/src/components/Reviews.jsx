import { useState, useEffect } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { FaQuoteLeft } from 'react-icons/fa'
import '../styles/Reviews.css'

const reviews = [
  {
    text: "I found the perfect daycare near my office. Booking and communication are so easy now!",
    author: "Nusrat R.",
    location: "Dhaka"
  },
  {
    text: "Daycare Connect made it simple to compare centers and book a slot for my twins.",
    author: "Tanvir H.",
    location: "Chattogram"
  },
  {
    text: "I love getting photo updates and knowing my child is safe and happy.",
    author: "Shamima A.",
    location: "Sylhet"
  }
]

function Reviews() {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setFade(false), 3500)
    const next = setTimeout(() => {
      setIndex((prev) => (prev + 1) % reviews.length)
      setFade(true)
    }, 4000)
    return () => {
      clearTimeout(timer)
      clearTimeout(next)
    }
  }, [index])

  const review = reviews[index]

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 section-header">
        Real Reviews from Real Parents
      </h2>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className={`p-4 shadow-sm review-card ${fade ? 'fade-in' : 'fade-out'}`} style={{ borderRadius: '1.5rem' }}>
            <blockquote className="blockquote mb-0">
              <p>
                <FaQuoteLeft className="me-2 text-primary" />
                {review.text}
              </p>
              <footer className="blockquote-footer mt-2">
                {review.author}, <cite title={review.location}>{review.location}</cite>
              </footer>
            </blockquote>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
export default Reviews