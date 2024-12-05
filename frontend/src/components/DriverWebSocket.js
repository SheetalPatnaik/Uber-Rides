import React, { useEffect, useState } from "react";

const DriverWebSocket = ({callback}) => {
  const [rideRequests, setRideRequests] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // WebSocket URL (use the correct backend WebSocket endpoint)
    let access_token = localStorage.getItem('accessToken');
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/driver/${access_token}/`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);

      // Parse the incoming message (ensure it matches the server's format)
      const data = JSON.parse(event.data);
    
      if (data?.message?.type === "CREATE_RIDE") {
        // Add the new ride request to the state
        
        console.log(callback)
        callback();
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  return (<></>)
};

export default DriverWebSocket;