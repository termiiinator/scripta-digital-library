async function fetchAPI(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    });

    if (!response.ok) {
        throw new Error("API error");
    }

    return await response.json();
}
