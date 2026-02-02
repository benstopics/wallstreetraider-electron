import { html, Component } from '../lib/preact.standalone.module.js';
import ErrorModal from './ErrorModal.js';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleDismiss = () => {
        // Reset error state to try rendering again
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        const { hasError, error, errorInfo } = this.state;

        return html`
            <${ErrorModal}
                show=${hasError}
                error=${error}
                errorInfo=${errorInfo}
                onDismiss=${this.handleDismiss}
                onReload=${this.handleReload}
            />
            ${this.props.children}
        `;
    }
}
