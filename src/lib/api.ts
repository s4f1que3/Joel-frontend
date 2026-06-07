const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "Request failed");
    throw new Error(text || "Request failed");
  }
  return res.json().catch(() => null);
}

export const articlesAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/articles`).then(handle),

  getBySlug: (slug: string) =>
    fetch(`${BASE_URL}/articles/${slug}`).then(handle),

  getPinned: () =>
    fetch(`${BASE_URL}/articles/pinned`).then(handle),

  create: (formData: FormData) =>
    fetch(`${BASE_URL}/articles/create`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    }).then(handle),

  update: (id: string, formData: FormData) =>
    fetch(`${BASE_URL}/articles/update/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: formData,
    }).then(handle),

  delete: (id: string) =>
    fetch(`${BASE_URL}/articles/delete/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handle),

  pin: (id: string) =>
    fetch(`${BASE_URL}/articles/pin/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
    }).then(handle),

  unpin: (id: string) =>
    fetch(`${BASE_URL}/articles/unpin/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
    }).then(handle),
};

export const bioAPI = {
  get: () =>
    fetch(`${BASE_URL}/bio`).then(handle),

  create: (data: { title: string; content: string }) =>
    fetch(`${BASE_URL}/bio/create`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),

  update: (id: string, data: { title: string; content: string }) =>
    fetch(`${BASE_URL}/bio/update/${id}`, {
      method: "PATCH",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),

  delete: (id: string) =>
    fetch(`${BASE_URL}/bio/delete/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handle),
};

export const contactAPI = {
  get: () =>
    fetch(`${BASE_URL}/contact`).then(handle),

  create: (data: { phone: string; email: string; instagram: string; linkedin: string }) =>
    fetch(`${BASE_URL}/contact/create`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),

  update: (data: { new_phone?: string; new_email?: string; new_instagram?: string; new_linkedin?: string }) =>
    fetch(`${BASE_URL}/contact`, {
      method: "PATCH",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),

  deleteField: (option: string) =>
    fetch(`${BASE_URL}/contact/fields?option=${option}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handle),

  delete: () =>
    fetch(`${BASE_URL}/contact`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handle),
};

export const authAPI = {
  signIn: (email: string, password: string) =>
    fetch(`${BASE_URL}/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(handle),

  signOut: () =>
    fetch(`${BASE_URL}/auth/sign-out`, {
      method: "POST",
      headers: authHeaders(),
    }).then(handle),

  sendOtp: (email: string, password: string) =>
    fetch(`${BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(handle),

  verifyOtp: (email: string, token: string) =>
    fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    }).then(handle),

  changeEmail: (data: { email: string; token: string; new_email: string }) =>
    fetch(`${BASE_URL}/auth/change-email`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),

  changePassword: (data: { email: string; token: string; password: string; new_password: string }) =>
    fetch(`${BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),
};
