# Knowledge Management System

A comprehensive team knowledge management application with AI-powered features for document creation, search, and collaboration.

## Features

### Core Functionality
- **User Authentication**: Email/password authentication with role-based access (admin/user)
- **Document Management**: Create, edit, delete, and organize team documents
- **AI-Powered Features**: 
  - Automatic document summarization
  - Intelligent tag generation
  - Semantic search capabilities
  - Q&A system with context-aware responses
- **Advanced Search**: Both traditional text search and AI-powered semantic search
- **Team Collaboration**: Activity feed showing recent team actions

### Advanced Features
- **Document Versioning**: Complete edit history with version tracking
- **Role-Based Permissions**: Admins can manage all documents, users can only edit their own
- **Real-time Activity Feed**: See what team members are working on
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the provided local URL

### Demo Credentials

**Admin User:**
- Email: admin@example.com
- Password: password

**Regular User:**
- Email: user@example.com  
- Password: password

## Architecture

### Frontend (React + JavaScript)
- **Authentication**: Context-based auth with JWT simulation
- **State Management**: React Context for global state
- **UI Components**: Modular component architecture with Tailwind CSS
- **Responsive Design**: Mobile-first approach with breakpoints

### Simulated Backend Features
- **Document CRUD**: Full create, read, update, delete operations
- **AI Integration**: Simulated Gemini AI for summarization, tagging, and Q&A
- **Search Engine**: Text and semantic search algorithms
- **Activity Tracking**: Real-time team collaboration insights

## Usage

### Creating Documents
1. Click "New Document" from the dashboard or sidebar
2. Enter title and content
3. Use AI features to generate summaries and tags automatically
4. Save to add to the team knowledge base

### Searching Documents
1. Navigate to the Search page
2. Choose between text search or semantic search
3. Enter your query and view results
4. Filter by tags for more specific results

### Team Q&A
1. Go to the Team Q&A tab
2. Ask questions in natural language
3. AI will provide answers based on your team's documents
4. View previous Q&A history for reference

### Document History
1. Hover over any document card
2. Click the history icon to view all versions
3. See who made changes and when
4. Compare different versions of the document

## Technology Stack

- **Frontend**: React 18, JavaScript, Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

## Design System

### Colors
- **Primary**: Blue (#3B82F6) for main actions and highlights
- **Secondary**: Purple (#8B5CF6) for AI features
- **Success**: Green (#10B981) for positive actions
- **Warning**: Amber (#F59E0B) for cautions
- **Error**: Red (#EF4444) for destructive actions

### Typography
- **Headings**: Bold, clean typography with proper hierarchy
- **Body Text**: Readable with appropriate line spacing
- **Code**: Monospace font for technical content

### Layout
- **Responsive Breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- **Spacing System**: 8px base unit for consistent spacing
- **Component Structure**: Modular, reusable components

## Backend Integration Guide

For production deployment, this frontend can be connected to:

### Database Setup (MongoDB)
```javascript
// Example document schema
const documentSchema = {
  title: String,
  content: String,
  tags: [String],
  summary: String,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  versions: [{
    title: String,
    content: String,
    tags: [String],
    summary: String,
    timestamp: Date,
    editedBy: ObjectId
  }]
};
```

### Authentication (Express + JWT)
```javascript
// Example auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

### AI Integration (Google Gemini)
```javascript
// Example Gemini integration
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSummary = async (content) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = `Summarize this document in 2-3 sentences: ${content}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/knowledge-base

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# AI Integration
GEMINI_API_KEY=your-gemini-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration  
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Documents
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Create new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/search` - Search documents

### AI Features
- `POST /api/ai/summarize` - Generate document summary
- `POST /api/ai/tags` - Generate document tags
- `POST /api/ai/qa` - Ask question about documents

## License

MIT License - see LICENSE file for details