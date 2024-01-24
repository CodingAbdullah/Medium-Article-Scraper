import { FC, FormEvent } from 'react';
import '../MediaFilesPage/MediaFilesPage.css';

const MediaFilesPage: FC = () => {

    const mediumArticleHandler = (e: FormEvent) => {
        e.preventDefault(); // Prevent premature page refresh
        // Handler to go here with state to determine what panel should be made available containing data
    }

    return (
        <div className='media-files-page'>
            <h1>File Generator</h1>
            <div className='container' style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                <p style={{ marginTop: '1rem' }}>
                    In the form below, enter in the URL of the free, public-facing Medium article of your choice.
                    You can request an audio file and/or a readable text file to download.
                </p>
            </div>
            <form onSubmit={ mediumArticleHandler } style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                <label style={{ marginTop: '0.5rem' }} className="form-label">Medium Article URL</label>
                <input style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }} type="text" className="form-control" />
                <div style={{ marginTop: '0.5rem', marginLeft: 'auto', marginRight: 'auto', width: '50%' }} className="form-check">
                    <input className="form-check-input" type="checkbox" value="audio" />
                    <label className="form-check-label">
                        Audio File (By Default)
                    </label>
                </div>
                <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }} className="form-check">
                    <input className="form-check-input" type="checkbox" value="text" />
                    <label className="form-check-label">
                        Text File
                    </label>
                </div>
                <button style={{ fontFamily: 'Permanent Marker', marginTop: '1rem', marginBottom: '1rem' }} type="submit" className="btn btn-success">Submit</button>
            </form>
        </div>
    )
}

export default MediaFilesPage;