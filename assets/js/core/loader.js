/**
 * ComponentLoader Class
 * المسؤول عن جلب ملفات HTML الخارجية وحقنها في الصفحة
 * مع ضمان تنفيذ السكربتات الموجودة داخلها.
 */
export class ComponentLoader {
    constructor() {
        // البحث عن جميع العناصر التي تنتظر الحقن
        this.components = document.querySelectorAll("[data-component]");
    }

    async loadAll() {
        // إذا لم توجد مكونات، نطلق الحدث فوراً ونخرج
        if (this.components.length === 0) {
            window.dispatchEvent(new Event('components:loaded'));
            return Promise.resolve();
        }

        const loadPromises = Array.from(this.components).map(async (el) => {
            const componentPath = el.getAttribute("data-component");
            try {
                const response = await fetch(componentPath);
                if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
                
                const html = await response.text();
                
                // 1. حقن محتوى HTML
                el.innerHTML = html;
                el.setAttribute("data-loaded", "true"); // علامة اكتمال
                
                // 2. تفعيل السكربتات الموجودة داخل المكون (مهم جداً)
                // المتصفح لا ينفذ <script> المحقونة بـ innerHTML تلقائياً
                this.executeScripts(el);

            } catch (error) {
                console.error(`❌ Error loading component: ${componentPath}`, error);
                // إخفاء العنصر في حال الفشل لتجنب الفراغات المشوهة
                el.style.display = 'none'; 
            }
        });

        // انتظار تحميل جميع الملفات (Parallel Loading)
        await Promise.all(loadPromises);
        
        console.log("✅ All Components Loaded & Injected");
        
        // 3. إطلاق حدث "جاهز" ليستمع له النظام (app.js)
        window.dispatchEvent(new Event('components:loaded'));
    }

    /**
     * دالة مساعدة لإعادة بناء وتشغيل وسوم السكربت
     */
    executeScripts(element) {
        const scripts = element.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            
            // نسخ جميع الخصائص (src, type, async, defer...)
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            // نسخ الكود الداخلي (Inline Script)
            if (oldScript.innerHTML) {
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            }
            
            // استبدال القديم بالجديد ليقوم المتصفح بتنفيذه
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
}