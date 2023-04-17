import { getAccessToken } from "../../lib/spotify";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        res.status(500).json({ error: "Error fetching access token" });
        return;
      }

      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(500).json({ error: "Error fetching access token" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
