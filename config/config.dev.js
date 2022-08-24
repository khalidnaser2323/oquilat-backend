module.exports = {
  app: {
    version: "0.0.0",
    is_mandatory: false,
    name: "Oqeilat",
  },
  port: 3000,
  db: {
    url: `mongodb+srv://dbadmin:Passw0rd@hykaiaprd.wziuz.mongodb.net/Oqeilat`
  },
  mobilyWs: {
    apiKey: "dasdas;dmas;dma;d",
    name: "Oqeilat",
  },
  email: {
    url: "https://api.sendinblue.com/v3",
    email: "no-reply@yalladealz.com",
    name: "Yalla Dealz Egypt",
    apiKey: "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"
  },

  storage: {
    accessKey: "MGV6BO6CJVNHAME5SQIO",
    secretKey: "98BQwH3W9Plmjp2XDYo5doiIFtAZaBBKSyru4ORBf+M",
    baseUrl: "digitaloceanspaces.com",
    bucket: "hykaia",
    region: "sfo2",
    folder: "e-commerce",
  },
  auth: {
    local: {
      key: "ZAZDp1IxnPigN9gX4VgiuFl5hSlqSpFaa103S4JsWPGhIKzkMh6vmEiDUbolPeEcVYpN0tN1zkdRE2S3GeOd",
    },
  },
  NODE_ENV: "development",
  guest: {
    _id: "1",
    sub: "1",
    name: "Guest",
    roles: ["guest"],
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTljMTkxOGNjOWU3ZTQxMzA1MWVkZjUiLCJtb2JpbGUiOiIrMTExMTExMTEiLCJyb2xlcyI6WyJndWVzdCJdLCJpYXQiOjE1ODcyODgzNDR9.V2pTQq12LbciV4sDaBn6VlZrOmQ4eXrt6hlLcWiyV-I",
  },
  payTabs: {
    merchant_email: 'k.nassir@hykaia.com',
    secret_key: '7Qdqw0f5ghzTxVZ4XXLCh3AVPFZ1qMnxCBY9BdeSvOL2JL6HISjZVTVLzUN0GbxjMwtoJHgev2gfNnWvfgvbaqXKlLK1WilIOO7y',
    site_url: 'https://api-ecommerce.hakaya.technology',
    return_url: 'https://api-ecommerce.hakaya.technology/finishing',
    request_url: 'https://www.paytabs.com/apiv2/create_pay_page',
    verify_payment_url: 'https://www.paytabs.com/apiv2/verify_payment',
    validate_secret_key_url: "https://www.paytabs.com/apiv2/validate_secret_key"
  },
  fcm: {
    serverKey: "Abalbka",
  },
  messagingServices: {
    endPoint: "https://apis.cequens.com/conversation/wab/v1/messages",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImE2ZTU5ZmQ0NTIxOTNmZTY0ODhlNzI4ZjM0OTM5NWYxYjgwOWUwM2RkNTNiYjI1ZWFhZTMwMWZiOGFiMzQ4ZjdlZTFmM2JkNTVmYTM5MDQwOWFjMTdhMWRjYTM2ODAwNjQ5MGJiMzhkNzI2YTg1ODhmNzZjMTA3NTc0OGUwNDNhMTcwYTYxMThjM2IxYmZkZDJlYTkxNWRlYWE5YTY2NTQwNTBiM2Q5YzI0NjU2NTY2Njc0MWMxZTU4YTJiMDA4MmY4MjdiNjRiNjQyNDhlNjk4ZDgzMTM2Y2FmYTg5NjFjYmRmZDc2N2U5MDgyZjUyY2NjN2JjMWM2ZTU2YmI1YWZiZTNhNjE1NDI2NTNhNDZiZDE0MmU1ZTM1ZTRkZmE5ZDhhZWU1OTBmNGViMjZmYzIxMGRlZTk5MzY1ZDliODFhMDhmY2ZiOTcwMDdmNTYzNzEwMzRhOWFhMGI2NDEyZjE0YWRkODI4ZmU0NzVjOTQzYTU0YmExZjg4MGIzM2IzMDc1YmU3MTQ2MmZjMjI1OTVlMjdiOGFhNWRjMmQyNTcxMzc3N2U5MzBkYzE4ZjY1YThkODEwYzliYmQ2OTUwMGI4ZjhiMjg2Zjg0MDllNzlmYWM5YzMwNmIyYzA3OTNkYmMxMmRlOWQxYmQxYzYzMTk2OTcyY2QwYmIzNTMwOGJiIiwiaWF0IjoxNjI3NDc3NTU3LCJleHAiOjMyMDUzNTc1NTd9.ZE-zklEQBQ1e4CWeEf_bWUH-dkdTe2aH_9_B7wDRpsY"
  }
};