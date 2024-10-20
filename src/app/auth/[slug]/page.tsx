import React from 'react';
import Login from '@/components/Login';
import Signup from '@/components/Signup';

const Auth = ({ params }: { params: { slug: string } }) => {
  return params.slug === 'login' ? <Login /> : <Signup />;
};

export default Auth;
