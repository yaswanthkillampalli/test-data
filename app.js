// Import required modules
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Initialize the Express application
const app = express();
const port = 3000; // You can choose any free port

app.use(cors());

// --- Routes ---
// Define a single GET endpoint with a dynamic ':id' parameter.
// This will match requests like /api/data/1, /api/data/2, etc.
app.get('/api/data/:id', (req, res) => {
    // Extract the 'id' from the request parameters
    const { id } = req.params;

    // Construct the file path to the corresponding JSON file in the 'data' directory.
    // e.g., if id is '1', the path will be './data/output1.json'
    const filePath = path.join(__dirname, 'data', `output${id}.json`);

    // Read the file from the filesystem.
    fs.readFile(filePath, 'utf8', (err, data) => {
        // Error handling: If the file doesn't exist or there's a read error...
        if (err) {
            console.error(`Error reading file for id ${id}:`, err);
            // ...send a 404 Not Found status with a clear error message.
            return res.status(404).json({ error: `Data for ID ${id} not found.` });
        }

        // Success: If the file is read successfully...
        try {
            // ...parse the file content as JSON...
            const jsonData = JSON.parse(data);
            // ...and send the parsed JSON data as the response.
            res.status(200).json(jsonData);
        } catch (parseError) {
            // Error handling for invalid JSON format
            console.error(`Error parsing JSON for id ${id}:`, parseError);
            res.status(500).json({ error: `Invalid JSON format for ID ${id}.` });
        }
    });
});

// --- Server Startup ---
// Start the server and listen for incoming requests on the specified port.
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Try accessing http://localhost:3000/api/data/1 or http://localhost:3000/api/data/2');
});
