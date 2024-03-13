import Link from "next/link";
import React from "react";
import { HotmartSales } from "../../types/hotmart";

export const dynamic = "force-dynamic";

const LeadsPage: React.FC = async () => {
  const leads: string[][] = await fetch(
    "https://admin.amamentaclube.com.br/api/leads"
  ).then((res) => res.json());

  const clients: HotmartSales[] = await fetch(
    "https://admin.amamentaclube.com.br/api/hotmart/sales"
  ).then((res) => res.json());
  const clientsEmail = clients.map((client) => client.buyer.email);
  // console.log(JSON.parse(leads[1][8]));
  // console.log(clientsEmail);
  //every lead in leads is an array with 9 elements, I want to add an extra element true or false if the lead is a client if the lead[0] is in clientsEmail
  // function to reduce in 3 hours a date

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      <div className="grid grid-cols-1 gap-4 text-gray-700">
        {leads.map((lead, index) => {
          let bgColor = "bg-white";
          // check if lead[8] is a valid JSON
          let leadLocation = { city: "N/A", region_code: "", country_code: "" };
          try {
            leadLocation = JSON.parse(lead[8]);
          } catch (e) {
            // console.log("lead[8] is not a valid JSON");
          }

          // console.log(leadLocation);
          if (clientsEmail.includes(lead[0].trim())) {
            bgColor = "bg-green-300";
          }
          if (lead[1] == "" && lead[0] == "") {
            return null;
          }
          const urlPath = lead[6].split("?")[0];
          const urlParams = new URLSearchParams(lead[6].split("?")[1]);

          const utmSource =
            urlParams.get("utm_source") ?? urlParams.get("source");

          const utmContent = urlParams.get("utm_content");
          const utmAdset = urlParams.get("utm_adset");
          const utmMedium = urlParams.get("utm_medium");

          return (
            <div key={index} className={`${bgColor} rounded-lg shadow-md p-4`}>
              <p className="text-gray-500">
                {new Date(lead[4]).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                })}{" "}
                {leadLocation.city}
                {", " +
                  leadLocation.region_code +
                  ", " +
                  leadLocation.country_code}
              </p>
              <h2 className="text-lg font-semibold">{lead[2]}</h2>
              <p className="text-gray-500">{lead[0]}</p>
              <Link href={`https://wa.me/${lead[1].replace("+", "").trim()}`}>
                {lead[1]}
              </Link>
              <p className="text-gray-500"> CTA:{" " + lead[5]}</p>

              <p>
                <span className="px-2 py-1 font-bold bg-slate-100">URL:</span>
                {urlPath}{" "}
                <span className="px-2 py-1 font-bold bg-slate-100">Fonte:</span>{" "}
                {utmSource ?? "N/A"}{" "}
                <span className="px-2 py-1 font-bold bg-slate-100">Mídia:</span>{" "}
                {utmMedium ?? "N/A"}{" "}
                <span className="px-2 py-1 font-bold bg-slate-100">
                  CjAnúncios:
                </span>{" "}
                {utmAdset ?? "N/A"}{" "}
                <span className="px-2 py-1 font-bold bg-slate-100">Ad:</span>
                {utmContent ?? "N/A"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadsPage;
