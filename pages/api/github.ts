import { IncomingMessage, ServerResponse } from "http";

const query = (username: string) => {
  return `  
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
              weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        
        }
      }
    }
    `;
};

async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    throw new Error("Only GET requests are allowed");
  }

  // @ts-expect-error
  const username = req.query.username as string;

  if (typeof username !== "string") {
    throw new Error("username is required");
  }

  const data = await fetch(`https://api.github.com/graphql`, {
    method: "post",
    body: JSON.stringify({ query: query(username) }),
    headers: {
      Authorization: `Bearer ${process.env.REMOTION_GITHUB_TOKEN}`,
      "content-type": "application/json",
    },
  });
  const json = await data.json();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  // Implement CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  res.end(JSON.stringify(json));
}

export default handler;
