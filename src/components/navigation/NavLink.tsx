import React from 'react';
import {NavLink} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconDefinition} from '@fortawesome/free-solid-svg-icons';
import styles from './navLink.module.scss';

interface NavLinkProps {
    to: string;
    title: string;
    icon?: IconDefinition;
}
const AppNavLink: React.FC<NavLinkProps> = (props) => (
    <NavLink to={props.to} className={styles.navLink + ' nav-link'}>
        {props.icon && <FontAwesomeIcon icon={props.icon} />}
        <span>{props.title}</span>
    </NavLink>
);

export default AppNavLink;
