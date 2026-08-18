import Button from './Button.jsx';
import './ErrorState.css';

function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="error-state">
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;