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
  const range = request.nextUrl.searchParams.get("range");
  console.log(range);
  const metaAdsToken = process.env.META_ADS_TOKEN;
  try {
    let response = await fetch(
      `https://graph.facebook.com/v17.0/act_182895559595801/insights?access_token=${metaAdsToken}&date_preset=${range}&fields=campaign_name,clicks,conversions,ctr,spend,campaign_id&level=adset&limit=120&pretty=0&time_increment=1`,
      { next: { revalidate: 6000 } }
    );
    let insights = await response.json();
    console.log(insights);

    let { data } = insights;

    while (insights.paging.next) {
      response = await fetch(insights.paging.next);
      insights = await response.json();
      data = data.concat(insights.data);
    }
    const result = data.reduce((accumulator: any, current: any) => {
      const date = current.date_start;
      const spend = parseFloat(current.spend);

      // Update the total spend
      accumulator.total = (accumulator.total || 0) + spend;
      // Initialize the accumulator for the date if it doesn't exist
      accumulator[date] = (accumulator[date] || 0) + spend;

      return accumulator;
    }, {});
    result["details"] = data;

    return Response.json(result);
  } catch (error) {
    return Response.json(error);
  }
}
