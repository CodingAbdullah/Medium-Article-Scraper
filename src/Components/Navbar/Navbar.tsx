import { FC } from 'react';
import '../Navbar/Navbar.css';

const Navbar: FC = () => {
    return (
        <div className='navbar'>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <a style={{ fontSize: '2.75rem', fontWeight: 'bolder' }} className="navbar-brand" href="#/">Medium File Generator</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a style={{ fontSize: '2rem', fontWeight: 'bold' }} className="nav-link" aria-current="page" href="#/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a style={{ fontSize: '2rem', fontWeight: 'bold' }} className="nav-link" href="#/medium-dot-com-files">Application</a>
                            </li>
                            <li className="nav-item">
                                <a style={{ fontSize: '2rem', fontWeight: 'bold' }} className="nav-link" href="#/about">About</a>
                            </li>
                        </ul>
                    </div>               
                </div>
            </nav>
        </div>
    )
}

export default Navbar;