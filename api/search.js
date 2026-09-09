export default async function handler(req, res) {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: "Keyword is required" });

  try {
    // 네이버 부동산 통합 검색 API
    const url = `https://m.land.naver.com/search/searchList?keyword=${encodeURIComponent(keyword)}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "Referer": "https://m.land.naver.com/"
      }
    });

    if (!response.ok) {
      throw new Error(`Naver API responded with status ${response.status}`);
    }

    const text = await response.text();
    
    // JSON 응답 시도
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (e) {
      // JSON 파싱 안될 경우 자동완성 API 폴백
      const acUrl = `https://ac.land.naver.com/ac?q=${encodeURIComponent(keyword)}&st=100&r_format=json&r_enc=UTF-8&r_unicode=0&t_k=0&q_enc=UTF-8`;
      const acRes = await fetch(acUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://fin.land.naver.com/"
        }
      });
      const acData = await acRes.json();
      return res.status(200).json(acData);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
