import FileType from '../../types/Filetype';
import './FilePanel.css';

// Custom component for handling File URL display
const FilePanel = (props: { files: FileType }) => {
    const { textURL, audioURLs } = props.files;
    
    // Conditionally Render File URLs
    return (
        <div className='file-panel' style={{ marginTop: '1rem' }}>
            <h3 style={{ fontFamily: 'Square Peg' }}>Your Generated Files</h3>
            <p><i>Select any of the links below for instant download!</i></p>
            <div className='container' style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                <a style={{ color: 'black'}} className='file-links' target="_blank" href={ textURL }>Text File (.txt)</a>
                <br />
                {
                    // Using the built-in key parameter in map() function to indicate audio file
                    audioURLs.map((audioFile, key) => {
                        return (
                            <>
                                <a style={{ color: 'black'}} className='file-links' href={ audioFile }>Audio File Part { key + 1 }</a>
                                <br />
                            </>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default FilePanel;