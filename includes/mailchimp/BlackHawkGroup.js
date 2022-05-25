require("dotenv").config();
const axios = require("axios");

// HubSpot vars
const hubspot_prod_key = process.env.HUBSPOT_PROD_KEY;
const hs_properties = `properties=email&properties=firstname&properties=lastname&properties=phone&properties=tags`;
const hubspotURL = `https://api.hubapi.com/crm/v3/objects/contacts?hapikey=${hubspot_prod_key}&${hs_properties}&limit=100`;

// Mailchimp vars
const blackhawkGroup = process.env.MC_BLACKHAWK_GROUP_KEY;
const blackhawkGroupListId = "c9bf94e6b7";
const blackhawkGroupURL = `https://us20.api.mailchimp.com/3.0/lists/${blackhawkGroupListId}`;

let hours = 3600000;
let minutes = 60000;
let seconds = 1000;

function BlacHawkGroup() {
  let config = {
    method: "get",
    url: hubspotURL,
    headers: {},
  };

  axios(config)
    .then((response) => {
      const json = JSON.stringify(response.data);
      const data = JSON.parse(json).results;
      data.map((contact) => {
        const property = contact.properties;
        const contacts = {
          properties: {
            email: property.email,
            firstname: property.firstname,
            lastname: property.lastname,
            phone: property.phone,
            tags: property.tags,
          },
        };
        updateList(contacts.properties);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  function updateList(contact) {
    let data = JSON.stringify({
      members: [
        {
          update_existing: true,
          email_address: contact.email ? contact.email : " ",
          status: "subscribed",
          merge_fields: {
            FNAME: contact.firstname ? contact.firstname : " ",
            LNAME: contact.lastname ? contact.lastname : " ",
            PHONE: contact.phone ? contact.phone : " ",
          },
          tags: [contact.tags ? contact.tags : "HUBSPOT_CONTACT"],
        },
      ],
    });

    let config = {
      method: "POST",
      url: `${blackhawkGroupURL}?skip_merge_validation=true&skip_duplicate_check=true&count=100`,
      headers: {
        Authorization: `Bearer ${blackhawkGroup}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        const blackhawk_group_list = JSON.parse(JSON.stringify(response.data));
        console.log("BLACKHAWK GROUP LIST: ", blackhawk_group_list);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }
}
module.exports = {
  BlacHawkGroup,
};
