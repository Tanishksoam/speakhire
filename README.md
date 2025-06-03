# speakhire
# SpeakHire

A full-stack application with a React + TypeScript + Vite frontend and a Node.js/Express + TypeScript + MongoDB backend.

## Table of Contents

- Features
- Project Structure
- Tech Stack
- Getting Started
  - Prerequisites
  - Setup (Frontend & Backend)
- Usage
- API Overview
- Contribution
- License

## Features

### Frontend (Client)
- Built with React 19, TypeScript, Vite, and TailwindCSS.
- UI components using Radix UI and Lucide icons.
- State management with Redux Toolkit and Redux Persist.
- Routing and navigation via React Router v7.
- Multiple form-building options:
  - Scratch form builder
  - Import form
  - AI-powered form builder
- Responses dashboard and landing page.

### Backend (Server)
- Node.js with Express for API endpoints.
- MongoDB for database storage (using Mongoose ODM).
- User and form management APIs (`/api/users`, `/api/forms`).
- Email support via Nodemailer.
- CORS enabled for cross-origin resource sharing.
- Environment-based configuration using dotenv.
- Health check endpoint for deployments.

## Project Structure

## Tech Stack

**Frontend:**
- React, TypeScript, Vite
- TailwindCSS, Radix UI, Lucide
- Redux Toolkit, React Router

**Backend:**
- Node.js, Express, TypeScript
- MongoDB, Mongoose
- Nodemailer
- dotenv, cors

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance

### Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/Tanishksoam/speakhire.git
cd speakhire

cd server
npm install
# Create a .env file with MONGO_URI and PORT
cp .env.example .env
# Edit .env to add your MongoDB URI and desired PORT
npm run dev

cd ../client
npm install
npm run dev
