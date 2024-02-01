import FileType from '../../types/Filetype';

// Custom component for handling File URL display
const FilePanel = (props: { files: FileType }) => {
    const { textURL, audioURLs } = props.files;
    
    // Conditionally Render File URLs
    return (
        <div className='file-panel' style={{ marginTop: '2rem' }}>
            <div className='container' style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
                <h3>Text File</h3>
                <ul>
                    <li><a target="_blank" href={ textURL }>Text File</a></li>
                </ul>
                <ol>
                    { audioURLs.length !== 0 ? <h3>Audio File(s)</h3> : null }
                    {
                        // Using the built-in key parameter in map() function to indicate audio file
                        audioURLs.map((audioFile, key) => {
                            return (
                                <li><a href={ audioFile }>Audio File Part { key + 1 }</a></li>
                            )
                        })
                    }
                </ol>
            </div>
        </div>
    )
}

export default FilePanel;