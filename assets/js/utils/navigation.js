/**
 * navigation.js
 * Handles Next/Prev buttons logic
 */

export function renderNavigation(currentItem, allItems) {
    const currentIndex = allItems.findIndex(i => String(i.id) === String(currentItem.id));
    const prevItem = allItems[currentIndex - 1];
    const nextItem = allItems[currentIndex + 1];

    updateBtn('nav-prev', prevItem);
    updateBtn('nav-next', nextItem);
}

function updateBtn(idPrefix, targetItem) {
    const link = document.getElementById(`${idPrefix}-link`);
    const title = document.getElementById(`${idPrefix}-title`);
    
    if (link) {
        if (targetItem) {
            link.href = `?id=${targetItem.id}`;
            link.style.display = 'flex';
            if (title) title.textContent = targetItem.title;
        } else {
            link.style.display = 'none';
        }
    }
}