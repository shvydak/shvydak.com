import React, {useState} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {useNavigate, Link} from 'react-router-dom'
import './LoginPage.css' // Используем те же стили

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const {register} = useAuth()
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        setIsLoading(true)

        try {
            const success = await register(
                formData.username,
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName
            )
            if (success) {
                navigate('/dashboard')
            } else {
                setError('Registration failed. Please try again.')
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred during registration')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="background-animation"></div>

            <div className="login-card">
                <div className="login-header">
                    <div className="logo">
                        <i className="fas fa-user-plus"></i>
                        <h1>Create Account</h1>
                    </div>
                    <p className="subtitle">Join Shvydak Dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-triangle"></i>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">
                            <i className="fas fa-user"></i>
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            // required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">
                            <i className="fas fa-user"></i>
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">
                            <i className="fas fa-user"></i>
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            <i className="fas fa-envelope"></i>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <i className="fas fa-lock"></i>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            <i className="fas fa-lock"></i>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-user-plus"></i>
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="link">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
