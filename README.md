# PQI Quiz Email Service

This is the backend service for handling and sending result emails using Node.js, Express, and Nodemailer.

## Features

- Lightweight Express server
- Email sending via Nodemailer
- HTML email template for consistent styling

## File Structure

```
.gitignore
emailService.js          # Core logic for configuring and sending emails
emailTemplate.html       # HTML template for email content
index.js                 # Express server entry point
package-lock.json
package.json
```

## Technologies Used

- Node.js
- Express
- Nodemailer

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/s111ew/pqi-backend.git
cd pqi-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
FROM_EMAIL=your@email.com
SMTP_HOST=smtp.mailprovider.com
SMTP_USER=your@email.com
SMTP_PORT=587
SMTP_PASS=yourpassword
```

### 4. Run the Server

```bash
node index.js
```

The server will start on the configured port (default is 3000).

## Customising Email

The markup for the email body sent to users lives in `emailTemplate.html`. This can easily be customised as standard HTML.

There are variables within the template, denoted with:

```
{{variableName}}
```

These can be configured within `emailService.js` with the matching variable name.

## API Endpoints

### POST /send-email

Sends an email using the provided data.

#### Request Body:

```json
{
  "firstName": "User name",
  "answers": "Array of questions with user's numerical answers",
  "email": "User email address"
}
```

#### Response:

```json
{
  "success": true,
  "message": "Email sent successfully"
}
```
