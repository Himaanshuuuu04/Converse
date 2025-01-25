# 🌐 Full Stack Realtime Chat App

Welcome to the Full Stack Realtime Chat App! This application offers seamless real-time communication with a modern and responsive design.

![App Demo](link-to-demo-image-or-gif)

## 🚀 Features

- **Real-Time Messaging**: Experience instant communication powered by Socket.io.
- **User Authentication**: Secure login and registration using JWT.
- **Online Status**: View active users in real-time.
- **Responsive Design**: Optimized for all devices with TailwindCSS and Daisy UI.
- **Global State Management**: Efficient state handling with Zustand.
- **Error Handling**: Robust client and server-side error management.
- **Typing Indicators**: See when other users are typing in real time.
- **Media Sharing**: Share images and files directly in the chat.
- **Message History**: Persistent message storage for chat history.
- **Dark Mode**: User-friendly dark mode for better accessibility.

## 🛠️ Tech Stack

- **Frontend**: React, TailwindCSS, Daisy UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-Time Communication**: Socket.io
- **State Management**: Zustand
- **Cloud Storage**: Cloudinary for media storage

## 📸 Screenshots

![Login Screen](link-to-login-screen-image)
*Login Screen*

![Chat Interface](link-to-chat-interface-image)
*Chat Interface*

![Dark Mode](link-to-dark-mode-image)
*Dark Mode*

## 🏗️ Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/burakorkmez/fullstack-chat-app.git
   cd fullstack-chat-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_uri
   PORT=5001
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

4. **Build the Application**:
   ```bash
   npm run build
   ```

5. **Start the Application**:
   ```bash
   npm start
   ```

## 🧪 Testing

To run tests, use the following command:
```bash
npm test
```

## 🚀 Deployment

This app is ready for deployment to cloud platforms like Heroku, Vercel, or AWS. Follow these steps:

1. **Prepare for Production**:
   ```bash
   npm run build
   ```
2. **Set Environment Variables** on your cloud provider.
3. **Deploy** the app using your preferred method.

For detailed instructions, refer to the [Deployment Guide](link-to-deployment-guide).

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a New Branch**:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Commit Your Changes**:
   ```bash
   git commit -m 'Add some feature'
   ```
4. **Push to the Branch**:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.




