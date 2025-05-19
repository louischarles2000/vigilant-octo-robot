import app from './app';
// import sequelize from './config/db';

const port: any = process.env.PORT || 3001;  // Use environment variable for port if available
const host = '0.0.0.0';  // Bind to all network interfaces (allows external access)

// Start the server and listen on the specified port and host
app.listen(port, host, async () => {
    try {
        // Connect to the database
        // await sequelize.authenticate();
        console.log("Database has been established successfully.");
    } catch (error) {
        console.error("Error establishing connection:", error);
    }

    console.log(`Server started on port ${port} and accessible at http://${host}:${port}`);
});
