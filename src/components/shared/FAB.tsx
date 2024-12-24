import { cn } from '@/lib/utils'; // Assuming you have a utility for class names
import React from 'react';
import { Link } from 'react-router-dom';

interface FABProps {
    destination: string;
  }

  const FAB: React.FC<FABProps> = ({ destination }) => {
    return (
        <Link to={destination}
        className={cn(
          "fixed lg:bottom-8 bottom-24 right-8 w-16 h-16 rounded-full bg-primary-500 text-white shadow-lg flex items-center justify-center"
        )}
      >
        
        <img src='/assets/icons/plus.svg' alt='create-post' className='invert-white' width={48}/>
      </Link>
    );
  };

export default FAB;
