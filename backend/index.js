const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

//  route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.use(express.json()); // Enable JSON parsing for POST requests

// Route to add a new user
app.post('/api/users', (req, res) => {
    const newUser = req.body; // Expecting { firstname, lastname, email }
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data');
        }
        
        const users = JSON.parse(data);
        
        // Check if the user already exists
        const userExists = users.some(user => user.email === newUser.email);
        if (userExists) {
            return res.status(400).send('User already exists');
        }
        
        // Add new user and save
        users.push({ id: users.length + 1, ...newUser });
        
        fs.writeFile(filePath, JSON.stringify(users, null, 2), err => {
            if (err) {
                return res.status(500).send('Error saving user');
            }
            res.status(201).json(newUser);
        });
    });
});


// the endpoint to get user data
app.get('/api/users', (req, res) => {
    const filePath = path.join(__dirname, 'MOCK_DATA.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err); // Log the error for more details
            return res.status(500).send('Error reading data');
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError); // Log JSON parsing errors
            return res.status(500).send('Error parsing data');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
