import { AlertType } from '../../types/AlertType';

const Alert = (props: AlertType) => {
    const { type } = props;
    let message = '';

    switch (type) {
        case "loading":
            message = "Please wait a few moments as the files are being created.."
            break;
        case "invalid-medium-url":
            message = "Invalid Medium URL! Please enter again!";
        break;
        case "valid-medium-url":
            message = "Valid Medium URL! Appropriate files generated!";
        break;
        case "valid-medium-url-overload":
            message = "Medium article too big in size for audio. Only text can be generated!";
        break;
    }

    // Conditionally render Alert component
    if (type === 'loading'){
        return (
            <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }} 
                 className="alert alert-warning" 
                 role="alert"
                 >
                { message }
            </div>
        )
    }
    else if (type === 'valid-medium-url-overload'){
        return (
            <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }} 
                 className="alert alert-info" 
                 role="alert"
                 >
                { message }
            </div>
        ) 
    }
    else if (type.split("-")[0] === 'invalid'){
        return (
            <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }} 
                 className="alert alert-danger" 
                 role="alert"
                 >
                { message }
            </div>
        )
    }
    else {
        return (
            <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }} 
                 className="alert alert-success"
                 role="alert"
                 >
                { message }
            </div>
        )
    }
}

export default Alert;