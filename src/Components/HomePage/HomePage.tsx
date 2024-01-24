import { FC } from 'react';
import { Link } from 'react-router-dom';
import '../HomePage/HomePage.css';

const HomePage: FC = () => {
    return (
        <div className='home-page' style={{ marginTop: '1rem' }}>
            <h1>The Handy-Dandy Tool for Everything Medium.com!</h1>
            <div className='container' style={{ marginTop: '2rem' }}>
                <p>A one-top shop for all your Medium article needs. Do you want a ready-made text file compiled from a Medium article? We got that.
                Do you want to generate and download an audio file from a Medium article? We got that too! The right tool right at yo finger tips!
                </p>
                <p>Please note, articles behind a paywall are not accessible and hence, will not be provided coverage. So what are you waiting for? 
                <br /> 
                Select the button below to start cookin'!
                </p>
                <Link to="/medium-dot-com-files">
                    <button style={{ fontFamily: 'Permanent Marker', marginTop: '1rem' }} className='btn btn-success'>
                        Take me to the Tool!
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default HomePage;