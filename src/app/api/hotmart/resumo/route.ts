import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const datePresets = [
  "today",
  "yesterday",
  "this_month",
  "last_month",
  "this_quarter",
  "maximum",
  "data_maximum",
  "last_3d",
  "last_7d",
  "last_14d",
  "last_28d",
  "last_30d",
  "last_90d",
  "last_week_mon_sun",
  "last_week_sun_sat",
  "last_quarter",
  "last_year",
  "this_week_mon_today",
  "this_week_sun_today",
  "this_year",
];

export async function GET(request: NextRequest) {
  async function getData() {
    const range = request.nextUrl.searchParams.get("range") ?? "14";

    async function getAccessToken(
      clientId: string | undefined,
      clientSecret: string | undefined,
      basicAuth: string | undefined
    ) {
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
      try {
        const response = await fetch(
          "https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials",
          {
            method: "POST",
            headers: config.headers,
            body: JSON.stringify(data),
            next: {
              revalidate: 3600 * 24,
            },
          }
        );
        console.log(response.body);
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    }
    const clientIdDaniel = process.env.CLIENT_ID2;
    const clientSecretDaniel = process.env.CLIENT_SECRET2;
    const clientIdCarol = process.env.CLIENT_ID;
    const clientSecretCarol = process.env.CLIENT_SECRET;
    const basicAuthDaniel = Buffer.from(
      `${clientIdDaniel}:${clientSecretDaniel}`
    ).toString("base64");
    const basicAuthCarol = Buffer.from(
      `${clientIdCarol}:${clientSecretCarol}`
    ).toString("base64");

    const msPerDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    const start_date = today.getTime() - msPerDay * Number(range);

    // Call getAccessToken() once at the beginning of the script and store the resulting access token in a constant

    async function init(access_token: string) {
      console.log("Access token:", access_token);
      async function makeApiRequest() {
        // Reuse the access_token in subsequent API requests
        var queryParams = {
          start_date,
          end_date: new Date().getTime(),
          max_results: 500,
          transaction_status: "APPROVED",
        };
        console.log(queryParams);

        const apiConfig = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          next: {
            revalidate: 5,
          },
        };
        let payments;
        try {
          payments = await fetch(
            `https://developers.hotmart.com/payments/api/v1/sales/summary?max_results=${queryParams.max_results}&transaction_status=APPROVED,COMPLETE&start_date=${queryParams.start_date}&end_date=${queryParams.end_date}`,
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
    let authCarol = await getAccessToken(
      clientIdCarol,
      clientSecretCarol,
      basicAuthCarol
    );
    let access_tokenCarol = authCarol.access_token;
    const responseCarol = await init(access_tokenCarol);
    let authDaniel = await getAccessToken(
      clientIdDaniel,
      clientSecretDaniel,
      basicAuthDaniel
    );
    let access_tokenDaniel = authDaniel.access_token;
    const responseDaniel = await init(access_tokenDaniel);
    return {
      total:
        responseCarol.items[0].total_value.value +
        responseDaniel.items[0].total_value.value,
      responseCarol,
      responseDaniel,
    };
  }
  const data = await getData();
  return Response.json(data);
}
