import Games from 'src/features/games/Games';
import Home from 'components/home/Home';
import Navigation from 'components/navigation/Navigation';
import React from 'react';
import {Container} from 'react-bootstrap';
import {Route, Routes} from 'react-router-dom';
import styles from './main.module.scss';
import Dodge from 'components/dodge/Dodge';
import Platform from 'components/platform/Platform';

const Main: React.FC = () => (
    <>
        <Navigation expand="nav" />
        <Container className={styles.mainContent}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="games" element={<Games />} />
                <Route path="dodge" element={<Dodge />} />
                <Route path="platform" element={<Platform />} />
            </Routes>
        </Container>
    </>
);

export default Main;
