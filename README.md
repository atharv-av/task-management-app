# Task Manager

A web-based task management application built with React and Node.js, featuring a PostgreSQL database for persistent storage.

## Features

- **Task Management**
  - View all tasks
  - Create new tasks
  - Edit existing tasks
  - Delete tasks
  - Mark tasks as complete
  - Set priority levels
  - Schedule tasks with due dates

- **User Experience**
  - Search tasks
  - Sort tasks by creation date or scheduled date
  - Toast notifications for actions
  - Server-side logging
  - Persistent storage across sessions

## Technology Stack

### Frontend
- React (Create React App)
- Sass for styling
- Jest & Enzyme for testing

### Backend
- Node.js
- Express.js
- PostgreSQL

## Environment Setup

### Root Directory
Create a `.env` file in the root directory with the following variables:
```
PORT=3001
DATABASE_URL=your_postgres_database_url
```

### Client Directory
Create a `.env` file in the client directory with the following variables:
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

2. Install dependencies for backend
```bash
npm install
```

3. Install dependencies for frontend
```bash
cd client
npm install
```

4. Set up your environment variables as described above

5. Start the development server
```bash
# In the serve directory
node server/server.js
# In the client directory
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request