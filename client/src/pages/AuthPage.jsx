import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const isRegister = searchParams.get('mode') === 'register';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {isRegister ? <RegisterForm /> : <LoginForm />}

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <Link
                        to={isRegister ? '/auth' : '/auth?mode=register'}
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        {isRegister ? 'Login here' : 'Register here'}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
