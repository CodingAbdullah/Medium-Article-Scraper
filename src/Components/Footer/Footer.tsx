import { FC } from 'react';
import './Footer.css';

const Footer: FC = () => {
    return (
        <div className='container'>
            <hr />
            <footer style={{ fontFamily: 'Permanent Marker', padding: '0.5rem' }}>
                Copyright { new Date().getFullYear() }. Powered By React <img className="react-logo" src={require("../../assets/images/logo.svg").default} alt="logo" />
            </footer>
        </div>
    )
}

export default Footer;