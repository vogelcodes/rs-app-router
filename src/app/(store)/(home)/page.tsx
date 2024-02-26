export const dynamic = "force-dynamic";

export default async function Home() {
  const hotmartSum = await fetch(
    "https://organic-space-goldfish-vwjrw4wpx62x69-3000.preview.app.github.dev/api/hotmart/resumo"
  );
  const metaAdsSum = await fetch(
    "https://organic-space-goldfish-vwjrw4wpx62x69-3000.preview.app.github.dev/api/meta-ads?range=last_month"
  );
  const dataHotmart = await hotmartSum.json();
  const dataMeta = await metaAdsSum.json();
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <>
      <h1>Últimos 14 Dias:</h1>
      <h1>Rendimentos Hotmart: R$ {Number(dataHotmart.total).toFixed(2)}</h1>
      <h1>Gastos Meta-Ads: R$ {Number(dataMeta.total).toFixed(2)}</h1>
      <h1>
        Lucro: R$
        {" " +
          (Number(dataHotmart.total) - Number(dataMeta.total)).toLocaleString(
            "pt-BR"
          )}
      </h1>
    </>
  );
}
