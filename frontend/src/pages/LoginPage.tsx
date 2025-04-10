// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../api/MoviesAPI';
import '../css/LoginPage.css';
import '../css/identity.css';

function LoginPage() {
    // state variables for email and password
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberme, setRememberme] = useState<boolean>(false);

    // state for error messages
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    // handle change events for input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        if (type === 'checkbox') {
            setRememberme(checked);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    // handle close: navigate back to homepage
    const handleClose = () => {
        navigate('/');
    };

    // handle submit event for the form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        const loginUrl = rememberme
            ? `${baseURL}/login?useCookies=true`
            : `${baseURL}/login?useSessionCookies=true`;

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                credentials: 'include', // Ensures cookies are sent & received
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            // Ensure we only parse JSON if there is content
            let data = null;
            const contentLength = response.headers.get('content-length');
            if (contentLength && parseInt(contentLength, 10) > 0) {
                data = await response.json();
            }

            if (!response.ok) {
                throw new Error(data?.message || 'Invalid email or password.');
            }

            navigate('/movies');
        } catch (error: any) {
            setError(error.message || 'Error logging in.');
            console.error('Fetch attempt failed:', error);
        }
    };

    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content">
                {/* Close Button */}
                <button className="close-modal" onClick={handleClose}>
                    X
                </button>
                <h5 className="modal-title text-center">Sign In</h5>
                <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input
                            className="form-control"
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={handleChange}
                        />
                        <label htmlFor="email">Email address</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            className="form-control"
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handleChange}
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="form-check mb-3 text-center">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberme"
                            name="rememberme"
                            checked={rememberme}
                            onChange={handleChange}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="rememberme"
                        >
                            Remember password
                        </label>
                    </div>
                    <div className="text-end mb-3">
                        <button type="button" className="forgot-password-link btn btn-link p-0">
                            Forgot username or password?
                        </button>
                    </div>
                    <div className="d-grid mb-2">
                        <button
                            className="btn btn-signin text-uppercase fw-bold"
                            type="submit"
                        >
                            Sign in
                        </button>
                    </div>
                    <div className="d-grid mb-2">
                        <button
                            className="btn btn-secondary btn-auth text-uppercase fw-bold"
                            type="button"
                            onClick={handleRegisterClick}
                        >
                            Register
                        </button>
                    </div>
                    <hr className="my-4" />
                    <div className="d-grid mb-2">
                        <button
                            className="btn btn-google btn-auth text-uppercase fw-bold"
                            type="button"
                        >
                            <i className="fa-brands fa-google me-2"></i> Sign in
                            with Google
                        </button>
                    </div>
                    <div className="d-grid mb-2">
                        <button
                            className="btn btn-facebook btn-auth text-uppercase fw-bold"
                            type="button"
                        >
                            <i className="fa-brands fa-facebook-f me-2"></i>{' '}
                            Sign in with Facebook
                        </button>
                    </div>
                </form>
                {error && <p className="error text-danger mt-2">{error}</p>}
            </div>
        </div>
    );
}

export default LoginPage;
