# RikrikERP Backend API

Construction Financial Management System - Backend Service

## Features

- **Authentication & Authorization**: JWT-based authentication with Redis session management
- **Role-based Access Control**: Admin, User, and Viewer roles
- **Project Management**: Create and manage construction projects
- **Material Management (HS)**: Manage construction materials and prices
- **Cost Analysis (AHS)**: Analyze project costs with detailed breakdowns
- **Budget Planning (RAB)**: Create and manage project budgets
- **Excel Export**: Generate reports in Excel format
- **Secure API**: Rate limiting, CORS, Helmet protection

## Requirements

- Node.js v14 or higher
- MySQL 5.7 or higher
- Redis 6.0 or higher
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Database credentials
   - JWT secret
   - Redis connection details

5. Create the MySQL database:
   ```sql
   CREATE DATABASE rikrik_schema;
   ```

6. Initialize the database and create admin user:
   ```bash
   npm run init-db
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user (requires auth)
- `GET /api/v1/auth/profile` - Get user profile (requires auth)
- `PUT /api/v1/auth/profile` - Update user profile (requires auth)
- `PUT /api/v1/auth/change-password` - Change password (requires auth)

### Projects (requires authentication)
- `GET /api/v1/project/get-project-full-data` - Get all projects
- `POST /api/v1/project/post-new-project` - Create new project
- `POST /api/v1/project/update-project` - Update project
- `POST /api/v1/project/delete-project` - Delete project

### Materials (HS) (requires authentication)
- `GET /api/v1/data-source/get-hs-full-data` - Get all materials
- `POST /api/v1/data-source/post-new-hs` - Create new material
- `POST /api/v1/data-source/update-hs` - Update material
- `POST /api/v1/data-source/delete-hs` - Delete material

### Cost Analysis (AHS) (requires authentication)
- `GET /api/v1/project/get-ahs-project-full-data` - Get AHS data
- `POST /api/v1/project/post-new-ahs-project-utama` - Create AHS main
- `POST /api/v1/project/post-new-ahs-project-detail` - Create AHS detail

### Budget (RAB) (requires authentication)
- `GET /api/v1/project/get-rab-judul-full-data` - Get RAB data
- `POST /api/v1/project/post-new-rab-judul` - Create RAB title
- `POST /api/v1/project/post-new-rab-detail` - Create RAB detail

### Excel Export (requires admin or user role)
- `GET /api/v1/excel/export-hs` - Export materials to Excel
- `GET /api/v1/excel/export-ahs` - Export cost analysis to Excel

### Health Check
- `GET /health` - API health check

## Default Credentials

After running `npm run init-db`, a default admin user is created:
- Username: `admin`
- Password: `Admin123!`

**⚠️ Important**: Change the default password after first login!

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Redis-based session management
- Token blacklisting on logout
- Rate limiting to prevent abuse
- CORS protection
- Helmet.js security headers
- Input validation and sanitization

## Project Structure

```
rikrikerp-nodejs/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── scripts/         # Utility scripts
├── utils/           # Helper utilities
├── logs/            # Application logs
├── app.js           # Main application file
└── package.json     # Dependencies
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 8080 |
| NODE_ENV | Environment (development/production) | development |
| DB_HOST | MySQL host | localhost |
| DB_PORT | MySQL port | 3306 |
| DB_NAME | Database name | rikrik_schema |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRES_IN | Token expiration | 7d |
| REDIS_HOST | Redis host | localhost |
| REDIS_PORT | Redis port | 6379 |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors (if applicable)
}
```

## Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC License

Hello world!
This is Draft Expenditure Budget Generator App!

Created by: Fauzan Naufal Ramadhan
