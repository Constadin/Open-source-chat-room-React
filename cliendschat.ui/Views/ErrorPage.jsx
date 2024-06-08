
import './errorpage.css';




export default function ErrorPage() {

    return (
        <div className="error-container">
            <h1 className="error-heading">404 - Bad Request</h1>
            <p className="error-message">Sorry, the request could not be understood by the server due to malformed syntax.</p>            
        </div>
    );
};
