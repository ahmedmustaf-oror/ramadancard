here// هذا الملف يحاكي API تسجيل الدخول
// في التطبيق الفعلي، هذا الكود سيكون على سيرفر Node.js

async function login(phone, password) {
    const url = "https://mobile.vodafone.com.eg/auth/realms/vf-realm/protocol/openid-connect/token";
    
    const payload = {
        grant_type: "password",
        username: phone,
        password: password,
        client_secret: "95fd95fb-7489-4958-8ae6-d31a525cd20a",
        client_id: "ana-vodafone-app"
    };
    
    const headers = {
        'User-Agent': "okhttp/4.12.0",
        'Accept': "application/json, text/plain, */*",
        'silentLogin': "true",
        'x-agent-operatingsystem': "11",
        'clientId': "AnaVodafoneAndroid",
        'Accept-Language': "ar",
        'x-agent-device': "Realme RMX3263",
        'x-agent-version': "2026.2.3",
        'x-agent-build': "1117",
        'digitalId': "2BG70GFR8JSNK",
        'device-id': "1df70a386d754747",
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: new URLSearchParams(payload)
        });
        
        const data = await response.json();
        
        if (response.ok && data.access_token) {
            return {
                success: true,
                token: data.access_token,
                data: data
            };
        } else {
            return {
                success: false,
                error: data.error_description || 'فشل تسجيل الدخول'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
