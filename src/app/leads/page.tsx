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
  console.log(clientsEmail);
  //every lead in leads is an array with 9 elements, I want to add an extra element true or false if the lead is a client if the lead[0] is in clientsEmail

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      <div className="grid grid-cols-1 gap-4 text-gray-700">
        {leads.map((lead, index) => {
          let bgColor = "bg-white";

          if (clientsEmail.includes(lead[0].trim())) {
            bgColor = "bg-green-300";
          }
          if (lead[1] == "") {
            return null;
          }
          return (
            <div key={index} className={`${bgColor} rounded-lg shadow-md p-4`}>
              <h2 className="text-lg font-semibold">{lead[2]}</h2>
              <p className="text-gray-500">{lead[0]}</p>
              <Link href={`https://wa.me/${lead[1].replace("+", "").trim()}`}>
                {lead[1]}
              </Link>
              <p className="text-gray-500"> CTA:{" " + lead[5]}</p>
              <p className="text-gray-500">
                {" "}
                {new Date(lead[4]).toLocaleDateString("pt-BR")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadsPage;
