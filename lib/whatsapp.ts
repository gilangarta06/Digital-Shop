import axios from 'axios';

export async function sendWhatsApp(number: string, message: string) {
  try {
    const response = await axios.post('https://api.fonnte.com/send', {
      target: number,
      message: message,
    }, {
      headers: {
        'Authorization': process.env.FONNTE_TOKEN
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}