const fs = require('fs');
const path = require('path');

// Define the folder structure
const structure = [
  'config',
  'controllers',
  'models',
  'routes',
  'views',
  'public/css',
  'public/js',
  'public/images',
  'middlewares',
  'utils',
];

// Function to create directories
const createDirectories = (dirs) => {
  dirs.forEach((dir) => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    } else {
      console.log(`Directory already exists: ${dirPath}`);
    }
  });
};

// Call function to create the structure
createDirectories(structure);
