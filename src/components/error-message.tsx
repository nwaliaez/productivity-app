// components/ErrorMessage.tsx
'use client';

import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="flex justify-center items-center py-10">
    <p className="text-red-500 text-center">{message}</p>
  </div>
);

export default React.memo(ErrorMessage);
