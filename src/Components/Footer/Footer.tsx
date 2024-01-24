import { FC } from 'react';

const Footer: FC = () => {
    return (
        <div className='container'>
            <hr />
            <footer style={{ fontFamily: 'Permanent Marker', padding: '0.5rem' }}>
                Copyright { new Date().getFullYear() }. All Rights Reserved.
            </footer>
        </div>
    )
}

export default Footer;