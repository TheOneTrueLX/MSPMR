// utility functions for API calls

export async function fetchCurrentUser() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/current`, { method: 'GET', credentials: 'include' })
    if(response.status == 401) { 
        return null;
    } else {
        return await response.json();
    }
}

export async function fetchChannelList() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/channels`, { method: 'GET', credentials: 'include' })
    if(response.status == 401) {
        return null;
    } else {
        return await response.json();
    }
}

export async function sessionLogout() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, { method: 'DELETE', credentials: 'include' })
    return;
}

export async function authCallback(postData) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/callback`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    return { status: response.status, message: response.statusText };
}

export async function isAuthenticated() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth`, { method: 'GET', credentials: 'include' })
    if([200, 304].includes(response.status)) {
        return await response.json();
    } else {
        return false;
    }
}