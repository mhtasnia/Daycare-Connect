import { Container, Row, Col, Card } from 'react-bootstrap'
import { FaQuestionCircle } from 'react-icons/fa'
import '../styles/FAQ.css'

function FAQ() {
  const faqs = [
    { q: "Is Daycare Connect free to use?", a: "Yes, it's free for parents to search and book daycares." },
    { q: "How does daycare verification work?", a: "All daycares go through a strict verification process before being listed." },
    { q: "Can I book for multiple children?", a: "Absolutely! You can add profiles for each of your children." },
    { q: "What if I have a complaint?", a: "You can submit complaints directly through the platform for investigation." }
  ]
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 section-header">
        <FaQuestionCircle className="section-icon" style={{ color: '#90caf9' }} />
        <span>Frequently Asked Questions</span>
      </h2>
      <Row className="justify-content-center">
        <Col md={8}>
          {faqs.map((faq, i) => (
            <Card
              key={i}
              className={`mb-3 p-3 border-0 shadow-sm faq-card animate__animated animate__fadeInUp`}
              style={{
                borderRadius: '1rem',
                animationDelay: `${i * 0.13 + 0.1}s`
              }}
            >
              <Card.Title className="faq-question" style={{ fontSize: '1.1rem' }}>
                {faq.q}
              </Card.Title>
              <Card.Text className="faq-answer">{faq.a}</Card.Text>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  )
}
export default FAQ