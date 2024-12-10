import React, { useEffect, useState } from "react";
import { websocketBaseUrl } from "../services/api-services";
import { baseUrl } from '../services/api-services';

const WebSocketComponent = ({ callback, type }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // WebSocket URL (use the correct backend WebSocket endpoint)
    var ws = null;
    if (type == 'driver') {
      let access_token = localStorage.getItem('accessToken');
      ws = new WebSocket(`${websocketBaseUrl}/ws/driver/${access_token}/`);
    } else {
      let access_token = localStorage.getItem('access_token');
      ws = new WebSocket(`${websocketBaseUrl}/ws/customer/${access_token}/`);
    }

    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket connected");
        setConnected(true);
      };

      ws.onmessage = (event) => {
        console.log("Message received:", event.data);

        // Parse the incoming message (ensure it matches the server's format)
        const data = JSON.parse(event.data);

        console.log(callback)
        callback();
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setConnected(false);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

    }

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (<></>)
};

export default WebSocketComponent;