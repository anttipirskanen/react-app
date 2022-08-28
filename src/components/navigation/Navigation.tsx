import React from 'react';
import {Container} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styles from './navigation.module.scss';
import {faHouse, faGamepad} from '@fortawesome/free-solid-svg-icons';
import NavLink from './NavLink';

interface NavigationProps {
    expand: string;
}

const Navigation: React.FC<NavigationProps> = (props) => (
    <Navbar
        key={props.expand}
        bg="dark"
        variant="dark"
        expand={props.expand}
        fixed="top"
        className={styles.navigation}
    >
        <Container fluid>
            <Navbar.Brand href="/">
                <img src="https://react-bootstrap.github.io/logo.svg" width="30" height="30" />{' '}
                React TypeScript App
            </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${props.expand}`} />
            <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${props.expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${props.expand}`}
                placement="end"
                className="offcanvas-dark"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${props.expand}`}>
                        Welcome!
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav variant="dark" className="justify-content-end flex-grow-1 pe-3">
                        <NavLink to="/" title="Home" icon={faHouse} />
                        <NavLink to="/games" title="Games" icon={faGamepad} />
                        <NavLink to="/test" title="Test" />
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
    </Navbar>
);

export default Navigation;
