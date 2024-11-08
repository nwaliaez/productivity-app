// components/LoadingSpinner.tsx
'use client';

import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-10">
    <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

export default React.memo(LoadingSpinner);
