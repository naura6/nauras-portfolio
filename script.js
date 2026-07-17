// --- MOCK DATA ARTIKEL ---
// Kamu bisa menambah atau mengganti teks di bawah ini sesuai portofoliomu
const articlesData = [
    {
        id: 1,
        title: "Dengan Clarity, Emang Semua Makin Terarah?",
        excerpt: "Kejelasan > Tujuan > Upaya terarah > Sampai ke tujuan, ternyata nggak sesederhana bikin tugas mind mapping di sekolah",
        content: `
            <p>Perkembangan Artificial Intelligence (AI) belakangan ini telah mencapai level yang mencengangkan. Dari menghasilkan gambar estetik hingga menyusun esai yang koheren, AI membuktikan dirinya mampu meniru proses kreatif manusia.</p>
            <p>Bagi banyak pekerja kreatif, fenomena ini mendatangkan kecemasan. Muncul pertanyaan fundamental: Apakah orisinalitas manusia masih memiliki nilai jika mesin dapat memproduksi karya yang mirip dalam hitungan detik?</p>
            <p>Namun, jika kita melihat dari sudut pandang sejarah teknologi, setiap disrupsi selalu membawa ruang kolaborasi baru. AI tidak memiliki emosi, pengalaman hidup, maupun kesadaran eksistensial—tiga pilar utama yang membentuk karya seni yang mendalam. Oleh karena itu, masa depan industri kreatif bukan tentang persaingan antara manusia melawan mesin, melainkan integrasi harmonis di mana AI bertindak sebagai katalisator ide mentah, dan manusia sebagai kurator rasa.</p>
        `,
        category: "Opini",
        date: "14 Jul 2026",
        readTime: "3 min read"
    },
    {
        id: 2,
        title: "Aku Butuh Menjadi Sensitif",
        excerpt: "'Sensitif banget sih jadi cewek!', ucapnya. Lalu, kalau iya, memang kenapa?",
        content: `
            <p>Kita hidup di era di mana kecepatan dipuja. Makanan instan, koneksi internet kilat, hingga kesuksesan yang diharapkan datang dalam semalam. Tanpa sadar, kita terus berlari mengejar sesuatu yang abstrak, hingga lupa menikmati momen saat ini.</p>
            <p>Filosofi <i>Slow Living</i> hadir bukan sebagai ajakan untuk menjadi malas, melainkan sebuah kesadaran untuk melakukan segala sesuatu dengan kualitas, bukan sekadar kecepatan. Ini adalah tentang menghadirkan perhatian penuh (mindfulness) pada setiap aktivitas kita.</p>
            <p>Ketika kita memutuskan untuk melambat—menikmati setiap tegukan kopi di pagi hari, mendengarkan cerita teman tanpa sibuk melihat layar ponsel—kita sebenarnya sedang merebut kembali kendali atas hidup kita sendiri dari hiruk-pikuk modernitas.</p>
        `,
        category: "Reflektif",
        date: "10 Jul 2026",
        readTime: "4 min read"
    },
    {
        id: 3,
        title: "Poll-Up: Inovasi Mobile Application sebagai Intervensi Kuratif dalam Menangani Political Anxiety melalui Pendekatan Cognitive Mobilization bagi Kesejahteraan Psikologis Generasi Muda",
        excerpt: "Political anxiety mulai ramai akhir-akhir ini karena kondisi sosial-politik di Indonesia. Lalu, apa yang bisa dilakukan?",
        content: `
            <p>Menjadi freelancer memberikan kebebasan waktu yang luar biasa, namun ia datang dengan satu tantangan besar: pendapatan yang fluktuatif. Bulan ini Anda bisa panen besar, bulan berikutnya bisa jadi kering kerontang.</p>
            <p>Kunci utama bertahan di industri ini adalah manajemen arus kas yang ketat. Aturan pertama yang wajib dilakukan adalah memisahkan rekening pribadi dengan rekening bisnis/kerjaan. Jangan pernah mencampurnya.</p>
            <p>Kedua, bangun dana darurat yang lebih besar daripada pekerja kantoran. Jika pekerja tetap butuh 3-6 bulan pengeluaran, seorang freelancer idealnya memiliki 6-12 bulan dana darurat untuk mengantisipasi masa-masa sepi proyek.</p>
        `,
        category: "Ilmiah",
        date: "02 Jun 2026",
        readTime: "5 min read"
    }
];

// --- STATE MANAGEMENT ---
let currentCategory = "all";
let searchQuery = "";
let showBookmarksOnly = false;
let bookmarkedIds = JSON.parse(localStorage.getItem("bookmarks")) || [];

