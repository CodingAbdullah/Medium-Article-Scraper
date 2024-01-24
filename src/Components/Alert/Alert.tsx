import { AlertType } from '../../types/AlertType';

const Alert = (props: AlertType) => {
    const { type } = props;
    let message = '';

    switch (type) {
        case "invalid-medium-url":
            message = "Invalid Medium URL! Please enter again!";
        break;
        case "valid-medium-url":
            message = "Valid Medium URL! Appropriate files generated!";
        break;
    }

    // Conditionally render Alert component
    if (type.split("-")[0] === 'invalid'){
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