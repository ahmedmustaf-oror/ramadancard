// شحن الكارت

async function rechargeCard(phone, token, cardSerial) {
    const url = "https://web.vodafone.com.eg/services/dxl/ramadanpromo/promotion";
    
    const payload = {
        "@type": "Promo",
        "channel": { "id": "1" },
        "context": { "type": "RamadanRedeemFromHub" },
        "pattern": [{
            "characteristics": [{
                "name": "cardSerial",
                "value": cardSerial
            }]
        }]
    };
    
    const headers = {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': `Bearer ${token}`,
        'Accept-Language': "AR",
        'msisdn': phone,
        'channel': "WEB",
        'Origin': "https://web.vodafone.com.eg",
        'Referer': "https://web.vodafone.com.eg/portal/bf/hub"
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return {
                success: true,
                message: 'تم الشحن بنجاح',
                data: data
            };
        } else {
            return {
                success: false,
                error: data.message || 'فشل الشحن'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
