/**
 * Active Menu Module
 * يحدد الرابط النشط في القائمة بناءً على الرابط الحالي
 */
export function initActiveMenu() {
  const currentPath = window.location.pathname.replace(/\/$/, "").toLowerCase();
  const menuLinks = document.querySelectorAll(".main-menu a, .nft-mobile-menu a");

  menuLinks.forEach(link => {
    const linkPath = link.getAttribute("href");
    if (!linkPath || linkPath.startsWith("javascript") || linkPath === "#") return;

    // تطبيع الرابط للمقارنة (حذف الدومين والسلاش الأخير)
    const normalizedLink = linkPath.replace(window.location.origin, "").replace(/\/$/, "").toLowerCase();

    // التحقق من التطابق التام أو إذا كانت صفحة فرعية
    if (normalizedLink === currentPath || (currentPath.includes('/services/') && normalizedLink.includes('/services/'))) {
      link.classList.add("active");
      
      // تفعيل العنصر الأب (li)
      const parentLi = link.closest("li");
      if (parentLi) parentLi.classList.add("active");

      // تفعيل القائمة المنسدلة الأب
      const parentMenu = link.closest(".submenu, .submenu-wrapper, .has-mega-menu");
      if (parentMenu) {
        const parentItem = parentMenu.closest("li");
        if (parentItem) parentItem.classList.add("active");
      }
    }
  });
  
  console.log("✅ Active Menu Initialized");
}