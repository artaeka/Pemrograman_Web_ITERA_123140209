'use strict';

/* ==========================================================================
   Campus Hub — Dashboard Tugas Mahasiswa
   Praktikum JavaScript ES6+
   ========================================================================== */

// ---------- Konstanta (const) ----------
const STORAGE_KEY = 'campus-hub:tasks:v1';

const API = {
  weather: 'https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true',
  quote: 'https://dummyjson.com/quotes/random',
  todos: 'https://jsonplaceholder.typicode.com/todos?_limit=5',
};

const WEATHER_CODES = {
  0: ['☀️', 'Cerah'],
  1: ['🌤️', 'Cerah berawan'],
  2: ['⛅', 'Berawan sebagian'],
  3: ['☁️', 'Berawan'],
  45: ['🌫️', 'Berkabut'],
  48: ['🌫️', 'Kabut beku'],
  51: ['🌦️', 'Gerimis ringan'],
  53: ['🌦️', 'Gerimis'],
  55: ['🌧️', 'Gerimis lebat'],
  61: ['🌧️', 'Hujan ringan'],
  63: ['🌧️', 'Hujan sedang'],
  65: ['🌧️', 'Hujan lebat'],
  80: ['🌦️', 'Hujan lokal'],
  81: ['🌧️', 'Hujan lokal sedang'],
  82: ['⛈️', 'Hujan lokal deras'],
  95: ['⛈️', 'Badai petir'],
  96: ['⛈️', 'Petir & hujan es'],
  99: ['⛈️', 'Petir & hujan es lebat'],
};

const PRIORITY_ORDER = { tinggi: 0, sedang: 1, rendah: 2 };

// ---------- Fungsi bantu (arrow functions) ----------
const escapeHTML = (value = '') =>
  String(value).replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));

const toDate = (iso) => new Date(`${iso}T00:00:00`);

