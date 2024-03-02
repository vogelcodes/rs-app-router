export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const gsResponse = await fetch(
    "https://script.google.com/macros/s/AKfycbwIAj1HWYmqEeF7I_A3WfJGoshnPzSbQLDYir00RhgoWs1QsRj5nLAsEUIAGYuD7DfopQ/exec",
    {
      next: {
        revalidate: 6000,
      },
    }
  );
  let leads = await gsResponse.json();

  leads = leads.sort((a: string[], b: string[]) => {
    return new Date(b[4]).getTime() - new Date(a[4]).getTime();
  });
  // leads = [new Date().toISOString()].concat(leads.slice(1));
  return Response.json(leads.slice(1));
}
