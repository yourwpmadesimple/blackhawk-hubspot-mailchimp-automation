require("dotenv").config();
const axios = require("axios");

const blackhawkKey = process.env.BLACKHAWK_KEY;
const hubspot_dev_key = process.env.HUBSPOT_DEV_KEY;
const hubspot_prod_key = process.env.HUBSPOT_PROD_KEY;
const hs_properties = `properties=email&properties=firstname&properties=lastname&properties=phone&properties=tags`;

let blackhawkURL = "https://blackhawk.group/wp-json/gf/v2/forms/1/entries";
let hubspotURL = `https://api.hubapi.com/crm/v3/objects/contacts?hapikey=${hubspot_prod_key}&${hs_properties}`;

function blackhawkContacts() {
  let config = {
    method: "get",
    url: blackhawkURL,
    headers: {
      Authorization: `Basic ${blackhawkKey}`,
    },
  };

  axios(config)
    .then((response) => {
      const results = JSON.stringify(response.data);
      const data = JSON.parse(results).entries;
      data.map((obj) => {
        const contacts = {
          properties: {
            email: obj["3"],
            firstname: obj["1.3"],
            lastname: obj["1.6"],
            phone: obj["8"],
            tags: obj["7"],
          },
        };
        createHubSpotContacts(contacts.properties);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  function createHubSpotContacts(contact) {
    let data = JSON.stringify({
      properties: {
        email: contact.email,
        firstname: contact.firstname,
        lastname: contact.lastname,
        phone: contact.phone,
        tags: contact.tags,
      },
    });

    let config = {
      method: "post",
      url: hubspotURL,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        const data = JSON.parse(JSON.stringify(response.data));
        console.log("Create HubSpot Contacts: ", data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
module.exports = {
  blackhawkContacts,
};