// --- DOM ELEMENTS ---
const articlesGrid = document.getElementById("articles-grid");
const searchInput = document.getElementById("search-input");
const categoriesContainer = document.getElementById("categories-container");
const themeToggle = document.getElementById("theme-toggle");
const bookmarkFilterBtn = document.getElementById("bookmark-filter-btn");
const bookmarkCount = document.getElementById("bookmark-count");
const bookmarkStatusBar = document.getElementById("bookmark-status-bar");
const clearBookmarkFilter = document.getElementById("clear-bookmark-filter");

// Modal Elements
const modal = document.getElementById("article-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const modalTitle = document.getElementById("modal-title");
const modalCategory = document.getElementById("modal-category");
const modalDate = document.getElementById("modal-date");
const modalReadTime = document.getElementById("modal-read-time");
const modalBody = document.getElementById("modal-body");
const modalShareBtn = document.getElementById("modal-share-btn");

// --- FUNCTIONS ---

// 1. Render Artikel ke Grid
function renderArticles() {
    articlesGrid.innerHTML = "";
    
    // Filter data berdasarkan kategori, search pencarian, dan status bookmark
    const filteredArticles = articlesData.filter(article => {
        const matchesCategory = currentCategory === "all" || article.category === currentCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBookmark = !showBookmarksOnly || bookmarkedIds.includes(article.id);
        
        return matchesCategory && matchesSearch && matchesBookmark;
    });

    if (filteredArticles.length === 0) {
        articlesGrid.innerHTML = `<div class="no-results"><p>Tidak ada tulisan yang cocok ditemukan.</p></div>`;
        return;
    }

    filteredArticles.forEach(article => {
        const isBookmarked = bookmarkedIds.includes(article.id);
        const card = document.createElement("article");
        card.classList.add("article-card");
        
        card.innerHTML = `
            <div class="card-content">
                <div class="card-meta">
                    <span class="article-category">${article.category}</span>
                    <span>${article.date}</span>
                </div>
                <h2 onclick="openArticle(${article.id})">${article.title}</h2>
                <p class="card-excerpt">${article.excerpt}</p>
                <div class="card-footer">
                    <span>${article.readTime}</span>
                    <button class="btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark(${article.id})">
                        <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
                    </button>
                </div>
            </div>
        `;
        articlesGrid.appendChild(card);
    });

    updateBookmarkUI();
}

// 2. Fitur Bookmark
function toggleBookmark(id) {
    if (bookmarkedIds.includes(id)) {
        bookmarkedIds = bookmarkedIds.filter(bId => bId !== id);
    } else {
        bookmarkedIds.push(id);
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkedIds));
    renderArticles();
}

function updateBookmarkUI() {
    bookmarkCount.innerText = bookmarkedIds.length;
    if (showBookmarksOnly) {
        bookmarkStatusBar.classList.remove("hidden");
        bookmarkFilterBtn.querySelector("i").classList.replace("far", "fas");
    } else {
        bookmarkStatusBar.classList.add("hidden");
        bookmarkFilterBtn.querySelector("i").classList.replace("fas", "far");
    }
}

// 3. Buka Artikel di Modal
function openArticle(id) {
    const article = articlesData.find(a => a.id === id);
    if (!article) return;

    modalTitle.innerText = article.title;
    modalCategory.innerText = article.category;
    modalDate.innerText = article.date;
    modalReadTime.innerText = article.readTime;
    modalBody.innerHTML = article.content;

    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Disable scroll background

    // Setup Share Button (Web Share API)
    modalShareBtn.onclick = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.excerpt,
                url: window.location.href
            }).catch(console.error);
        } else {
            alert("Tautan berhasil disalin ke clipboard! (Fitur Web Share tidak didukung browser Anda)");
            navigator.clipboard.writeText(window.location.href);
        }
    };
}

// 4. Tutup Modal
function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// 5. Fitur Switch Dark / Light Mode
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    if (theme === "dark") {
        icon.classList.replace("fa-moon", "fa-sun");
    } else {
        icon.classList.replace("fa-sun", "fa-moon");
    }
}

// --- EVENT LISTENERS ---

// Event untuk input pencarian
searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderArticles();
});

// Event untuk memilih kategori
categoriesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("cat-btn")) {
        document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        currentCategory = e.target.getAttribute("data-category");
        renderArticles();
    }
});

// Event klik filter bookmark di navbar
bookmarkFilterBtn.addEventListener("click", () => {
    showBookmarksOnly = !showBookmarksOnly;
    renderArticles();
});

// Reset filter bookmark via status bar
clearBookmarkFilter.addEventListener("click", () => {
    showBookmarksOnly = false;
    renderArticles();
});

// Theme toggle click
themeToggle.addEventListener("click", toggleTheme);

// Modal close clicks
closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

// --- INIT APP ---
initTheme();
renderArticles();
