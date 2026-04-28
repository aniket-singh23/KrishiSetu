(function initBackendBridge(windowObj) {
    const AUTH_API_BASE = windowObj.AUTH_API_BASE || 'http://localhost:3001/api';

    function getToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null;
    }

    function setSession(token, user, remember) {
        const tokenStorage = remember ? localStorage : sessionStorage;
        tokenStorage.setItem('authToken', token);
        tokenStorage.setItem('authRole', user?.role || 'user');

        if (user?.name) localStorage.setItem('userName', user.name);
        if (Number.isFinite(user?.level)) localStorage.setItem('userLevel', String(user.level));
        if (Number.isFinite(user?.xp)) localStorage.setItem('userXP', String(user.xp));
        if (Number.isFinite(user?.coins)) localStorage.setItem('greenCoins', String(user.coins));

        if (user?.gameStats) {
            const stats = user.gameStats;
            if (Number.isFinite(stats.gamesPlayed)) localStorage.setItem('gamesPlayed', String(stats.gamesPlayed));
            if (Number.isFinite(stats.totalScore)) localStorage.setItem('totalGameScore', String(Math.round(stats.totalScore)));
            if (Number.isFinite(stats.winStreak)) localStorage.setItem('winStreak', String(stats.winStreak));
            if (Number.isFinite(stats.gameAccuracy)) localStorage.setItem('gameAccuracy', String(Math.round(stats.gameAccuracy)));
            if (Number.isFinite(stats.virtualFarmeryScore)) localStorage.setItem('virtualFarmeryScore', String(Math.round(stats.virtualFarmeryScore)));
            if (Number.isFinite(stats.pickOddOutScore)) localStorage.setItem('pickOddOutScore', String(Math.round(stats.pickOddOutScore)));
        }
    }

    function clearSession() {
        ['authToken', 'authRole'].forEach((key) => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
    }

    async function request(path, options) {
        const headers = { ...(options?.headers || {}) };
        const token = getToken();

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${AUTH_API_BASE}${path}`, {
            ...options,
            headers
        });

        let data = {};
        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (!response.ok) {
            const error = new Error(data.message || 'Request failed');
            error.status = response.status;
            throw error;
        }

        return data;
    }

    async function fetchCurrentUser() {
        return request('/me', { method: 'GET' });
    }

    async function saveGameResult(payload) {
        return request('/stats/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload || {})
        });
    }

    async function syncCurrentUserToStorage() {
        try {
            const result = await fetchCurrentUser();
            if (result?.user) {
                setSession(getToken(), result.user, true);
            }
            return result?.user || null;
        } catch {
            return null;
        }
    }

    function guardRoute(config) {
        const requiresAuth = Boolean(config?.requiresAuth);
        const requiredRole = config?.role || null;

        const token = getToken();
        if (requiresAuth && !token) {
            windowObj.location.href = config?.redirectTo || 'auth.html';
            return false;
        }

        if (requiredRole) {
            const role = localStorage.getItem('authRole') || sessionStorage.getItem('authRole') || 'user';
            if (role !== requiredRole) {
                windowObj.location.href = config?.redirectTo || 'dashboard.html';
                return false;
            }
        }

        return true;
    }

    function autoGuardFromBodyAttributes() {
        const body = document.body;
        if (!body) return;

        const requiresAuth = body.dataset.requiresAuth === 'true';
        const role = body.dataset.authRole || null;
        if (requiresAuth || role) {
            guardRoute({ requiresAuth, role, redirectTo: body.dataset.authRedirect || 'auth.html' });
        }
    }

    document.addEventListener('DOMContentLoaded', autoGuardFromBodyAttributes);

    windowObj.backendBridge = {
        apiBaseUrl: AUTH_API_BASE,
        getToken,
        setSession,
        clearSession,
        request,
        fetchCurrentUser,
        saveGameResult,
        syncCurrentUserToStorage,
        guardRoute
    };
})(window);
