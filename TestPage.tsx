import { useEffect, useState } from 'react';
import { client } from './sanity';

function TestPage() {
  const [message, setMessage] = useState('Testing...');

  useEffect(() => {
    console.log('TestPage mounted');
    
    // Test if Sanity is working
    if (client) {
      setMessage('✅ Sanity client exists');
      console.log('Client config:', client.config());
    } else {
      setMessage('❌ Sanity client is null');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <p className="mb-2">{message}</p>
      <p className="text-sm text-muted-foreground">
        Check the browser console for more details
      </p>
    </div>
  );
}

export default TestPage;