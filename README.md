git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
 npm install
npm start
MONGO_URI=mongodb://localhost:27017/tareasDB

Scripts:
"scripts": {
    "dev": "vite",
    "build": "vite build",
    "dev2": "nodemon index.js",
    "lint": "eslint .",
    "preview": "vite preview"
  },

"dependencies": {
    "axios": "^1.7.9",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "express-validator": "^7.2.1",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.473.0",
    "mongoose": "^8.9.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.3"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "nodemon": "^3.1.9",
    "vite": "^6.0.5"
  }
