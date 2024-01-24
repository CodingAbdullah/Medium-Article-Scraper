import { FC } from 'react';
import { Link } from 'react-router-dom';

const AboutPage: FC = () => {
    return (
        <div className='about-page' style={{ marginTop: '1rem' }}>
            <h1>About</h1>
            <div className='container' style={{ marginTop: '2rem' }}>
                <p>
                    Medium.com provides a built-in audio listener which translates text-to-speech of the article you are reading.
                    However, it does not provide any mechanism for downloading the article as an audible nor does it provide the ability to read a plain text file. 
                    <br />
                </p>
                <p style={{ marginTop: '1rem', paddingBottom: '1rem' }}>
                    This app hopes to bridge that gap by allowing the user to seamlessly enter an article link and thereby, have an audio file and/or a text file readily available at their disposal.
                </p>
            </div>
            <hr style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }} />
            <h1 style={{ paddingTop: '1rem' }}>Implementation</h1>
            <div className='container' style={{ marginTop: '2rem' }}>
                <p>
                    Implementing this process is very simple. We make use of two APIs. The first, is a <a style={{ fontWeight: 'bold', color: 'black' }} target="_blank" href="https://www.scraperapi.com/"> Web Scraper API </a>. We validate the Medium article by first checking to see if it is not paywalled. 
                    If that is the case, we simply parse through the article to create the readable text document and/or pass in this input string for text-to-speech processing which, in this case, makes use of the second API. 
                    <br />
                </p>
                <p style={{ marginTop: '1rem', paddingBottom: '1rem' }}>
                    The second API is <a style={{ fontWeight: 'bold', color: 'black' }} target="_blank" href="https://platform.openai.com/docs/guides/text-to-speech"> OpenAI's TTS API</a> which seamlessly translates text to speech based on a voice the user requests. 
                    This audible can then be downloaded by the user. The user has the freedom to download a readable text file, an audio file or both.
                </p>
            </div>
            <hr style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }} />
            <h1 style={{ paddingTop: '1rem' }}>Resources</h1>
            <div className='container' style={{ marginTop: '2rem' }}>
                <p>
                    For more information on implementation and additional explanation, please visit the official <a style={{ fontWeight: 'bold', color: 'black' }} target="_blank" href="https://github.com/CodingAbdullah/Medium-Article-Scraper"> code repository</a> for the application.
                </p>
                <Link to="/">
                    <button style={{ fontFamily: 'Permanent Marker', marginTop: '1rem', marginBottom: '1rem' }} className='btn btn-success'>
                        Home
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default AboutPage;