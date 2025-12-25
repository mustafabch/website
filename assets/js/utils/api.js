/**
 * api.js
 * Handles data fetching with Cache Busting and Path Retries.
 */

export async function fetchData(filename) {
    const ts = new Date().getTime();
    // Try multiple paths in case we are in a sub-folder
    const pathsToTry = [
        `/data/${filename}?v=${ts}`,
        `../../data/${filename}?v=${ts}`, 
        `../../../data/${filename}?v=${ts}`
    ];

    for (const p of pathsToTry) {
        try {
            const res = await fetch(p);
            const contentType = res.headers.get("content-type");
            
            // Ensure it's JSON and not an HTML error page
            if (res.ok && contentType && contentType.includes("application/json")) {
                return await res.json();
            } else if (res.ok) {
                // Fallback attempt
                try { return await res.clone().json(); } catch(e){}
            }
        } catch (e) { /* Continue to next path */ }
    }
    
    console.error(`❌ API Error: Could not load ${filename}`);
    return null;
}

export async function getItemById(filename, id) {
    const data = await fetchData(filename);
    if (!data) return null;
    
    // Loose comparison for string/number IDs
    const item = data.find(i => String(i.id) === String(id));
    return { item, allItems: data };
}