import axios from "axios";

export async function sendOtp(mobile:string, otp:string) {
  const url = `https://mobicomm.dove-sms.com//REST/sendsms/`;

  try {
    const response = await axios.post(url, {
      listsms: [
        {
          sms: `${otp} is your verification code for your enquiry with DU Global. Valid for 10 minutes. Please do not share this OTP. Team DUDigital Global Ltd`,
          mobiles: mobile,
          senderid: "DIGIBP",
          clientsmsid: "DUDigi",
          accountusagetypeid: "1",
          entityid: "1701163670907797721",
          tempid: "1707177028462766869",
        },
      ],
      password: "b70b24ab5fXX",
      user: "DUDigi",
    });
  
    if (response.data.smslist.sms.status=="success") {
      return true;
    } else {
      return false;
    }
  } catch (error:any) {
    console.error("SMS Failed:", error.message);
    return false;
  }
}
