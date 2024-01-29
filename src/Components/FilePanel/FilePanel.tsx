import FileType from '../../types/Filetype';

// Custom component for handling File URL display
const FilePanel = (props: FileType) => {
    const { files } = props;

    // Conditionally Render File URLs
    if (files.length === 2) {
        return (
            <div className='file-panel'>
                <h3><a href={ files[0] }>Text File</a></h3>
                <h3><a href={ files[1] }>Audio File</a></h3>
            </div>
        )
    }
    else {
        return (
            <div className='file-panel'>
                <div className='file-panel'>
                    <h3><a href={ files[0] }>Text File</a></h3>
                </div>
            </div>
        )
    }
}

export default FilePanel;