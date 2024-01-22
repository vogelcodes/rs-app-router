export async function GET() {
  async function getData() {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );
    const data = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
    };

    async function getAccessToken() {
      try {
        const response = await fetch(
          "https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials",
          {
            method: "POST",
            headers: config.headers,
            body: JSON.stringify(data),
            next: {
              revalidate: 3600,
            },
          }
        );
        console.log(response.body);
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    }

    // Call getAccessToken() once at the beginning of the script and store the resulting access token in a constant

    async function init() {
      let { access_token } = await getAccessToken();
      console.log("Access token:", access_token);
      async function makeApiRequest() {
        // Reuse the access_token in subsequent API requests
        const queryParams = {
          start_date: new Date("2022-02-18T08:30:00.000Z").getTime(),
          end_date: new Date().getTime(),
          max_results: 500,
          transaction_status: "APPROVED",
        };

        const apiConfig = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          next: {
            revalidate: 300,
          },
        };
        let payments;
        try {
          payments = await fetch(
            `https://developers.hotmart.com/payments/api/v1/sales/history?max_results=${queryParams.max_results}&transaction_status=APPROVED,COMPLETE&start_date=${queryParams.start_date}&end_date=${queryParams.end_date}`,
            apiConfig
          );
        } catch (error) {
          console.error(error);
        }
        return payments?.json();
      }
      const apiResponse = makeApiRequest();
      return apiResponse;
    }
    const response = await init();
    return response;
  }
  const data = await getData();
  return Response.json(
    data.items.sort(
      (a: any, b: any) => b.purchase.order_date - a.purchase.order_date
    )
  );
}
