import axios from "axios";

export async function sendOtp(mobile, otp) {
  const url = `https://mobicomm.dove-sms.com//REST/sendsms/`;

  try {
    const response = await axios.post(url, {
      listsms: [
        {
          sms: "123456 is your verification code for your enquiry with DU Global. Valid for 10 minutes. Please do not share this OTP. Team DUDigital Global Ltd",
          mobiles: "+917852008477",
          senderid: "INFOSM",
          clientsmsid: "DUDigi",
          accountusagetypeid: "1",
          entityid: "1234567891112131415",
          tempid: "1707177028462766869",
        },
      ],
      password: "b70b24ab5fXX",
      user: "DUDigi",
    });
    console.log(response.data);

    if (!response.data.includes("InvalidMobileNumber")) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("SMS Failed:", error.message);
    return false;
  }
}

sendOtp("919876543210", "123456").then((success) => {
  if (success) {
    console.log("OTP sent successfully!");
  } else {
    console.log("Failed to send OTP.");
  }
});