const formatDate = (iso) =>
  toDate(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const generateId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const toISODate = (date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

/* ==========================================================================
   class TaskItem — model data satu tugas
   ========================================================================== */
class TaskItem {
  constructor({
    id = generateId(),
    title,
    course = '',
    deadline = '',
    priority = 'sedang',
    done = false,
    createdAt = Date.now(),
  }) {
    this.id = id;
    this.title = title.trim();
    this.course = course.trim();
    this.deadline = deadline;
    this.priority = priority;
    this.done = done;
    this.createdAt = createdAt;
  }

  /** Selisih hari antara hari ini dan tenggat (null jika tanpa tenggat). */
  get daysLeft() {
    if (!this.deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((toDate(this.deadline) - today) / 86400000);
  }

  get isOverdue() {
    return !this.done && this.daysLeft !== null && this.daysLeft < 0;
  }

  get deadlineLabel() {
    const { daysLeft } = this;
    if (daysLeft === null) return 'Tanpa tenggat';
    if (daysLeft < 0) return `Terlambat ${Math.abs(daysLeft)} hari`;
    if (daysLeft === 0) return 'Hari ini!';
    if (daysLeft === 1) return 'Besok';
    return `${daysLeft} hari lagi`;
  }

  matches(keyword) {
    const text = `${this.title} ${this.course}`.toLowerCase();
    return text.includes(keyword.toLowerCase());
  }

  static fromJSON(obj) {
    return new TaskItem(obj);
  }
}

/* ==========================================================================
   class DashboardApp — state, localStorage, fetch API, dan render
   ========================================================================== */
class DashboardApp {
  constructor() {
    this.state = {
      tasks: [],
      filter: 'all',
      search: '',
      editingId: null,
    };
    this.el = this.#cacheElements();
  }

  #cacheElements() {
    const $ = (selector) => document.querySelector(selector);
    return {
      clock: $('#clock'),
      date: $('#date'),
      greeting: $('#greeting'),
      quoteText: $('#quote-text'),
      quoteAuthor: $('#quote-author'),
      btnQuote: $('#btn-quote'),
      weather: $('#weather'),
      stats: $('#stats'),
      progressBar: $('#progress-bar'),
      progressLabel: $('#progress-label'),
      form: $('#task-form'),
      formTitle: $('#form-title'),
      inputTitle: $('#input-title'),
      inputCourse: $('#input-course'),
      inputDeadline: $('#input-deadline'),
      inputPriority: $('#input-priority'),
      btnSubmit: $('#btn-submit'),
      btnCancel: $('#btn-cancel'),
      search: $('#search'),
      filters: $('#filters'),
      list: $('#task-list'),
      btnClearDone: $('#btn-clear-done'),
      btnReset: $('#btn-reset'),
    };
  }

  // ---------- Inisialisasi ----------
  async init() {
    this.bindEvents();
    this.startClock();
    this.loadFromStorage();
    this.render();

    // Jalankan semua pemanggilan API secara paralel
    const jobs = [this.fetchWeather(), this.fetchQuote()];
    if (this.state.tasks.length === 0 && !localStorage.getItem(STORAGE_KEY)) {
      jobs.push(this.seedTasksFromAPI());
    }
    await Promise.allSettled(jobs);
  }

  // ---------- localStorage ----------
  loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      this.state = { ...this.state, tasks: parsed.map(TaskItem.fromJSON) };
    } catch (error) {
      console.error('Gagal membaca localStorage:', error);
      this.state = { ...this.state, tasks: [] };
    }
  }

  saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.tasks));
  }

  /** Perbarui state secara immutable, simpan, lalu render ulang. */
  setTasks(tasks) {
    this.state = { ...this.state, tasks };
    this.saveToStorage();
    this.render();
  }

  // ---------- CRUD ----------
  addTask({ title, course, deadline, priority }) {
    const task = new TaskItem({ title, course, deadline, priority });
    this.setTasks([task, ...this.state.tasks]);
  }

  updateTask(id, changes) {
    const tasks = this.state.tasks.map((task) =>
      task.id === id ? TaskItem.fromJSON({ ...task, ...changes }) : task
    );
    this.setTasks(tasks);
  }

  deleteTask(id) {
    this.setTasks(this.state.tasks.filter((task) => task.id !== id));
  }

  toggleTask(id) {
    const target = this.state.tasks.find((task) => task.id === id);
    if (target) this.updateTask(id, { done: !target.done });
  }

  clearDone() {
    this.setTasks(this.state.tasks.filter(({ done }) => !done));
  }

  // ---------- Fetch API (async/await) ----------
  async fetchWeather() {
    const { weather } = this.el;
    try {
      const response = await fetch(API.weather);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { current_weather: { temperature, windspeed, weathercode } } = await response.json();
      const [icon, label] = WEATHER_CODES[weathercode] ?? ['🌡️', 'Tidak diketahui'];
      weather.innerHTML = `
        <div class="weather__icon">${icon}</div>
        <div>
          <div class="weather__temp">${temperature}°C</div>
          <div>${label}</div>
          <div class="weather__meta">Angin ${windspeed} km/j · Lampung Selatan</div>
        </div>`;
    } catch (error) {
      weather.textContent = 'Cuaca tidak dapat dimuat (periksa koneksi internet).';
      console.error('fetchWeather:', error);
    }
  }

  async fetchQuote() {
    const { quoteText, quoteAuthor } = this.el;
    try {
      const response = await fetch(API.quote);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { quote, author } = await response.json();
      quoteText.textContent = `“${quote}”`;
      quoteAuthor.textContent = `— ${author}`;
    } catch (error) {
      quoteText.textContent = '“Sedikit progres setiap hari menghasilkan hasil yang besar.”';
      quoteAuthor.textContent = '— (kutipan offline)';
      console.error('fetchQuote:', error);
    }
  }

  /** Inisialisasi daftar tugas contoh dari JSONPlaceholder (hanya saat pertama kali). */
  async seedTasksFromAPI() {
    try {
      const response = await fetch(API.todos);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const todos = await response.json();
      const priorities = ['tinggi', 'sedang', 'rendah'];
      const tasks = todos.map(({ title, completed }, index) => {
        const due = new Date();
        due.setDate(due.getDate() + index + 1);
        return new TaskItem({
          title: title.charAt(0).toUpperCase() + title.slice(1),
          course: 'Contoh (API)',
          deadline: toISODate(due),
          priority: priorities[index % priorities.length],
          done: completed,
        });
      });
      this.setTasks(tasks);
    } catch (error) {
      console.error('seedTasksFromAPI:', error);
    }
  }

  async resetSampleData() {
    if (!confirm('Semua tugas akan diganti dengan data contoh dari API. Lanjutkan?')) return;
    this.setTasks([]);
    await this.seedTasksFromAPI();
  }

  // ---------- Jam & sapaan ----------
  startClock() {
    const tick = () => {
      const now = new Date();
      this.el.clock.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
      this.el.date.textContent = now.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
      const hour = now.getHours();
      const sapaan = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam';
      this.el.greeting.textContent = `${sapaan}, semangat kuliahnya! 🎓`;
    };
    tick();
    setInterval(tick, 1000);
  }

  // ---------- Event ----------
  bindEvents() {
    const { form, btnCancel, btnQuote, btnClearDone, btnReset, search, filters, list } = this.el;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (!data.title.trim()) return;

      if (this.state.editingId) {
        this.updateTask(this.state.editingId, data);
      } else {
        this.addTask(data);
      }
      this.resetForm();
    });

    btnCancel.addEventListener('click', () => this.resetForm());
    btnQuote.addEventListener('click', () => this.fetchQuote());
    btnClearDone.addEventListener('click', () => this.clearDone());
    btnReset.addEventListener('click', () => this.resetSampleData());

    search.addEventListener('input', ({ target }) => {
      this.state = { ...this.state, search: target.value };
      this.renderList();
    });

    filters.addEventListener('click', ({ target }) => {
      const chip = target.closest('[data-filter]');
      if (!chip) return;
      this.state = { ...this.state, filter: chip.dataset.filter };
      filters.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
      this.renderList();
    });

    // Event delegation untuk checkbox / edit / hapus
    list.addEventListener('click', ({ target }) => {
      const item = target.closest('[data-id]');
      const action = target.closest('[data-action]')?.dataset.action;
      if (!item || !action) return;
      const { id } = item.dataset;

      if (action === 'toggle') this.toggleTask(id);
      if (action === 'edit') this.startEdit(id);
      if (action === 'delete') this.deleteTask(id);
    });
  }

  startEdit(id) {
    const task = this.state.tasks.find((t) => t.id === id);
    if (!task) return;
    const { inputTitle, inputCourse, inputDeadline, inputPriority } = this.el;
    this.state = { ...this.state, editingId: id };
    inputTitle.value = task.title;
    inputCourse.value = task.course;
    inputDeadline.value = task.deadline;
    inputPriority.value = task.priority;
    this.el.formTitle.textContent = 'Edit Tugas';
    this.el.btnSubmit.textContent = '💾 Simpan Perubahan';
    this.el.btnCancel.hidden = false;
    inputTitle.focus();
    this.el.form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  resetForm() {
    this.state = { ...this.state, editingId: null };
    this.el.form.reset();
    this.el.formTitle.textContent = 'Tambah Tugas Baru';
    this.el.btnSubmit.textContent = '➕ Tambah';
    this.el.btnCancel.hidden = true;
  }

  // ---------- Render (template literals) ----------
  get visibleTasks() {
    const { tasks, filter, search } = this.state;
    return tasks
      .filter(({ done }) => filter === 'all' || (filter === 'done' ? done : !done))
      .filter((task) => !search || task.matches(search))
      .sort((a, b) =>
        Number(a.done) - Number(b.done) ||
        (a.deadline || '9999').localeCompare(b.deadline || '9999') ||
        PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      );
  }

  renderTask(task) {
    const { id, title, course, deadline, priority, done, isOverdue, daysLeft, deadlineLabel } = task;
    const badgeClass = isOverdue ? 'badge--late' : (!done && daysLeft !== null && daysLeft <= 2 ? 'badge--soon' : '');
    return `
      <li class="task task--${priority} ${done ? 'task--done' : ''}" data-id="${id}">
        <input class="task__check" type="checkbox" data-action="toggle" ${done ? 'checked' : ''} aria-label="Tandai selesai">
        <div class="task__body">
          <div class="task__title">${escapeHTML(title)}</div>
          <div class="task__meta">
            ${course ? `<span>📚 ${escapeHTML(course)}</span>` : ''}
            ${deadline ? `<span>📅 ${formatDate(deadline)}</span>` : ''}
            <span class="badge ${badgeClass}">${deadlineLabel}</span>
            <span>Prioritas ${priority}</span>
          </div>
        </div>
        <div class="task__actions">
          <button class="icon-btn" data-action="edit" title="Edit" type="button">✏️</button>
          <button class="icon-btn" data-action="delete" title="Hapus" type="button">🗑️</button>
        </div>
      </li>`;
  }

  renderList() {
    const tasks = this.visibleTasks;
    this.el.list.innerHTML = tasks.length
      ? tasks.map((task) => this.renderTask(task)).join('')
      : '<li class="empty">Belum ada tugas di sini. Saatnya santai… atau tambah tugas baru 😄</li>';
  }

  renderStats() {
    const { tasks } = this.state;
    const total = tasks.length;
    const done = tasks.filter(({ done: d }) => d).length;
    const late = tasks.filter(({ isOverdue }) => isOverdue).length;
    let percent = 0; // let: nilai berubah sesuai kondisi
    if (total > 0) percent = Math.round((done / total) * 100);

    this.el.stats.innerHTML = `
      <div class="stat"><strong>${total}</strong><span>Total</span></div>
      <div class="stat stat--done"><strong>${done}</strong><span>Selesai</span></div>
      <div class="stat stat--late"><strong>${late}</strong><span>Terlambat</span></div>`;
    this.el.progressBar.style.width = `${percent}%`;
    this.el.progressBar.parentElement.setAttribute('aria-valuenow', percent);
    this.el.progressLabel.textContent = total
      ? `${percent}% tugas selesai (${done} dari ${total})`
      : 'Belum ada tugas.';
  }

  render() {
    this.renderStats();
    this.renderList();
  }
}

// ---------- Jalankan aplikasi ----------
const app = new DashboardApp();
app.init();
