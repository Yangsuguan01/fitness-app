/**
 * Vercel Serverless Function — AI菜品识别代理
 * 
 * 部署到 Vercel 后，前端通过 /api/recognize 调用此函数
 * 百度AI菜品识别 API 代理，前端密钥不暴露
 */

const BAIDU_API_KEY = 'gJ1pVvEcOf4pd4dHzKQa8BMQ';
const BAIDU_SECRET_KEY = 'yDJpvuI18Qwjj5iVP7J5rBjrnNnCayx3';

let tokenCache = { token: null, expiresAt: 0 };

const CAL_DB = {
  "苦瓜炒牛肉": 180, "番茄炒蛋": 150, "青椒炒肉": 200,
  "鱼香肉丝": 220, "宫保鸡丁": 240, "麻婆豆腐": 180,
  "红烧肉": 350, "糖醋里脊": 280, "回锅肉": 320,
  "红烧排骨": 300, "可乐鸡翅": 250, "清蒸鱼": 140,
  "白灼虾": 120, "蛋炒饭": 350, "牛肉面": 450,
  "米饭": 116, "杂粮饭": 110, "鸡蛋": 70,
  "凉拌黄瓜": 45, "蒜蓉西兰花": 80, "干煸四季豆": 150,
  "酸菜鱼": 200, "水煮牛肉": 320, "辣子鸡": 280,
  "土豆丝": 130, "蒸蛋": 90, "紫菜蛋花汤": 40,
  "豆腐脑": 50, "煎饺": 200, "包子": 180,
  "小米粥": 45, "八宝粥": 80, "红薯": 90,
  "玉米": 112, "香蕉": 93, "苹果": 52,
  "西瓜": 30, "葡萄": 45, "牛奶": 65,
  "豆浆": 35, "酸奶": 75, "面包": 265,
  "馒头": 220, "油条": 390, "煎饼果子": 350,
  "炸酱面": 400, "饺子": 200, "汤圆": 260,
  "粽子": 300, "炒米粉": 380, "热干面": 430,
  "担担面": 400, "鸡公煲": 250, "黄焖鸡": 280,
  "烤鸭": 340, "白切鸡": 200, "口水鸡": 260,
  "小龙虾": 150, "螃蟹": 140, "三文鱼": 140,
  "沙拉": 80, "三明治": 250, "披萨": 270,
  "汉堡": 350, "薯条": 320, "可乐": 140,
  "奶茶": 350, "咖啡": 15, "绿茶": 2,
  "西兰花": 80, "花菜": 60, "青菜": 40,
  "白菜": 40, "菠菜": 50, "空心菜": 45,
  "冬瓜": 30, "茄子": 50, "胡萝卜": 55,
  "黄瓜": 45, "西红柿": 45, "南瓜": 65,
  "豆腐": 80, "猪肉": 250, "牛肉": 200,
  "鸡肉": 180, "鸭肉": 200, "鱼肉": 120,
};

async function getBaiduToken() {
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expiresAt) {
    return tokenCache.token;
  }
  const resp = await fetch(
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`,
    { method: 'POST' }
  );
  if (!resp.ok) throw new Error(`百度Token获取失败: ${resp.status}`);
  const data = await resp.json();
  tokenCache.token = data.access_token;
  tokenCache.expiresAt = now + (data.expires_in || 2592000) * 1000 - 60000;
  return tokenCache.token;
}

function corsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    corsHeaders(res);
    res.status(200).end();
    return;
  }
  if (req.method === 'GET') {
    corsHeaders(res);
    res.status(200).json({ status: 'ok', service: 'fitness-ai', version: '1.0' });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  try {
    const { image } = req.body || {};
    if (!image) {
      corsHeaders(res);
      res.status(400).json({ error: '图片数据为空' });
      return;
    }

    const token = await getBaiduToken();
    const formData = new URLSearchParams();
    formData.append('image', image);
    formData.append('top_num', '5');
    formData.append('filter_threshold', '0.05');

    const apiResp = await fetch(
      `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      }
    );

    if (!apiResp.ok) {
      const errText = await apiResp.text();
      corsHeaders(res);
      res.status(502).json({ error: `百度API错误 ${apiResp.status}: ${errText.slice(0, 150)}` });
      return;
    }

    const result = await apiResp.json();
    const dishes = [];

    for (const item of (result.result || []).slice(0, 3)) {
      const name = item.name || '';
      let cal = item.calorie;
      const prob = item.probability || 0;
      if (!cal) {
        for (const [dbName, kcal] of Object.entries(CAL_DB)) {
          if (name.includes(dbName) || dbName.includes(name)) { cal = kcal; break; }
        }
      }
      dishes.push({
        name,
        calorie: cal ? parseFloat(cal) : null,
        probability: Math.round(prob * 1000) / 10,
      });
    }

    corsHeaders(res);
    res.status(200).json({ success: true, dishes });
  } catch (err) {
    corsHeaders(res);
    res.status(500).json({ error: `识别失败: ${err.message}` });
  }
};
