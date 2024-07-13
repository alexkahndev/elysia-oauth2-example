import React from 'react';

type LoginProps = {
    switchToSignUp: () => void;
};

export const Login = ({ switchToSignUp }: LoginProps) => {
    const handleGoogleLogin = async () => {
        // Redirect to Google OAuth login
        window.location.href = '/auth/google';
    };

    const handleEmailLogin = async () => {
        // Implement email login logic here
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2
                style={{
                    marginBottom: '20px',
                    fontSize: '24px',
                    textAlign: 'center',
                    color: '#333'
                }}
            >
                Login
            </h2>
            <button
                onClick={handleGoogleLogin}
                style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: '#4285F4',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Login with Google
            </button>
            <button
                onClick={handleEmailLogin}
                style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Login with Email
            </button>
            <p
                style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    color: '#333',
                    cursor: 'pointer'
                }}
                onClick={switchToSignUp}
            >
                Don't have an account? Sign up here.
            </p>
        </div>
    );
};
