// متغيرات عامة
let currentUser = null;
let jwtToken = null;
let cardsData = [];

// التحقق من وجود مستخدم مسجل الدخول
document.addEventListener('DOMContentLoaded', function() {
    // إذا كنا في صفحة الداشبورد
    if (document.querySelector('.dashboard-page')) {
        const savedUser = localStorage.getItem('vodafoneUser');
        if (!savedUser) {
            window.location.href = 'index.html';
            return;
        }
        
        currentUser = JSON.parse(savedUser);
        document.getElementById('userPhone').textContent = currentUser.phone;
        
        // جلب الكروت
        fetchCards();
    }
    
    // إذا كنا في صفحة تسجيل الدخول
    if (document.querySelector('.login-page')) {
        setupLoginForm();
        setupPasswordToggle();
    }
});

// إعداد نموذج تسجيل الدخول
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        
        // إظهار التحميل
        showToast('جاري تسجيل الدخول...', 'info');
        
        try {
            // محاكاة تسجيل الدخول (في الواقع هنستخدم API حقيقي)
            // لكن بسبب قيود CORS، هنخزن البيانات محلياً
            const userData = {
                phone: phone,
                password: password,
                loggedInAt: new Date().toISOString()
            };
            
            localStorage.setItem('vodafoneUser', JSON.stringify(userData));
            currentUser = userData;
            
            showToast('تم تسجيل الدخول بنجاح', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            showToast('فشل تسجيل الدخول: ' + error.message, 'error');
        }
    });
}

// إظهار/إخفاء كلمة المرور
function setupPasswordToggle() {
    const toggleBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

// جلب الكروت
async function fetchCards() {
    showLoading(true);
    
    try {
        // محاكاة جلب الكروت من API
        // في الواقع هنا هنستخدم API الحقيقي
        
        // بيانات تجريبية مشابهة للصورة
        const mockCards = [
            {
                serial: "3989209342377",
                units: 100,
                remaining: 41,
                type: "دقائق"
            },
            {
                serial: "3989209342378",
                units: 50,
                remaining: 25,
                type: "ميجا"
            },
            {
                serial: "3989209342379",
                units: 200,
                remaining: 10,
                type: "دقائق"
            },
            {
                serial: "3989209342380",
                units: 75,
                remaining: 30,
                type: "ميجا"
            }
        ];
        
        cardsData = mockCards;
        
        // تحديث الإحصائيات
        document.getElementById('activatedCount').textContent = 
            cardsData.filter(card => card.remaining > 0).length;
        document.getElementById('totalCards').textContent = cardsData.length;
        
        showLoading(false);
        
    } catch (error) {
        showLoading(false);
        showToast('فشل جلب الكروت: ' + error.message, 'error');
    }
}

// عرض الكروت حسب الطريقة المختارة
function showManualCards() {
    document.getElementById('manualMethod').style.display = 'none';
    document.getElementById('directMethod').style.display = 'none';
    document.getElementById('manualSection').style.display = 'block';
    
    const cardsList = document.getElementById('manualCardsList');
    cardsList.innerHTML = '';
    
    cardsData.forEach(card => {
        const cardElement = createCardElement(card, 'manual');
        cardsList.appendChild(cardElement);
    });
}

function showDirectCards() {
    document.getElementById('manualMethod').style.display = 'none';
    document.getElementById('directMethod').style.display = 'none';
    document.getElementById('directSection').style.display = 'block';
    
    const cardsList = document.getElementById('directCardsList');
    cardsList.innerHTML = '';
    
    cardsData.forEach(card => {
        const cardElement = createCardElement(card, 'direct');
        cardsList.appendChild(cardElement);
    });
}

// إنشاء عنصر كارت
function createCardElement(card, type) {
    const div = document.createElement('div');
    div.className = 'card-item';
    
    const cardCode = `*858*${card.serial}#`;
    
    div.innerHTML = `
        <div class="card-number">${cardCode}</div>
        <div class="card-info">
            <div class="info-item">
                <span class="info-label">الوحدات</span>
                <span class="info-value">${card.units}</span>
            </div>
            <div class="info-item">
                <span class="info-label">نوع</span>
                <span class="info-value">${card.type}</span>
            </div>
            <div class="info-item">
                <span class="info-label">متبقي</span>
                <span class="info-value">${card.remaining}</span>
            </div>
        </div>
        <button class="recharge-btn" onclick="rechargeCard('${card.serial}', ${card.units}, '${type}')">
            ${type === 'manual' ? 'شحن الكارت' : 'شحن من الهاتف'}
        </button>
    `;
    
    return div;
}

// العودة لطرق الشحن
function showMethods() {
    document.getElementById('manualSection').style.display = 'none';
    document.getElementById('directSection').style.display = 'none';
    document.getElementById('manualMethod').style.display = 'flex';
    document.getElementById('directMethod').style.display = 'flex';
}

// شحن الكارت
async function rechargeCard(serial, units, type) {
    if (type === 'manual') {
        // نسخ الكود للحافظة
        const cardCode = `*858*${serial}#`;
        
        try {
            await navigator.clipboard.writeText(cardCode);
            showToast('تم نسخ كود الشحن! استخدمه من هاتفك', 'success');
        } catch (err) {
            showToast('اضغط على الكود لنسخه', 'info');
        }
    } else {
        // شحن مباشر من الموقع
        showToast('جاري شحن الكارت...', 'info');
        
        try {
            // هنا هنستخدم API الشحن الحقيقي
            // حالياً مجرد محاكاة
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showToast(`تم شحن ${units} وحدة بنجاح!`, 'success');
            
            // تحديث البطاقة
            const cardIndex = cardsData.findIndex(c => c.serial === serial);
            if (cardIndex !== -1) {
                cardsData[cardIndex].remaining -= 1;
                if (cardsData[cardIndex].remaining <= 0) {
                    cardsData.splice(cardIndex, 1);
                }
            }
            
            // تحديث العرض
            showDirectCards();
            document.getElementById('activatedCount').textContent = 
                cardsData.filter(card => card.remaining > 0).length;
            document.getElementById('totalCards').textContent = cardsData.length;
            
        } catch (error) {
            showToast('فشل الشحن: ' + error.message, 'error');
        }
    }
}

// إظهار/إخفاء التحميل
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

// إظهار رسالة
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// إضافة مستمعي الأحداث لطرق الشحن
document.addEventListener('DOMContentLoaded', function() {
    const manualMethod = document.getElementById('manualMethod');
    const directMethod = document.getElementById('directMethod');
    
    if (manualMethod) {
        manualMethod.addEventListener('click', showManualCards);
    }
    
    if (directMethod) {
        directMethod.addEventListener('click', showDirectCards);
    }
});

// تسجيل الخروج
function logout() {
    localStorage.removeItem('vodafoneUser');
    window.location.href = 'index.html';
}
