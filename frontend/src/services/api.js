export const registerCustomer = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/api/register-customer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to register customer');
      }
  
      const data = await response.json();
      return data;  // Return the response data
    } catch (error) {
      console.error('Error:', error);
      return { error: error.message };
    }
  };