export default async function handler(req, res) {
  const { complexNo } = req.query;
  if (!complexNo) return res.status(400).json({ error: "complexNo is required" });

  try {
    const url = `https://fin.land.naver.com/front-api/v1/complex/ptype?complexNo=${complexNo}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://fin.land.naver.com/"
      }
    });

    if (!response.ok) {
      // 모바일 API 폴백
      const mUrl = `https://m.land.naver.com/complex/getComplexPtypeInfo?hscpNo=${complexNo}`;
      const mRes = await fetch(mUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15",
          "Referer": "https://m.land.naver.com/"
        }
      });
      const mData = await mRes.json();
      return res.status(200).json(mData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
