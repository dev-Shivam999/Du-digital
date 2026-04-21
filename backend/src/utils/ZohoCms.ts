import axios  from "axios"

export async function createLead(field:any,token:any) {
  try {
    console.log("Field",field);
    
    const response = await axios.post(
      "https://www.zohoapis.in/crm/v2/Leads",
      {
        data: [
        field
        ]
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(JSON.stringify(response.data.data));
  } catch (error:any) {
    console.error(error.response?.data);
  }
}

// createLead();