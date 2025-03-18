import { Client } from "@/app/(pages)/admin/dashboard/dashboardTabs";
import { useEffect, useState } from "react";

export const PendingCount = () => {

    const [pending, setPending] = useState(0)
    const API_URL = process.env.NEXT_PUBLIC_API_URL as string

    const fetchPending = async () => {
        const response = await fetch(`${API_URL}/api/alertPending`);
        const data = await response.json();
        setPending(data);
      };
    
    useEffect(() => {
    fetchPending();

    const interval = setInterval(() => {
        fetchPending();
    }, 1000);
    return () => clearInterval(interval);
    }, []);
    

    return(

      
      <span
      className="absolute w-6 h-6 -top-0 z-50 -right-2 bg-red-700 rounded-full flex items-center justify-center text-sm"
      >{pending}</span>

    )
}