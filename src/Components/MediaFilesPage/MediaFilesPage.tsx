import { FC, FormEvent, useState } from 'react';
import axios from 'axios';
import '../MediaFilesPage/MediaFilesPage.css';
import Alert from '../Alert/Alert';
import FilePanel from '../FilePanel/FilePanel';

const MediaFilesPage: FC = () => {
    const [audioToggle, updateAudioToggle] = useState(false); // By default, no audio file is created

    const [audioFileVoice, updateAudioFileVoice] = useState('alloy'); // Default voice option, if requested
    const [mediumArticleLink, updateMediumArticleLink] = useState(''); // Initiate an empty link to begin

    // State for working with response data
    const [alert, updateAlert] = useState('');
    const [files, updateFiles] = useState(null);

    const mediumArticleFormHandler = (e: FormEvent) => {
        e.preventDefault(); // Prevent premature page refresh
        
        // Perform a basic check of the Medium article link
        if (mediumArticleLink.includes('medium.com')) {
            // Set options for making the API request
            let options = {
                method: 'POST',
                body: JSON.stringify({ 
                    articleLink: mediumArticleLink,
                    audioFileOption: audioToggle,
                    audioFileVoiceOption: audioFileVoice,
                    textFileOption: true, // Always true as it is always checked
                }),
                headers : {
                    'content-type' : 'application/json'
                }
            }

            // Once the options are set, make call to the back-end to fetch files
            axios.post('http://localhost:5000/parse-file', options)
            .then((response: any) => {
                // Update Alert notification and Update File state to contain URLs of text/audio files
                updateAlert('valid-medium-url');
                updateFiles(response.data.uploadURL);
            })
            .catch((err: any) => {
                updateAlert('invalid-medium-url');
            });
        }
        else {
            updateAlert('invald-medium-url');
        }
    }

    // Invert the Audio File Option state upon selection
    const audioFileSelector = (e: FormEvent<HTMLInputElement>) => {
        let audioToggleState = !audioToggle;
        updateAudioToggle(audioToggleState);
    }

    return (
        <div className='media-files-page'>
            <h1>File Generator</h1>
            <div className='container' style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                <p style={{ marginTop: '1rem' }}>
                    In the form below, enter in the URL of the free, public-facing Medium article of your choice.
                    You can request an audio file and/or a readable text file to download.
                </p>
                { alert === '' ? null : <Alert type={ alert } /> }
            </div>
            <form onSubmit={ mediumArticleFormHandler } style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                <label style={{ marginTop: '0.5rem' }} className="form-label">Medium Article URL</label>
                <input style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }} onChange={ e => updateMediumArticleLink(e.target.value) } type="text" className="form-control" required />
                <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }} className="form-check">
                    <input className="form-check-input" type="checkbox" value="text" checked />
                    <label className="form-check-label">
                        Text File (By Default)
                    </label>
                </div>
                <div style={{ marginTop: '0.5rem', marginLeft: 'auto', marginRight: 'auto', width: '50%' }} className="form-check">
                    <input className="form-check-input" type="checkbox" onChange={ audioFileSelector } value="audio" />
                    <label className="form-check-label">
                        Audio File
                    </label>
                </div>
                {
                    audioToggle ? 
                    <>
                        <h6 style ={{ marginTop: '2rem' }}>Audio Voice Type</h6>
                        <div className="form-check">
                            <div className='container' style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                                <input className="form-check-input" type="radio" onChange={ e => updateAudioFileVoice(e.target.value) } value="alloy" name="audioVoice" defaultChecked />
                                <label className="form-check-label">
                                    Alloy
                                </label>
                            </div>
                        </div>
                        <div className="form-check">
                            <div className='container' style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                                <input className="form-check-input" type="radio" onChange={ e => updateAudioFileVoice(e.target.value) }  value="echo" name="audioVoice" />
                                <label className="form-check-label">
                                    Echo
                                </label>
                            </div>
                        </div>
                        <div className="form-check">
                            <div className='container' style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                                <input className="form-check-input" type="radio" onChange={ e => updateAudioFileVoice(e.target.value) }  value="fable" name="audioVoice" />
                                <label className="form-check-label">
                                    Fable
                                </label>
                            </div>
                        </div>
                        <div className="form-check">
                            <div className='container' style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                                <input className="form-check-input" type="radio" onChange={ e => updateAudioFileVoice(e.target.value) }  value="oynx" name="audioVoice" />
                                <label className="form-check-label">
                                    Oynx
                                </label>
                            </div>
                        </div>
                        <div className="form-check">
                            <div className='container' style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                                <input className="form-check-input" type="radio" onChange={ e => updateAudioFileVoice(e.target.value) }  value="nova" name="audioVoice" />
                                <label className="form-check-label">
                                    Nova
                                </label>
                            </div>
                        </div>
                        <div className="form-check">
                            <div className='container' style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                                <input className="form-check-input" type="radio" onChange={ e => updateAudioFileVoice(e.target.value) }  value="shimmer" name="audioVoice" />
                                <label className="form-check-label">
                                    Shimmer
                                </label>
                            </div>
                        </div>
                    </>
                    : null
                }
                <button style={{ fontFamily: 'Permanent Marker', marginTop: '1rem', marginBottom: '1rem' }} type="submit" className="btn btn-success">Submit</button>
            </form>
            { alert === 'valid-medium-url' && files !== null ? <FilePanel files={ files } /> : null }
        </div>
    )
}

export default MediaFilesPage;