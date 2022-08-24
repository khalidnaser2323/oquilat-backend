module.exports = {
  app: {
    version: "0.0.0",
    is_mandatory: false,
    name: "Oqeilat",
  },
  port: 3000,
  db: {
    url: `mongodb+srv://dbadmin:Passw0rd@hykaiaprd.wziuz.mongodb.net/Oqeilat`,
  },
  storage: {
    accessKey: "",
    secretKey: "",
    baseUrl: "",
    bucket: "",
    region: "",
    folder: "",
  },
  auth: {
    local: {
      key:
        "ZAZDp1IxnPigN9gX4VgiuFl5hSlqSpFaa103S4JsWPGhIKzkMh6vmEiDUbolPeEcVYpN0tN1zkdRE2S3GeOd",
    },
  },
  NODE_ENV: "development",
  guest: {
    _id: "1",
    sub: "1",
    name: "Guest",
    roles: ["guest"],
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTljMTkxOGNjOWU3ZTQxMzA1MWVkZjUiLCJtb2JpbGUiOiIrMTExMTExMTEiLCJyb2xlcyI6WyJndWVzdCJdLCJpYXQiOjE1ODcyODgzNDR9.V2pTQq12LbciV4sDaBn6VlZrOmQ4eXrt6hlLcWiyV-I",
  },
  payTabs: {
    merchant_email: "k.nassir@hykaia.com",
    secret_key:
      "7Qdqw0f5ghzTxVZ4XXLCh3AVPFZ1qMnxCBY9BdeSvOL2JL6HISjZVTVLzUN0GbxjMwtoJHgev2gfNnWvfgvbaqXKlLK1WilIOO7y",
    site_url: "https://api-ecommerce.hakaya.technology",
    return_url: "https://api-ecommerce.hakaya.technology/finishing",
    request_url: "https://www.paytabs.com/apiv2/create_pay_page",
    verify_payment_url: "https://www.paytabs.com/apiv2/verify_payment",
    validate_secret_key_url:
      "https://www.paytabs.com/apiv2/validate_secret_key",
  },
  fcm: {
    serverKey: "Abalbka",
  },
};
