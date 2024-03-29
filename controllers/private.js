/**
 * Controller for Accessing Private Data
 * --------------------------------------
 * This controller function handles requests to a private route.
 * It demonstrates how to send back a response indicating successful access.
 * 
 * The 'req.user' information is assumed to be populated by the 'protect' middleware.
 * 
 * Extend this template by adding more logic as needed for your specific application requirements.
 */

export const getPrivateData = (req, res, next) => {
  try {
    // Ensure 'req.user' is available, set by 'protect' middleware
    if (!req.user) {
      throw new Error("User information is not available. Ensure 'protect' middleware is configured correctly.");
    }

    // Example data to be sent back
    const responseData = {
      success: true,
      data: "Access to the private route granted",
      user: req.user,
      message: "req.user got filled from the middleware 'protect'"
    };

    // Sending the successful response
    res.status(200).json(responseData);
  } catch (error) {
    // Error handling
    // Log the error for debugging purposes
    console.error("Error in getPrivateData:", error);

    // Send an error response
    res.status(500).json({
      success: false,
      message: "An error occurred while accessing private data."
    });
  }
};

// You can add more controller functions below using a similar structure
