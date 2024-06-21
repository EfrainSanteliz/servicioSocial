import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

function NavBar() {
  return (
    <Navbar expand="lg" className="bg-dark" data-bs-theme="dark">
            <Container className='me-auto'>
            <Navbar.Brand>Residencias Profesionales</Navbar.Brand>
                <Nav>
                    <Nav.Link href="#inicio">Inicio</Nav.Link>
                    <Nav.Link href="#evaluar">Evaluar</Nav.Link>
                    <Nav.Link href="#asignar">Asignar</Nav.Link>
                    <Nav.Link href="#empresas">Empresas</Nav.Link>
                    <Nav.Link href="#fechas">Fechas</Nav.Link>
                    <Nav.Link href="#logout">Cerrar Cuenta</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
  )
}

export default NavBar