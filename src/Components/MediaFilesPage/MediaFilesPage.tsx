import { FC, FormEvent, useState } from 'react';
import axios from 'axios';
import '../MediaFilesPage/MediaFilesPage.css';
import Alert from '../Alert/Alert';
import FilePanel from '../FilePanel/FilePanel';
import FileType from '../../types/Filetype';

const MediaFilesPage: FC = () => {
    const [audioToggle, updateAudioToggle] = useState(false); // By default, no audio file is created

    const [audioFileVoice, updateAudioFileVoice] = useState('alloy'); // Default voice option, if requested
    const [mediumArticleLink, updateMediumArticleLink] = useState(''); // Initiate an empty link to begin

    // State for working with response data
    const [alert, updateAlert] = useState('');
    const [files, updateFiles] = useState<FileType>({ textURL: "", audioURLs: [], audioFileQuantity: 0 });

    // Utility function to clear state upon each submission request
    const clearHandler = () => {
        updateAlert('');
        updateFiles((prevState) => {
            return {
                ...prevState,
                textURL: '',
                audioURLS: [],
                audioFileQuantity: 0
            }
        });
    }
    
    const mediumArticleFormHandler = (e: FormEvent) => {
        e.preventDefault(); // Prevent premature page refresh
        
        clearHandler(); // Clear any state from previous request
        
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

            updateAlert('loading');

            // Once the options are set, make call to the back-end to fetch files
            axios.post('https://3.129.218.32.nip.io/parse-file', options)
            .then((response: any) => {

                // Conditionally update Alert and update file state of URLs of text/audio files
                if (response.data.uploadURL.audioFileQuantity === -1){
                    updateAlert('valid-medium-url-overload');
                }
                else {
                    updateAlert('valid-medium-url');
                }

                // Updating file state
                updateFiles((prevState) => {
                    return {
                        ...prevState,
                        textURL: response.data.uploadURL.textURL,
                        audioURLs: response.data.uploadURL.audioURLs,
                        audioFileQuantity: response.data.uploadURL.audioFileQuantity
                    }
                });
            })
            .catch((err: any) => {
                updateAlert('invalid-medium-url');
            });
        }
        else {
            updateAlert('invalid-medium-url');
        }
    }

    // Invert the Audio File option state upon selection
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
                <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%', marginTop: '1rem' }} className="form-check">
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
                <select style={{ marginTop: '0.5rem', marginLeft: 'auto', marginRight: 'auto', width: '50%' }} onChange={ e => updateAudioFileVoice(e.target.value) } disabled={ !audioToggle } className="form-select" aria-label="Default select example">
                    <option value="alloy">Alloy</option>
                    <option value="echo">Echo</option>
                    <option value="fable">Fable</option>
                    <option value="oynx">Oynx</option>
                    <option value="nova">Nova</option>
                    <option value="shimmer">Shimmer</option>
                </select>
                <button style={{ fontFamily: 'Permanent Marker', marginTop: '1rem', marginBottom: '1rem' }} type="submit" className="btn btn-dark">Submit</button>
            </form>
            { alert === 'valid-medium-url' || alert === 'valid-medium-url-overload' && files !== null ? <FilePanel files={ files } /> : null }
        </div>
    )
}

export default MediaFilesPage;