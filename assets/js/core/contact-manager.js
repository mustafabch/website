/**
 * Contact Manager (EmailJS Integration)
 * يرسل الرسائل فعلياً عبر خدمة EmailJS
 */
export class ContactManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.feedback = document.getElementById('form-feedback');
        
        // إعدادات EmailJS (ضع بياناتك هنا)
        this.serviceID = "service_0v1ohsk";   // مثال: service_x9s8d7f
        this.templateID = "template_pqicb7g"; // مثال: template_j2k3l4m

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        const inputs = this.form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(input) {
        let isValid = true;
        
        if (input.hasAttribute('required') && !input.value.trim()) isValid = false;
        
        if (input.name === 'user_email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) isValid = false;
        }

        if (input.name === 'user_phone' && input.value) {
            const phoneRegex = /^[+]?[\d\s-]{8,}$/; 
            if (!phoneRegex.test(input.value)) isValid = false;
        }

        if (isValid && input.value.trim() !== '') {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else if (!isValid) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-valid', 'is-invalid');
        }
        
        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // 1. التحقق من صحة البيانات
        const inputs = this.form.querySelectorAll('.form-control');
        let formIsValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) formIsValid = false;
        });

        if (!formIsValid) {
            this.showFeedback('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.', 'error');
            return;
        }

        // 2. بدء الإرسال الفعلي
        this.setLoading(true);

        try {
            // === EmailJS Send ===
            // نمرر الـ ID للخدمة، القالب، وعنصر الفورم نفسه
            const response = await emailjs.sendForm(
                this.serviceID, 
                this.templateID, 
                this.form
            );

            console.log('SUCCESS!', response.status, response.text);
            
            this.showFeedback('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
            
            this.form.reset();
            inputs.forEach(i => i.classList.remove('is-valid'));

        } catch (error) {
            console.error('FAILED...', error);
            this.showFeedback('فشل الإرسال. يرجى التحقق من الاتصال والمحاولة مجدداً.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> جاري الإرسال...';
            this.submitBtn.style.opacity = '0.7';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = 'أرسل الآن <i class="ri-send-plane-fill ms-2"></i>';
            this.submitBtn.style.opacity = '1';
        }
    }

    showFeedback(message, type) {
        if (!this.feedback) return;
        
        this.feedback.textContent = message;
        this.feedback.style.display = 'block';
        this.feedback.className = type === 'success' 
            ? 'alert alert-success text-center' 
            : 'alert alert-danger text-center';

        setTimeout(() => {
            this.feedback.style.display = 'none';
        }, 5000);
    }
}