// Claude Artifacts icinde hazir gelen window.storage API'sinin
// gercek bir web sitesinde calisan, tarayici localStorage tabanli
// karsiligi. Ayni get/set/delete/list arayuzunu taklit eder, boylece
// App.jsx icindeki kod hic degismeden calisir.
//
// ONEMLI SINIRLAMA: localStorage yalnizca ziyaretcinin KENDI
// tarayicisinda saklanir. Yani "Yeni Yazi" ile eklenen bir haberi
// SADECE onu ekleyen kisi kendi tarayicisinda gorur, baska
// ziyaretciler gormez. Herkesin ayni haberleri/dersleri gormesi
// icin gercek bir arka uc (ornegin Supabase) gerekir - bkz. README.

function nsKey(key, shared) {
  return `kpss:${shared ? "shared" : "me"}:${key}`;
}

window.storage = {
  async get(key, shared = false) {
    const raw = window.localStorage.getItem(nsKey(key, shared));
    if (raw === null) {
      throw new Error(`storage key not found: ${key}`);
    }
    return { key, value: raw, shared };
  },

  async set(key, value, shared = false) {
    window.localStorage.setItem(nsKey(key, shared), value);
    return { key, value, shared };
  },

  async delete(key, shared = false) {
    window.localStorage.removeItem(nsKey(key, shared));
    return { key, deleted: true, shared };
  },

  async list(prefix = "", shared = false) {
    const ns = `kpss:${shared ? "shared" : "me"}:`;
    const keys = Object.keys(window.localStorage)
      .filter((k) => k.startsWith(ns + prefix))
      .map((k) => k.slice(ns.length));
    return { keys, prefix, shared };
  },
};
