import axios from "axios";
import FormData from "form-data";

export async function sendWhatsApp(number: string, message: string) {
  try {
    const formData = new FormData();
    formData.append("appkey", process.env.WAPANEL_APPKEY!);
    formData.append("authkey", process.env.WAPANEL_AUTHKEY!);
    formData.append("to", number);
    formData.append("message", message);

    const response = await axios.post(
      "https://app.wapanels.com/api/create-message",
      formData,
      { headers: formData.getHeaders?.() }
    );

    console.log("✅ WhatsApp terkirim:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal kirim WhatsApp:", error);
    throw error;
  }
}
