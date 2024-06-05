// src/hooks/useHasUsers.js
import { useState, useEffect } from "react";
import axios from "axios";

const useHasUsers = () => {
  const [hasUsers, setHasUsers] = useState(null);

  useEffect(() => {
    const fetchHasUsers = async () => {
      try {
        const response = await axios.get(
          "https://ashalota.gandhipoka.com/has-users"
        );
        setHasUsers(response.data.hasUsers);
      } catch (error) {
        console.error("Error fetching user count:", error);
        setHasUsers(null);
      }
    };

    fetchHasUsers();
  }, []);

  return hasUsers;
};

export default useHasUsers;
