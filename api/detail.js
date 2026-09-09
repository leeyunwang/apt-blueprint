export default async function handler(req, res) {
  const { complexNo } = req.query;
  if (!complexNo) return res.status(400).json({ error: "complexNo required" });

  try {
    const response = await fetch(
      `https://fin.land.naver.com/front-api/v1/complex/ptype?complexNo=${complexNo}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://fin.land.naver.com/"
        }
      }
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
