'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<'loading' | 'healthy' | 'error'>('loading');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setHealthStatus('healthy');
        } else {
          setHealthStatus('error');
        }
      } catch (error) {
        setHealthStatus('error');
      }
    };

    checkHealth();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Our App</h1>
        
        <div className="mt-4">
          <p className="text-lg">
            系统状态：
            {healthStatus === 'loading' && '检查中...'}
            {healthStatus === 'healthy' && <span className="text-green-600">正常</span>}
            {healthStatus === 'error' && <span className="text-red-600">异常</span>}
          </p>
        </div>
      </div>
    </main>
  );
}