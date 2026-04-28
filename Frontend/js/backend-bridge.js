(function initBackendBridge(windowObj) {
    const AUTH_API_BASE = windowObj.AUTH_API_BASE || 'http://localhost:3001/api';

    function getToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null;
    }

    function setSession(token, user, remember) {
        const tokenStorage = remember ? localStorage : sessionStorage;
        tokenStorage.setItem('authToken', token);
        tokenStorage.setItem('authRole', user?.role || 'user');

        // Fix: Only store user data in the same storage as token
        if (user?.name) tokenStorage.setItem('userName', user.name);
        if (Number.isFinite(user?.level)) tokenStorage.setItem('userLevel', String(user.level));
        if (Number.isFinite(user?.xp)) tokenStorage.setItem('userXP', String(user.xp));
        if (Number.isFinite(user?.coins)) tokenStorage.setItem('greenCoins', String(user.coins));

        if (user?.gameStats) {
            const stats = user.gameStats;
            if (Number.isFinite(stats.gamesPlayed)) tokenStorage.setItem('gamesPlayed', String(stats.gamesPlayed));
            if (Number.isFinite(stats.totalScore)) tokenStorage.setItem('totalGameScore', String(Math.round(stats.totalScore)));
            if (Number.isFinite(stats.winStreak)) tokenStorage.setItem('winStreak', String(stats.winStreak));
            if (Number.isFinite(stats.gameAccuracy)) tokenStorage.setItem('gameAccuracy', String(Math.round(stats.gameAccuracy)));
            if (Number.isFinite(stats.virtualFarmeryScore)) tokenStorage.setItem('virtualFarmeryScore', String(Math.round(stats.virtualFarmeryScore)));
            if (Number.isFinite(stats.pickOddOutScore)) tokenStorage.setItem('pickOddOutScore', String(Math.round(stats.pickOddOutScore)));
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

        // Add request timeout (30 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            const response = await fetch(`${AUTH_API_BASE}${path}`, {
                ...options,
                headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

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
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - server not responding');
            }
            throw error;
        }
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
            // Prevent page rendering before redirect
            document.body.style.visibility = 'hidden';
            setTimeout(() => {
                windowObj.location.href = config?.redirectTo || 'auth.html';
            }, 100);
            return false;
        }

        if (requiredRole) {
            const role = localStorage.getItem('authRole') || sessionStorage.getItem('authRole') || 'user';
            if (role !== requiredRole) {
                document.body.style.visibility = 'hidden';
                setTimeout(() => {
                    windowObj.location.href = config?.redirectTo || 'auth.html';
                }, 100);
                return false;
            }
        }

        document.body.style.visibility = 'visible';
        return true;
    }
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
