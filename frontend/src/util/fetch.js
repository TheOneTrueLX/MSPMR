// utility functions for API calls

export async function apiGet(path) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, { method: 'GET', credentials: 'include' })
    if([200, 304].includes(response.status)) {
        return await response.json();
    } else {
        return { status: response.status, message: response.message }
    }
}

export async function apiPost(path, payload) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    if([200, 304].includes(response.status)) {
        return await response.json();
    } else {
        return { status: response.status, message: response.message }
    }
}

export async function apiDelete(path) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, { method: 'DELETE', credentials: 'include' })
    return { status: response.status, message: response.message }
}