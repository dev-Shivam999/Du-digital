import axios from "axios"
import qs from "qs"

export async function refreshZohoToken() {
  try {
    const data = qs.stringify({
      refresh_token: "1000.15546e3bde428134cc7ed0877dcea73d.f79fccad038b0e66efb929eb65367140",
      client_id: "1000.VPZYRFX1BTEHWER0AZABEMQSCJC0GC",
      client_secret: "32c717e898c2eca4fba31f52dcd908238878a6ad51",
      grant_type: "refresh_token"
    });

    const response = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    return response.data.access_token
  } catch (error:any) {
    console.error(error.response?.data);
  }
}

refreshZohoToken();