import { useEffect } from "react";

export const useScheduler = () => {
    useEffect(() => {
      const startScheduler = async () => {
        try {
          const response = await fetch('/api/scheduler/schedular');
          if (!response.ok) {
            throw new Error('Failed to start scheduler');
          }
        } catch (error) {
          console.error('Error starting scheduler:', error);
        }
      };
  
      startScheduler();
    }, []);
  };
  