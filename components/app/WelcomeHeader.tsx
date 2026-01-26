'use client';

import { useEffect, useState } from 'react';

interface WelcomeHeaderProps {
  firstName: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

export function WelcomeHeader({ firstName }: WelcomeHeaderProps) {
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    setGreeting(getGreeting());
    
    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
      {greeting}, {firstName}
    </h1>
  );
}
