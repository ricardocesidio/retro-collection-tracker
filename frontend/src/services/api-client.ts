const API_URL = '';

interface RequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function apiRequest<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    // Handle 401 — token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}

async function uploadFile(path: string, file: File): Promise<{ url: string }> {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Upload failed with status ${response.status}`);
    }

    return data as { url: string };
  } catch (error: any) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}

export { apiRequest, uploadFile };
export type { RequestOptions };
