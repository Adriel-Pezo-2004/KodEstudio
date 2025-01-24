import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import './About.css';

const About = () => {
  return (
    <Container className="py-5 p-3 cont">
      <Row className="mb-5">
        <Col>
            <h1 className="text-center mb-3 lenguajes-title">Nuestra Historia</h1>
          <p className="text-center">Establecida el a;o 2025, Kod Estudio es un proyecto de un estudiante de Ingenería de Sistemas, que busca brindar una experiencia de calidad, desde el inicio y posterior al desarrollo.</p>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col md={6}>
          <Image src="https://obieg.pl/uploads/news/314/16693747796585c0e5e23ffec200c863.jpg" fluid className='Image' />
        </Col>
        <Col md={6}>
          <h1 className="text-center mb-3 lenguajes-title">Misión</h1>
          <p>Desarrollar soluciones tecnológicas innovadoras y de alta calidad que impulsen la transformación digital de nuestros clientes, proporcionando servicios de software personalizados que optimicen sus procesos y generen valor agregado para sus negocios.</p>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col md={6}>
          <h1 className="text-center mb-3 lenguajes-title">Visión</h1>
          <p>Ser el socio tecnológico líder en desarrollo de software, reconocido por nuestra excelencia, creatividad y compromiso con la innovación, contribuyendo al crecimiento y éxito digital de las empresas en la región.</p>
        </Col>
        <Col md={6}>
            <Image src="https://images.prismic.io/lunii/5dcaeb71-a949-46e6-af26-508fd7eb0855_Push+Content+Image+1+-+Desktop.png" fluid className='Image' />
        </Col>
      </Row>
      <Row className="mb-5">
        <Col>
          <h2 className="text-center">Nuestro Equipo</h2>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Img variant="top" src="https://media.licdn.com/dms/image/v2/D5603AQHJxpZ53xpOMQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1727361841085?e=1743033600&v=beta&t=HQifTbOynT2gxvTVnhJlRo-SmwFSE-oPmw2ADg93-W4" />
            <Card.Body>
              <Card.Title>Adriel Francesco Pezo Vizcarra</Card.Title>
              <Card.Text>
              Estudiante de Ingeniería de Sistemas de la Universidad Católica Santa María, en Arequipa, Perú.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
        </Col>
      </Row>
    </Container>
  );
};

export default About;