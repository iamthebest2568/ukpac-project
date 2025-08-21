# UK PACK Dashboard Backend API

A comprehensive, secure, and high-performance backend application for the UK PACK Data Analytics Dashboard.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with hardcoded admin credentials
- **Comprehensive Analytics**: 12+ API endpoints for data visualization
- **Mock Data Simulation**: 5,420+ realistic user sessions with event tracking
- **Rate Limiting**: Protection against API abuse
- **Error Handling**: Centralized error management with detailed logging
- **Data Export**: CSV and JSON export capabilities
- **Pagination**: Efficient handling of large datasets

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager

## 🛠️ Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` (already provided)
   - Update environment variables if needed

4. **Generate Mock Data (optional)**
   ```bash
   node data/generateMockData.js
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔐 Authentication

### Login Credentials
- **Username**: `alex`
- **Password**: `Geetr2526Ur!`

### Login Endpoint
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "alex",
  "password": "Geetr2526Ur!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "8h",
  "user": {
    "username": "alex",
    "role": "admin"
  }
}
```

### Using the Token
Include the JWT token in the Authorization header for all dashboard API calls:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 API Endpoints

### Group 1: Overall Engagement

#### GET /api/v1/dashboard/engagement/summary
Get overall participation statistics and activity trends.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalParticipants": 5420,
    "initialStance": {
      "เห็นด้วย": 1518,
      "กลางๆ": 2493,
      "ไม่เห็นด้วย": 1409
    },
    "activityByDay": [
      { "date": "2025-01-20", "count": 350 },
      { "date": "2025-01-21", "count": 420 }
    ],
    "completionRate": 94.2,
    "averageSessionDuration": 8.7
  }
}
```

### Group 2: Neutral & Disagree Deep Dive

#### GET /api/v1/dashboard/deepdive/reasoning
Analyze reasoning choices from ASK02.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalResponses": 3902,
    "breakdown": {
      "นโยบายไม่ครอบคลุม": 1800,
      "เก็บไปก็ไม่มีอะไรเกิดขึ้น": 1420,
      "ไม่เชื่อถือรัฐบาล": 682
    },
    "topReasons": [...]
  }
}
```

#### GET /api/v1/dashboard/deepdive/minigame1_2
Aggregate results from Policy Priorities (MN1) and Beneficiary Groups (MN2).

**Response:**
```json
{
  "success": true,
  "data": {
    "mn1Participants": 1800,
    "mn2Participants": 1800,
    "topPolicies": [
      { "name": "ลดค่าโดยสารรถไฟฟ้า", "count": 1200 },
      { "name": "ปรับปรุงคุณภาพรถเมล์", "count": 980 }
    ],
    "topGroups": [
      { "name": "ผู้สูงอายุ", "count": 950 },
      { "name": "นักเรียน นักศึกษา", "count": 820 }
    ]
  }
}
```

#### GET /api/v1/dashboard/deepdive/minigame3
Budget allocation analysis from MN3.

**Response:**
```json
{
  "success": true,
  "data": {
    "participants": 1420,
    "top3Choices": [
      { "name": "เพิ่มที่จอดรถ", "count": 700 },
      { "name": "ลดค่าโดยสารรถไฟฟ้า", "count": 650 }
    ],
    "averageAllocation": {
      "ลดค่าโดยสารรถไฟฟ้า": 45.5,
      "ปรับปรุงคุณภาพรถเมล์": 32.8,
      "เพิ่มที่จอดรถ": 21.7
    }
  }
}
```

#### GET /api/v1/dashboard/deepdive/satisfaction
Satisfaction rates from MN3 participants.

**Response:**
```json
{
  "success": true,
  "data": {
    "satisfied": 800,
    "unsatisfied": 450,
    "total": 1250,
    "satisfactionRate": 64.0
  }
}
```

### Group 3: End-Game Behavior

#### GET /api/v1/dashboard/endgame/fakenews
Fake news interaction analysis.

**Response:**
```json
{
  "success": true,
  "data": {
    "search": 2800,
    "ignore": 2620,
    "total": 5420,
    "searchRate": 51.7,
    "scenarioBreakdown": {
      "ข่าวเรื่องการเปลี่ยนแปลงค่าโดยสาร": 1800,
      "ข่าวเรื่องการยกเลิกโครงการรถไฟฟ้า": 1750
    }
  }
}
```

#### GET /api/v1/dashboard/endgame/rewardfunnel
Reward participation funnel analysis.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSessions": 5420,
    "reachedDecision": 5100,
    "clickedParticipate": 3100,
    "submittedForm": 2500,
    "conversionRates": {
      "decisionRate": 94.1,
      "participationRate": 60.8,
      "formCompletionRate": 80.6
    }
  }
}
```

### Group 4: Qualitative Feedback

#### GET /api/v1/dashboard/feedback/custom_reasons
Get custom reasons with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sessionID": "session_004",
      "timestamp": "2025-01-20T11:32:45.000Z",
      "text": "นโยบายควรมีการรับฟังความคิดเห็นจากประชาชนมากกว่านี้"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "limit": 20
  }
}
```

#### GET /api/v1/dashboard/feedback/suggestions
Get user suggestions with pagination.

Same structure as custom_reasons with suggestion text.

### Additional Endpoints

#### GET /api/v1/dashboard/analytics/trends?timeframe=7d
Get activity trends (7d, 30d, 90d).

#### GET /api/v1/dashboard/analytics/heatmap
Get hourly activity heatmap.

#### GET /api/v1/dashboard/export/raw?format=csv
Export raw data in JSON or CSV format.

#### GET /api/v1/dashboard/stats/summary
Get overall statistics summary.

## 🏗️ Project Structure

```
backend/
├── data/
│   ├── mockData.json           # Generated mock data
│   └── generateMockData.js     # Mock data generator
├── middleware/
│   ├── auth.js                 # JWT authentication
│   ├── errorHandler.js         # Error handling
│   └── requestLogger.js        # Request logging
├── routes/
│   ├── auth.js                 # Authentication routes
│   └── dashboard.js            # Dashboard API routes
├── services/
│   └── DashboardService.js     # Business logic layer
├── .env                        # Environment variables
├── server.js                   # Main server file
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based auth
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet.js**: Security headers
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Request validation and sanitization
- **Error Sanitization**: No sensitive data in error responses

## 🚦 Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-20T10:00:00.000Z",
  "uptime": 3600.5,
  "environment": "development",
  "version": "1.0.0"
}
```

## 📈 Performance

- **Compression**: Gzip compression enabled
- **Efficient Data Processing**: Optimized aggregation algorithms
- **Memory Management**: Lazy loading of mock data
- **Response Caching**: Built-in caching for repeated queries

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "timestamp": "2025-01-20T10:00:00.000Z"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Generate fresh mock data
node data/generateMockData.js
```

## 📦 Production Deployment

1. Set `NODE_ENV=production`
2. Update JWT_SECRET to a secure random string
3. Configure ALLOWED_ORIGINS for your domain
4. Use a process manager like PM2
5. Set up reverse proxy (nginx/Apache)
6. Enable HTTPS

## 📞 API Testing

Use tools like Postman, curl, or any HTTP client:

```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alex","password":"Geetr2526Ur!"}'

# Use the returned token for dashboard APIs
curl -X GET http://localhost:3001/api/v1/dashboard/engagement/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include JSDoc comments
4. Test all endpoints
5. Update documentation

## 📄 License

MIT License - see LICENSE file for details.
