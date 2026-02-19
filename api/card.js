// جلب الكروت من API

async function fetchCards(phone, token) {
    const url = `https://web.vodafone.com.eg/services/dxl/ramadanpromo/promotion?@type=RamadanHub&channel=website&msisdn=${phone}`;
    
    const headers = {
        "Host": "web.vodafone.com.eg",
        "msisdn": phone,
        "api-host": "PromotionHost",
        "Accept-Language": "ar",
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-dtreferer': 'https://web.vodafone.com.eg/spa/portal/hub',
        'Accept': 'application/json',
        'clientId': 'WebsiteConsumer',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; RMX3263) AppleWebKit/537.36',
        'channel': 'WEB',
        'Referer': 'https://web.vodafone.com.eg/spa/portal/hub'
    };
    
    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        
        if (response.ok) {
            // استخراج بيانات الكروت
            const cards = extractCards(data);
            return {
                success: true,
                cards: cards
            };
        } else {
            return {
                success: false,
                error: 'فشل جلب الكروت'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

function extractCards(data) {
    const cards = [];
    
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item.pattern) {
                item.pattern.forEach(pattern => {
                    if (pattern.action) {
                        pattern.action.forEach(action => {
                            if (action.characteristics && action.characteristics.length >= 4) {
                                const chars = action.characteristics;
                                cards.push({
                                    serial: chars[3]?.value || '',
                                    units: chars[1]?.value || '',
                                    remaining: chars[2]?.value || '',
                                    type: chars[0]?.value || ''
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    
    return cards;
}
