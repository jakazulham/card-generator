const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('blog_token');
}

async function request(path, options = {}) {
  const { auth = false, ...fetchOptions } = options;
  const headers = { ...fetchOptions.headers };

  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Don't set content-type for FormData (browser sets it with boundary)
  if (!(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 && auth) {
      localStorage.removeItem('blog_token');
      localStorage.removeItem('blog_user');
      // Only redirect if we're on an admin page
      if (window.location.pathname.startsWith('/jaka') && !window.location.pathname.includes('/login')) {
        window.location.href = '/jaka/login';
      }
    }
    throw new Error(data.error || 'Terjadi kesalahan.');
  }

  return data;
}

const api = {
  get(path, auth = false) {
    return request(path, { method: 'GET', auth });
  },

  post(path, body, auth = false) {
    return request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      auth,
    });
  },

  put(path, body, auth = false) {
    return request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
      auth,
    });
  },

  delete(path, auth = false) {
    return request(path, { method: 'DELETE', auth });
  },

  upload(file) {
    const formData = new FormData();
    formData.append('image', file);
    return request('/upload', {
      method: 'POST',
      body: formData,
      auth: true,
    });
  },
};

export default api;
