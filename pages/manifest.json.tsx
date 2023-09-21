import { getBrand, useAuthToken } from "@sirclo/nexus";
import { GRAPHQL_URI } from "components/Constants";

const Manifest = () => <></>;
export default Manifest;

export async function getServerSideProps({ req, res }) {
  const tokenData = await useAuthToken({ req, res, env: process.env }); 
	const token = tokenData.value; 

const data = await getBrand(GRAPHQL_URI(req), token);

  const body = `
    {
      "name": "${data?.settings?.websiteTitle}",
      "short_name": "${data?.settings?.websiteTitle}",
      "icons": [
        {
          "src": "${`https://thumbor.sirclocdn.xyz/unsafe/192x192/filters:format(png)/${data?.settings?.faviconURL}`}",
          "sizes": "192x192",
          "type": "image/png"
        }
      ],
      "theme_color": "#FFFFFF",
      "background_color": "#FFFFFF",
      "start_url": "/",
      "display": "standalone",
      "orientation": "portrait"
    }
  `.trim();

  res.writeHead(200, {
    "Content-Length": Buffer.byteLength(body),
    "Content-Type": "application/json",
  });
  res.write(body);
  res.end();

  return { props: {} };
}