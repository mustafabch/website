/**
 * helpers.js
 * Utility functions for URL handling and text formatting.
 */

// ✅ Fixes Double IDs (?id=5?id=5)
export function resolveLink(item) {
    if (!item.link) return '#';
    if (item.link.includes('?id=') || item.link.includes('&id=')) {
        return item.link;
    }
    return `${item.link}?id=${item.id}`;
}

export function slugify(text) {
    return text ? text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '') : '';
}

export function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}