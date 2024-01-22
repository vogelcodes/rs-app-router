import { stringify } from "querystring";

export async function GET() {
  const gsResponse = await fetch(
    "https://script.google.com/macros/s/AKfycbwIAj1HWYmqEeF7I_A3WfJGoshnPzSbQLDYir00RhgoWs1QsRj5nLAsEUIAGYuD7DfopQ/exec",
    {
      next: { revalidate: 300 },
    }
  );
  let leads = await gsResponse.json();

  leads = leads.sort((a: string[], b: string[]) => {
    return new Date(b[4]).getTime() - new Date(a[4]).getTime();
  });
  return Response.json(leads);
}
