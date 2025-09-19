# DigitalStore - Full-Stack Digital Product Marketplace

A complete full-stack digital product marketplace built with Next.js, featuring Midtrans payment integration and WhatsApp notifications.

## Features

### Frontend
- ✅ Responsive landing page with product catalog
- ✅ Professional checkout system with auto-generated order IDs
- ✅ Modern UI with shadcn/ui components
- ✅ Hero section, features showcase, and product grid

### Backend
- ✅ MongoDB integration with Mongoose
- ✅ Order management system
- ✅ Midtrans Snap payment gateway integration
- ✅ WhatsApp notifications via Fonnte API
- ✅ Webhook handling for payment status updates

### Products Available
- AI Tools (Rp 50,000)
- Streaming Premium (Rp 80,000)
- Editing Software (Rp 120,000)
- Kursus Online (Rp 150,000)
- Komunikasi / App (Rp 30,000)
- Lainnya (Rp 100,000)

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file and configure the following:

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key

# Database
MONGO_URI=mongodb://localhost:27017/digitalstore

# WhatsApp Gateway (Fonnte API)
FONNTE_TOKEN=your_fonnte_api_token

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Midtrans Setup
1. Register at [Midtrans](https://midtrans.com/)
2. Get your Server Key and Client Key from the dashboard
3. Set up webhook URL: `https://yourdomain.com/api/webhook`

### 3. Fonnte API Setup
1. Register at [Fonnte.com](https://fonnte.com/)
2. Get your API token
3. Add the token to your environment variables

### 4. MongoDB Setup
Make sure you have MongoDB running locally or use MongoDB Atlas for cloud database.

## API Endpoints

- `POST /api/create-transaction` - Create new transaction and send WhatsApp notification
- `POST /api/webhook` - Handle Midtrans payment notifications
- `GET /api/order/[order_id]` - Get order details

## WhatsApp Integration

The system automatically sends WhatsApp messages at two points:

1. **Order Created**: Confirmation message with payment link
2. **Payment Success**: Success notification with product access details

## Tech Stack

- **Frontend**: Next.js 13, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Payment**: Midtrans Snap
- **Notifications**: Fonnte WhatsApp API
- **Deployment**: Vercel ready

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Production Deployment

1. Update `MIDTRANS_IS_PRODUCTION=true` in your production environment
2. Use production Midtrans keys
3. Set up proper webhook URL in Midtrans dashboard
4. Deploy to Vercel or your preferred hosting platform

## Support

For technical support or questions, please contact our development team.