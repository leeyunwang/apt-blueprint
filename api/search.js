export default async function handler(req, res) {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: "Keyword required" });

  try {
    // 네이버 모바일 검색 API
    const targetUrl = `https://m.land.naver.com/search/result/${encodeURIComponent(keyword)}`;
    
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "Referer": "https://m.land.naver.com/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });

    // 1차 모바일 API 시도 실패 시 자동완성 API로 폴백(Fallback)
    const acUrl = `https://ac.land.naver.com/ac?q=${encodeURIComponent(keyword)}&st=100&r_format=json&r_enc=UTF-8&r_unicode=0&t_k=0&q_enc=UTF-8`;
    const acResponse = await fetch(acUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://fin.land.naver.com/"
      }
    });

    const data = await acResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
