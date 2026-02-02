// ========================================
// VARIABEL GLOBAL
// ========================================

let currentUser = null;
let currentQuiz = null;
let currentTopic = null;
let selectedClass = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizData = [];
let allUsers = [];
let allComments = [];

const categoryMapping = {
    'matematika': 'math',
    'math': 'math',
    'matematik': 'math',
    'mtk': 'math',
    'english': 'english',
    'inggris': 'english',
    'bahasa inggris': 'english',
    'ing': 'english',
    'indonesian': 'indonesian',
    'indonesia': 'indonesian',
    'bahasa indonesia': 'indonesian',
    'indo': 'indonesian',
    'bid': 'indonesian'
};

// ========================================
// KONFIGURASI DEFAULT UNTUK EDIT PANEL
// ========================================
const defaultConfig = {
    site_title: "Explore the Universe of Knowledge!",
    site_description: "Do the Quiz to exercise your brain with the category available and collect the stars to buy items.",
    daily_challenges_title: "Daily Challenges"
};

// ========================================
// DATABASE TOPIK BERDASARKAN KELAS DAN MATA PELAJARAN
// ========================================
const topicsDatabase = {
    kelas1: {
        math: [
            { id: 'aljabar', name: 'Aljabar Dasar', icon: '🔢', description: 'Persamaan dan pertidaksamaan linear' },
            { id: 'trigonometri', name: 'Trigonometri Dasar', icon: '📐', description: 'Sin, cos, tan dan penerapannya' },
            { id: 'geometri', name: 'Geometri Bidang', icon: '📏', description: 'Bangun datar dan rumus-rumusnya' },
            { id: 'statistika', name: 'Statistika Dasar', icon: '📊', description: 'Mean, median, modus' }
        ],
        english: [
            { id: 'tenses', name: 'Tenses', icon: '⏰', description: 'Simple present, past, future tense' },
            { id: 'vocabulary', name: 'Vocabulary', icon: '📖', description: 'Kosakata dasar bahasa Inggris' },
            { id: 'grammar', name: 'Grammar Basics', icon: '✍️', description: 'Tata bahasa dasar' },
            { id: 'reading', name: 'Reading Comprehension', icon: '📚', description: 'Pemahaman teks sederhana' }
        ],
        indonesian: [
            { id: 'teks_laporan', name: 'Teks Laporan', icon: '📝', description: 'Struktur dan ciri teks laporan' },
            { id: 'teks_deskripsi', name: 'Teks Deskripsi', icon: '🖼️', description: 'Menggambarkan objek dengan detail' },
            { id: 'teks_anekdot', name: 'Teks Anekdot', icon: '😄', description: 'Cerita lucu dan menghibur' },
            { id: 'puisi', name: 'Puisi', icon: '✨', description: 'Unsur-unsur puisi' }
        ]
    },
    kelas2: {
        math: [
            { id: 'limit', name: 'Limit Fungsi', icon: '∞', description: 'Limit fungsi aljabar dan trigonometri' },
            { id: 'turunan', name: 'Turunan', icon: '📈', description: 'Turunan fungsi dan penerapannya' },
            { id: 'integral', name: 'Integral', icon: '∫', description: 'Integral tak tentu dan tertentu' },
            { id: 'matriks', name: 'Matriks', icon: '🔲', description: 'Operasi dan determinan matriks' }
        ],
        english: [
            { id: 'reported_speech', name: 'Reported Speech', icon: '💬', description: 'Kalimat langsung dan tidak langsung' },
            { id: 'passive_voice', name: 'Passive Voice', icon: '🔄', description: 'Kalimat aktif dan pasif' },
            { id: 'conditional', name: 'Conditional Sentences', icon: '❓', description: 'If clauses type 1, 2, 3' },
            { id: 'exposition', name: 'Exposition Text', icon: '📰', description: 'Analytical and hortatory exposition' }
        ],
        indonesian: [
            { id: 'teks_eksposisi', name: 'Teks Eksposisi', icon: '📰', description: 'Menyampaikan informasi dan fakta' },
            { id: 'teks_prosedur', name: 'Teks Prosedur', icon: '📋', description: 'Langkah-langkah melakukan sesuatu' },
            { id: 'hikayat', name: 'Hikayat', icon: '📜', description: 'Cerita lama Melayu' },
            { id: 'debat', name: 'Debat', icon: '🎤', description: 'Argumentasi dan sanggahan' }
        ]
    },
    kelas3: {
        math: [
            { id: 'persamaan_diferensial', name: 'Persamaan Diferensial', icon: '��', description: 'Persamaan diferensial orde satu' },
            { id: 'distribusi_probabilitas', name: 'Distribusi Probabilitas', icon: '🎲', description: 'Normal, binomial, poisson' },
            { id: 'kalkulus_lanjut', name: 'Kalkulus Lanjut', icon: '∑', description: 'Aplikasi integral dan deret' },
            { id: 'vektor', name: 'Vektor', icon: '➡️', description: 'Operasi dan penerapan vektor' }
        ],
        english: [
            { id: 'academic_writing', name: 'Academic Writing', icon: '🎓', description: 'Essay dan paper akademik' },
            { id: 'critical_reading', name: 'Critical Reading', icon: '🔍', description: 'Analisis teks kompleks' },
            { id: 'advanced_grammar', name: 'Advanced Grammar', icon: '📚', description: 'Tata bahasa tingkat lanjut' },
            { id: 'literature', name: 'Literature', icon: '📖', description: 'Analisis karya sastra' }
        ],
        indonesian: [
            { id: 'teks_editorial', name: 'Teks Editorial', icon: '📰', description: 'Opini media massa' },
            { id: 'cerpen', name: 'Cerpen', icon: '📚', description: 'Analisis unsur intrinsik cerpen' },
            { id: 'novel', name: 'Novel', icon: '📕', description: 'Struktur dan unsur novel' },
            { id: 'kritik_sastra', name: 'Kritik Sastra', icon: '🎭', description: 'Mengkritik karya sastra' }
        ]
    }
};

// ========================================
// DATABASE SOAL QUIZ
// ========================================
const quizDatabase = {
    kelas1: {
        math: [
            { question: "Berapa hasil dari 15 + 27?", answers: ["42", "41", "43", "40"], correct: 0 },
            { question: "Berapa hasil dari 8 × 9?", answers: ["71", "72", "73", "74"], correct: 1 },
            { question: "Berapa hasil dari 144 ÷ 12?", answers: ["11", "12", "13", "14"], correct: 1 },
            { question: "Berapa hasil dari 5²?", answers: ["20", "25", "30", "35"], correct: 1 },
            { question: "Berapa hasil dari √36?", answers: ["5", "6", "7", "8"], correct: 1 },
            { question: "Berapa 20% dari 100?", answers: ["15", "20", "25", "30"], correct: 1 },
            { question: "Berapa hasil dari 2³?", answers: ["6", "8", "9", "12"], correct: 1 },
            { question: "Jika x + 3 = 10, berapa nilai x?", answers: ["6", "7", "8", "9"], correct: 1 },
            { question: "Berapa keliling persegi dengan sisi 5 cm?", answers: ["15 cm", "20 cm", "25 cm", "30 cm"], correct: 1 },
            { question: "Berapa luas persegi panjang dengan panjang 8 cm dan lebar 5 cm?", answers: ["35 cm²", "40 cm²", "45 cm²", "50 cm²"], correct: 1 }
        ],
        english: [
            { question: "What is the past tense of 'eat'?", answers: ["eated", "ate", "eaten", "eating"], correct: 1 },
            { question: "Which word means 'big'?", answers: ["small", "large", "thin", "short"], correct: 1 },
            { question: "What is the plural of 'book'?", answers: ["book", "books", "bookes", "bookies"], correct: 1 },
            { question: "Choose the correct sentence:", answers: ["I am student", "I is student", "I are student", "I am a student"], correct: 3 },
            { question: "What does 'happy' mean?", answers: ["sad", "angry", "joyful", "tired"], correct: 2 },
            { question: "Which is correct?", answers: ["He go to school", "He goes to school", "He going to school", "He gone to school"], correct: 1 },
            { question: "What is the opposite of 'hot'?", answers: ["warm", "cool", "cold", "freezing"], correct: 2 },
            { question: "Choose the correct article: '__ apple'", answers: ["a", "an", "the", "no article"], correct: 1 },
            { question: "What is the comparative form of 'tall'?", answers: ["taller", "tallest", "more tall", "most tall"], correct: 0 },
            { question: "Which sentence is in present tense?", answers: ["I played football", "I play football", "I will play football", "I have played football"], correct: 1 }
        ],
        indonesian: [
            { question: "Apa sinonim dari kata 'senang'?", answers: ["sedih", "marah", "gembira", "kecewa"], correct: 2 },
            { question: "Manakah penulisan yang benar?", answers: ["di rumah", "dirumah", "di-rumah", "di_rumah"], correct: 0 },
            { question: "Apa antonim dari kata 'besar'?", answers: ["luas", "tinggi", "kecil", "panjang"], correct: 2 },
            { question: "Kata 'perpustakaan' terdiri dari berapa suku kata?", answers: ["3", "4", "5", "6"], correct: 2 },
            { question: "Manakah kalimat yang benar?", answers: ["Saya pergi kesekolah", "Saya pergi ke sekolah", "Saya pergi ke-sekolah", "Saya pergi ksekolah"], correct: 1 },
            { question: "Apa arti dari kata 'gotong royong'?", answers: ["Bekerja sendiri", "Bekerja sama", "Bermain bersama", "Belajar bersama"], correct: 1 },
            { question: "Huruf kapital digunakan untuk:", answers: ["Awal kalimat", "Tengah kalimat", "Akhir kalimat", "Semua kata"], correct: 0 },
            { question: "Apa fungsi tanda titik (.) dalam kalimat?", answers: ["Memulai kalimat", "Mengakhiri kalimat", "Memisahkan kata", "Menghubungkan kalimat"], correct: 1 },
            { question: "Kata 'membaca' termasuk kata:", answers: ["Benda", "Kerja", "Sifat", "Bilangan"], correct: 1 },
            { question: "Manakah yang merupakan kalimat tanya?", answers: ["Hari ini hujan", "Apakah hari ini hujan?", "Hari ini hujan!", "Semoga tidak hujan"], correct: 1 }
        ]
    },
    kelas2: {
        math: [
            { question: "Berapa hasil dari sin 30°?", answers: ["1/2", "√2/2", "√3/2", "1"], correct: 0 },
            { question: "Berapa hasil dari log₂ 8?", answers: ["2", "3", "4", "8"], correct: 1 },
            { question: "Jika f(x) = 2x + 3, berapa f(5)?", answers: ["11", "12", "13", "14"], correct: 2 },
            { question: "Berapa turunan dari f(x) = x²?", answers: ["x", "2x", "x²", "2x²"], correct: 1 },
            { question: "Berapa hasil dari ∫2x dx?", answers: ["x²", "x² + C", "2x²", "2x² + C"], correct: 1 },
            { question: "Dalam barisan aritmatika, jika a = 3 dan b = 2, berapa suku ke-5?", answers: ["11", "12", "13", "14"], correct: 0 },
            { question: "Berapa hasil dari cos 60°?", answers: ["1/2", "√2/2", "√3/2", "1"], correct: 0 },
            { question: "Jika matriks A = [2 3; 1 4], berapa determinannya?", answers: ["5", "6", "7", "8"], correct: 0 },
            { question: "Berapa hasil dari lim(x→0) sin x/x?", answers: ["0", "1", "∞", "tidak ada"], correct: 1 },
            { question: "Dalam segitiga dengan sisi a=3, b=4, berapa sisi c (segitiga siku-siku)?", answers: ["5", "6", "7", "8"], correct: 0 }
        ],
        english: [
            { question: "Which sentence uses the present perfect tense correctly?", answers: ["I have went to school", "I have gone to school", "I have go to school", "I have going to school"], correct: 1 },
            { question: "What is the passive form of 'She writes a letter'?", answers: ["A letter is written by her", "A letter was written by her", "A letter writes by her", "A letter is writing by her"], correct: 0 },
            { question: "Choose the correct conditional sentence:", answers: ["If I was rich, I will buy a car", "If I were rich, I would buy a car", "If I am rich, I bought a car", "If I be rich, I buy a car"], correct: 1 },
            { question: "What does 'procrastinate' mean?", answers: ["To do immediately", "To delay or postpone", "To finish quickly", "To work hard"], correct: 1 },
            { question: "Which is the correct reported speech for 'He said, I am tired'?", answers: ["He said that he is tired", "He said that he was tired", "He said that I am tired", "He said that I was tired"], correct: 1 },
            { question: "Choose the correct relative pronoun: 'The book ___ I read was interesting'", answers: ["who", "whom", "which", "whose"], correct: 2 },
            { question: "What is the superlative form of 'intelligent'?", answers: ["more intelligent", "most intelligent", "intelligenter", "intelligentest"], correct: 1 },
            { question: "Which sentence shows cause and effect?", answers: ["I like pizza and pasta", "Because it rained, the match was cancelled", "I will go or stay", "Either you come or I leave"], correct: 1 },
            { question: "What is the meaning of the idiom 'break the ice'?", answers: ["To break something cold", "To start a conversation", "To stop talking", "To make someone angry"], correct: 1 },
            { question: "Choose the correct modal verb: 'You ___ study harder for better grades'", answers: ["can", "should", "will", "may"], correct: 1 }
        ],
        indonesian: [
            { question: "Apa yang dimaksud dengan majas personifikasi?", answers: ["Perbandingan dua hal", "Memberikan sifat manusia pada benda mati", "Melebih-lebihkan sesuatu", "Menyamakan dua hal"], correct: 1 },
            { question: "Manakah yang termasuk kalimat majemuk bertingkat?", answers: ["Dia pergi dan tidak kembali", "Karena hujan, pertandingan ditunda", "Saya makan nasi dan minum air", "Dia cantik tetapi sombong"], correct: 1 },
            { question: "Apa fungsi kata penghubung 'namun' dalam kalimat?", answers: ["Menunjukkan sebab", "Menunjukkan akibat", "Menunjukkan pertentangan", "Menunjukkan tujuan"], correct: 2 },
            { question: "Dalam puisi, apa yang dimaksud dengan rima?", answers: ["Jumlah baris", "Kesamaan bunyi akhir", "Makna tersembunyi", "Gaya bahasa"], correct: 1 },
            { question: "Manakah yang merupakan contoh kata berimbuhan me-kan?", answers: ["membaca", "menuliskan", "berlari", "terbang"], correct: 1 },
            { question: "Apa perbedaan antara sinonim dan antonim?", answers: ["Sinonim = persamaan makna, Antonim = kebalikan makna", "Sinonim = kebalikan makna, Antonim = persamaan makna", "Keduanya sama", "Tidak ada perbedaan"], correct: 0 },
            { question: "Dalam teks argumentasi, apa yang paling penting?", answers: ["Cerita yang menarik", "Data dan fakta pendukung", "Bahasa yang indah", "Humor yang lucu"], correct: 1 },
            { question: "Apa ciri utama teks deskripsi?", answers: ["Menggambarkan sesuatu secara detail", "Menceritakan kejadian", "Memberikan pendapat", "Mengajak pembaca"], correct: 0 },
            { question: "Manakah yang termasuk unsur intrinsik cerpen?", answers: ["Biografi pengarang", "Tema dan tokoh", "Tahun terbit", "Penerbit buku"], correct: 1 },
            { question: "Apa yang dimaksud dengan amanat dalam karya sastra?", answers: ["Nama pengarang", "Pesan moral", "Judul karya", "Tahun pembuatan"], correct: 1 }
        ]
    },
    kelas3: {
        math: [
            { question: "Berapa hasil dari ∫₀¹ x² dx?", answers: ["1/3", "1/2", "2/3", "1"], correct: 0 },
            { question: "Jika z = 3 + 4i, berapa |z|?", answers: ["3", "4", "5", "7"], correct: 2 },
            { question: "Dalam distribusi normal standar, berapa P(Z < 0)?", answers: ["0", "0.5", "1", "tidak terdefinisi"], correct: 1 },
            { question: "Berapa turunan kedua dari f(x) = x⁴?", answers: ["4x��", "12x²", "24x", "4x"], correct: 1 },
            { question: "Dalam persamaan diferensial dy/dx = y, apa solusi umumnya?", answers: ["y = x + C", "y = Ce^x", "y = Cx", "y = C/x"], correct: 1 },
            { question: "Berapa hasil dari lim(x→∞) (1 + 1/x)^x?", answers: ["1", "e", "∞", "0"], correct: 1 },
            { question: "Dalam matriks 3×3, berapa maksimal rank yang mungkin?", answers: ["2", "3", "6", "9"], correct: 1 },
            { question: "Jika f(x) = ln(x), berapa f'(e)?", answers: ["1", "1/e", "e", "ln(e)"], correct: 1 },
            { question: "Dalam kombinatorik, berapa C(5,2)?", answers: ["10", "20", "25", "5"], correct: 0 },
            { question: "Berapa hasil dari ∑(n=1 to ∞) 1/2ⁿ?", answers: ["1", "2", "1/2", "∞"], correct: 0 }
        ],
        english: [
            { question: "Which sentence demonstrates the subjunctive mood?", answers: ["If I was you, I would go", "If I were you, I would go", "If I am you, I will go", "If I be you, I go"], correct: 1 },
            { question: "What is the function of a gerund in a sentence?", answers: ["Acts as a verb", "Acts as a noun", "Acts as an adjective", "Acts as an adverb"], correct: 1 },
            { question: "Choose the sentence with correct parallel structure:", answers: ["She likes reading, writing, and to paint", "She likes reading, writing, and painting", "She likes to read, writing, and paint", "She likes read, write, and painting"], correct: 1 },
            { question: "What does 'ubiquitous' mean?", answers: ["Rare", "Present everywhere", "Ancient", "Mysterious"], correct: 1 },
            { question: "Which is an example of metonymy?", answers: ["The pen is mightier than the sword", "He's a real Romeo", "The White House announced", "Time flies"], correct: 2 },
            { question: "In academic writing, what is a thesis statement?", answers: ["The conclusion", "The main argument", "A supporting detail", "The introduction"], correct: 1 },
            { question: "What is the difference between 'affect' and 'effect'?", answers: ["No difference", "Affect is a noun, effect is a verb", "Affect is a verb, effect is a noun", "They mean opposite things"], correct: 2 },
            { question: "Which literary device is used in 'The stars danced in the sky'?", answers: ["Metaphor", "Simile", "Personification", "Hyperbole"], correct: 2 },
            { question: "What is the purpose of a topic sentence?", answers: ["To conclude the paragraph", "To introduce the main idea", "To provide examples", "To transition between ideas"], correct: 1 },
            { question: "Choose the correct usage: 'The data ___ conclusive'", answers: ["is", "are", "was", "were"], correct: 1 }
        ],
        indonesian: [
            { question: "Apa yang dimaksud dengan kohesi dalam teks?", answers: ["Kepaduan makna", "Kepaduan bentuk", "Keindahan bahasa", "Panjang teks"], correct: 1 },
            { question: "Dalam kritik sastra, apa yang dimaksud dengan pendekatan struktural?", answers: ["Menganalisis unsur intrinsik", "Menganalisis latar belakang pengarang", "Menganalisis pengaruh sosial", "Menganalisis pembaca"], correct: 0 },
            { question: "Manakah yang merupakan ciri teks eksposisi?", answers: ["Bersifat subjektif", "Menjelaskan informasi", "Menghibur pembaca", "Menceritakan pengalaman"], correct: 1 },
            { question: "Apa fungsi konjungsi kausal dalam kalimat?", answers: ["Menunjukkan waktu", "Menunjukkan sebab-akibat", "Menunjukkan tempat", "Menunjukkan cara"], correct: 1 },
            { question: "Dalam penulisan karya ilmiah, apa yang dimaksud dengan abstrak?", answers: ["Daftar pustaka", "Ringkasan penelitian", "Metodologi", "Kesimpulan"], correct: 1 },
            { question: "Apa perbedaan antara denotasi dan konotasi?", answers: ["Denotasi = makna sebenarnya, Konotasi = makna tambahan", "Keduanya sama", "Denotasi = makna tambahan, Konotasi = makna sebenarnya", "Tidak ada perbedaan"], correct: 0 },
            { question: "Manakah yang termasuk majas pertentangan?", answers: ["Metafora", "Antitesis", "Personifikasi", "Hiperbola"], correct: 1 },
            { question: "Dalam teks argumentasi, apa fungsi data dan fakta?", answers: ["Memperindah bahasa", "Memperkuat argumen", "Menghibur pembaca", "Memperpanjang teks"], correct: 1 },
            { question: "Apa yang dimaksud dengan register bahasa?", answers: ["Variasi bahasa sesuai situasi", "Kamus bahasa", "Tata bahasa", "Ejaan bahasa"], correct: 0 },
            { question: "Dalam analisis wacana, apa yang dimaksud dengan konteks?", answers: ["Isi teks", "Situasi yang melatarbelakangi teks", "Panjang teks", "Bahasa yang digunakan"], correct: 1 }
        ]
    }
};

// ========================================
// DATA HANDLER UNTUK SDK
// ========================================
const dataHandler = {
    onDataChanged(data) {
        allUsers = data.filter(item => item.full_name && !item.comment_id);
        allComments = data.filter(item => item.comment_id);
        
        updateUserInterface();
        updateLeaderboard();
        
        if (document.getElementById('commentsPage').style.display !== 'none') {
            displayComments();
        }
    }
};

// ========================================
// FUNGSI INISIALISASI APLIKASI
// ========================================
async function initializeApp() {
    try {
        // Cek apakah user sudah login sebelumnya
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            currentUser = userData.full_name;
            updateAuthInterface();
            checkUserClass();
        }

        const initResult = await window.dataSdk.init(dataHandler);
        if (!initResult.isOk) {
            console.error("Failed to initialize data SDK");
            return;
        }

        if (window.elementSdk) {
            await window.elementSdk.init({
                defaultConfig,
                onConfigChange: async (config) => {
                    document.getElementById('heroTitle').textContent = config.site_title || defaultConfig.site_title;
                    document.getElementById('heroDescription').textContent = config.site_description || defaultConfig.site_description;
                    document.getElementById('challengesTitle').textContent = config.daily_challenges_title || defaultConfig.daily_challenges_title;
                },
                mapToCapabilities: (config) => ({
                    recolorables: [],
                    borderables: [],
                    fontEditable: undefined,
                    fontSizeable: undefined
                }),
                mapToEditPanelValues: (config) => new Map([
                    ["site_title", config.site_title || defaultConfig.site_title],
                    ["site_description", config.site_description || defaultConfig.site_description],
                    ["daily_challenges_title", config.daily_challenges_title || defaultConfig.daily_challenges_title]
                ])
            });
        }

        initializeDailyChallenges();
        updateUserInterface();

    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

// ========================================
// FUNGSI-FUNGSI LOGIN
// ========================================

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('signupModal').style.display = 'none';
}

function showSignupModal() {
    document.getElementById('signupModal').style.display = 'flex';
    document.getElementById('loginModal').style.display = 'none';
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signupModal').style.display = 'none';
}

function switchToSignup() {
    showSignupModal();
}

function switchToLogin() {
    showLoginModal();
}

function handleLogout() {
    currentUser = null;
    selectedClass = null;
    localStorage.removeItem('currentUser');
    updateAuthInterface();
    showHome();
    showNotification('👋 Anda telah keluar. Sampai jumpa!', 'info');
}

function updateAuthInterface() {
    const authContainer = document.getElementById('authContainer');
    const userInfo = document.getElementById('userInfo');
    const userWelcome = document.getElementById('userWelcome');
    
    if (currentUser) {
        authContainer.style.display = 'none';
        userInfo.style.display = 'flex';
        userWelcome.textContent = `👋 Halo, ${currentUser}!`;
    } else {
        authContainer.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    const existingNotif = document.getElementById('notification');
    if (existingNotif) {
        document.body.removeChild(existingNotif);
    }

    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.95)' : 
                    type === 'error' ? 'rgba(244, 67, 54, 0.95)' : 
                    'rgba(78, 205, 196, 0.95)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        font-family: 'Comic Neue', cursive;
        font-weight: 600;
        z-index: 2000;
        backdrop-filter: blur(10px);
        border: 2px solid ${type === 'success' ? '#4caf50' : 
                          type === 'error' ? '#f44336' : '#4ecdc4'};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

async function handleLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!emailInput || !password) {
        showNotification('Silakan lengkapi semua field!', 'error');
        return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        // 1. Panggil API Backend
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput, password: password })
        });

        const data = await res.json();

        if (!res.ok) {
            showNotification(data.message || 'Login gagal!', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            return;
        }

        // 2. Jika sukses, set user ke state aplikasi
        currentUser = data.user.full_name;
        
        // Simpan ke localStorage agar tidak logout saat refresh
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // 3. Jalankan logika Daily Challenge
        checkDailyBonus(data.user);

        updateAuthInterface();
        closeModal();
        showNotification(`👋 Selamat datang kembali, ${currentUser}!`, 'success');
        
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
        setTimeout(() => {
            checkUserClass();
            showHome();
        }, 500);

    } catch (error) {
        console.error("LOGIN_ERROR:", error);
        showNotification('Gagal terhubung ke server', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function checkDailyBonus(user) {
    const today = getCurrentDateString();
    const lastLoginDate = user.last_login_date || '';
    
    if (lastLoginDate !== today) {
        // Logika daily challenge bisa ditambahkan di sini
        // Misalnya memberikan bonus bintang untuk login hari ini
        showNotification('🎁 Selamat datang kembali! Bonus login harian diterima!', 'success');
    }
}

function getCurrentDateString() {
    const today = new Date();
    return today.getFullYear() + '-' + 
           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
           String(today.getDate()).padStart(2, '0');
}

async function handleSignup(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('signupName').value.trim();
    const emailInput = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    if (!fullName || !emailInput || !password || !confirmPassword) {
        showNotification('Silakan lengkapi semua field!', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password minimal 6 karakter!', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Konfirmasi password tidak cocok!', 'error');
        return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        // Panggil API Backend untuk signup
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                full_name: fullName, 
                email: emailInput, 
                password: password 
            })
        });

        const data = await res.json();

        if (!res.ok) {
            showNotification(data.message || 'Pendaftaran gagal!', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            return;
        }

        // Jika sukses, set user ke state aplikasi
        currentUser = data.user.full_name;
        
        // Simpan ke localStorage
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        updateAuthInterface();
        closeModal();
        showNotification('🎉 Akun berhasil dibuat! Selamat datang di Eduverse!', 'success');
        
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        setTimeout(() => {
            checkUserClass();
            showHome();
        }, 500);

    } catch (error) {
        console.error("SIGNUP_ERROR:", error);
        showNotification('Gagal terhubung ke server', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// ========================================
// FUNGSI-FUNGSI PEMILIHAN KELAS
// ========================================
        
function checkUserClass() {
    if (!currentUser) return;
    
    // Coba ambil data user dari localStorage dulu
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.selected_class) {
            selectedClass = userData.selected_class;
            showSelectedClassInfo();
            showCategoriesSection();
            showPopularAndRecommend();
        } else {
            showClassSelection();
        }
    } else {
        showClassSelection();
    }
    
    updateDailyChallengesDisplay();
}

function showPopularAndRecommend() {
    document.getElementById('popularSection').style.display = 'block';
    document.getElementById('recommendSection').style.display = 'block';
}

function scrollCards(containerId, direction) {
    const container = document.getElementById(containerId);
    const scrollAmount = 300;
    
    if (direction === 'right') {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
}

function startQuizFromCard(category, topicId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    if (!selectedClass) {
        showClassSelection();
        return;
    }

    startQuiz(category, topicId);
}

function showClassSelection() {
    document.getElementById('classSelectionSection').style.display = 'block';
    document.getElementById('selectedClassInfo').style.display = 'none';
    document.getElementById('categoriesSection').style.display = 'none';
    document.getElementById('popularSection').style.display = 'none';
    document.getElementById('recommendSection').style.display = 'none';
}

function showSelectedClassInfo() {
    const classNames = {
        'kelas1': 'Kelas X (SMA/SMK/MA)',
        'kelas2': 'Kelas XI (SMA/SMK/MA)', 
        'kelas3': 'Kelas XII (SMA/SMK/MA)'
    };
    
    document.getElementById('selectedClassName').textContent = 
        `Kelas yang Dipilih: ${classNames[selectedClass] || '-'}`;
    document.getElementById('selectedClassInfo').style.display = 'block';
    document.getElementById('classSelectionSection').style.display = 'none';
}

function showCategoriesSection() {
    document.getElementById('categoriesSection').style.display = 'block';
}

async function selectClass(classLevel) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    selectedClass = classLevel;
    
    // Update localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        userData.selected_class = classLevel;
        localStorage.setItem('currentUser', JSON.stringify(userData));
    }
    
    showSelectedClassInfo();
    showCategoriesSection();
    showPopularAndRecommend();
    showNotification(`✅ Berhasil memilih ${getClassName(classLevel)}!`, 'success');
}

function getClassName(classLevel) {
    const classNames = {
        'kelas1': 'Kelas X (SMA/SMK/MA)',
        'kelas2': 'Kelas XI (SMA/SMK/MA)', 
        'kelas3': 'Kelas XII (SMA/SMK/MA)'
    };
    return classNames[classLevel] || classLevel;
}

// ========================================
// FUNGSI-FUNGSI DAILY CHALLENGES
// ========================================
        
function initializeDailyChallenges() {
    const challengesGrid = document.getElementById('challengesGrid');
    challengesGrid.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const challenge = document.createElement('div');
        challenge.className = 'challenge-circle challenge-pending';
        challenge.textContent = i;
        challenge.style.cursor = 'default';
        challengesGrid.appendChild(challenge);
    }
}

function updateDailyChallengesDisplay() {
    if (!currentUser) return;

    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) return;

    const userData = JSON.parse(savedUser);
    const challenges = userData.daily_challenges || [false, false, false, false, false];
    const challengeCircles = document.querySelectorAll('.challenge-circle');

    challengeCircles.forEach((circle, index) => {
        if (challenges[index]) {
            circle.className = 'challenge-circle challenge-completed';
            circle.innerHTML = '✓';
        } else {
            circle.className = 'challenge-circle challenge-pending';
            circle.textContent = index + 1;
        }
    });
}

// ========================================
// FUNGSI UPDATE INTERFACE USER
// ========================================
        
function updateUserInterface() {
    if (!currentUser) return;

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        document.getElementById('userStars').textContent = userData.total_stars || 0;
        updateDailyChallengesDisplay();
        
        if (userData.selected_class) {
            selectedClass = userData.selected_class;
            checkUserClass();
        }
    }
}

// ========================================
// FUNGSI-FUNGSI TOPIK
// ========================================
        
function showTopics(category) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    if (!selectedClass) {
        showClassSelection();
        return;
    }

    currentQuiz = category;
    
    document.getElementById('categoriesSection').style.display = 'none';
    document.getElementById('topicsSection').style.display = 'block';
    
    const categoryNames = {
        math: 'Matematika 📊',
        english: 'Bahasa Inggris 🌍',
        indonesian: 'Bahasa Indonesia 🇮🇩'
    };
    document.getElementById('topicsTitle').textContent = `Pilih Topik ${categoryNames[category]}`;
    
    const topicsGrid = document.getElementById('topicsGrid');
    topicsGrid.innerHTML = '';
    
    const topics = topicsDatabase[selectedClass][category];
    topics.forEach(topic => {
        const topicCard = document.createElement('div');
        topicCard.className = 'category-card';
        topicCard.style.cursor = 'pointer';
        topicCard.innerHTML = `
            <div class="category-icon">${topic.icon}</div>
            <h3 class="category-title">${topic.name}</h3>
            <p>${topic.description}</p>
            <button class="category-btn btn-${category}" onclick="startQuiz('${category}', '${topic.id}')">Mulai Quiz</button>
        `;
        topicsGrid.appendChild(topicCard);
    });
}
        
function backToCategories() {
    document.getElementById('topicsSection').style.display = 'none';
    document.getElementById('categoriesSection').style.display = 'block';
}
        
// ========================================
// FUNGSI-FUNGSI QUIZ
// ========================================
        
function startQuiz(category, topicId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    if (!selectedClass) {
        showClassSelection();
        return;
    }

    currentQuiz = category;
    currentTopic = topicId;
    quizData = [...quizDatabase[selectedClass][category]];
    currentQuestionIndex = 0;
    userAnswers = [];

    for (let i = quizData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizData[i], quizData[j]] = [quizData[j], quizData[i]];
    }

    showQuizPage();
    loadQuestion();
}

function showQuizPage() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('quizPage').style.display = 'block';
    document.getElementById('resultsPage').style.display = 'none';
    document.getElementById('leaderboardPage').style.display = 'none';
    document.getElementById('commentsPage').style.display = 'none';

    const titles = {
        math: 'Quiz Matematika 📊',
        english: 'Quiz Bahasa Inggris 🌍',
        indonesian: 'Quiz Bahasa Indonesia 🇮🇩'
    };

    const classNames = {
        'kelas1': 'Kelas X',
        'kelas2': 'Kelas XI', 
        'kelas3': 'Kelas XII'
    };

    let topicName = '';
    if (currentTopic && topicsDatabase[selectedClass] && topicsDatabase[selectedClass][currentQuiz]) {
        const topic = topicsDatabase[selectedClass][currentQuiz].find(t => t.id === currentTopic);
        if (topic) {
            topicName = ` - ${topic.name}`;
        }
    }

    document.getElementById('quizTitle').textContent = titles[currentQuiz] + topicName || 'Quiz';
    document.getElementById('quizClassInfo').textContent = classNames[selectedClass] || '';
    document.getElementById('totalQuestions').textContent = quizData.length;
}

function loadQuestion() {
    const question = quizData[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;

    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    const answersGrid = document.getElementById('answersGrid');
    answersGrid.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
        button.onclick = () => selectAnswer(index, button);
        answersGrid.appendChild(button);
    });

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = currentQuestionIndex === quizData.length - 1 ? 'Selesai' : 'Selanjutnya';
    nextBtn.disabled = true;
}

function selectAnswer(answerIndex, button) {
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    button.classList.add('selected');
    userAnswers[currentQuestionIndex] = answerIndex;

    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === undefined) return;

    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        finishQuiz();
    }
}

async function finishQuiz() {
    let correctAnswers = 0;
    quizData.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            correctAnswers++;
        }
    });

    const score = correctAnswers;
    const totalQuestions = quizData.length;
    const starsEarned = correctAnswers * 10;

    // Update user data di localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        userData.total_stars = (userData.total_stars || 0) + starsEarned;
        
        const quizHistory = userData.quiz_history || [];
        quizHistory.push({
            category: currentQuiz,
            class: selectedClass,
            score: score,
            total: totalQuestions,
            stars: starsEarned,
            date: new Date().toISOString()
        });
        userData.quiz_history = quizHistory;

        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Juga update ke SDK untuk leaderboard
        const sdkUser = allUsers.find(u => u.full_name === currentUser);
        if (sdkUser) {
            sdkUser.total_stars = userData.total_stars;
            sdkUser.quiz_history = JSON.stringify(quizHistory);
            await window.dataSdk.update(sdkUser);
        }
    }

    showResults(score, totalQuestions, starsEarned);
}

function showResults(score, total, stars) {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('quizPage').style.display = 'none';
    document.getElementById('resultsPage').style.display = 'block';
    document.getElementById('leaderboardPage').style.display = 'none';
    document.getElementById('commentsPage').style.display = 'none';

    document.getElementById('finalScore').textContent = `${score}/${total}`;
    document.getElementById('earnedStars').textContent = `⭐ +${stars} Stars Earned!`;

    document.getElementById('answerReviewSection').style.display = 'none';

    updateUserInterface();
}

// ========================================
// FUNGSI REVIEW JAWABAN
// ========================================
        
function showAnswerReview() {
    const reviewSection = document.getElementById('answerReviewSection');
    const reviewList = document.getElementById('answerReviewList');
    const reviewButton = document.getElementById('reviewButton');
    
    if (reviewSection.style.display === 'block') {
        reviewSection.style.display = 'none';
        reviewButton.textContent = '📋 Review Jawaban';
        return;
    }
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    quizData.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            correctCount++;
        } else {
            incorrectCount++;
        }
    });
    
    const summaryHTML = `
        <div class="review-summary">
            <h3 style="color: #4ecdc4; margin-bottom: 1rem;">📊 Ringkasan Hasil Quiz</h3>
            <div class="summary-stats">
                <div class="stat-item">
                    <span class="stat-number" style="color: #4caf50;">✅ ${correctCount}</span>
                    <span class="stat-label">Jawaban Benar</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" style="color: #f44336;">❌ ${incorrectCount}</span>
                    <span class="stat-label">Jawaban Salah</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" style="color: #ffd700;">🏆 ${Math.round((correctCount/quizData.length)*100)}%</span>
                    <span class="stat-label">Tingkat Akurasi</span>
                </div>
            </div>
        </div>
    `;
    
    const legendHTML = `
        <div class="review-legend">
            <h4 style="margin-bottom: 0.75rem; color: #4ecdc4;">🔍 Panduan Warna:</h4>
            <div class="legend-item">
                <div class="legend-color legend-correct"></div>
                <span><strong>Hijau</strong> = Jawaban yang benar</span>
            </div>
            <div class="legend-item">
                <div class="legend-color legend-user"></div>
                <span><strong>Pink</strong> = Jawaban yang Anda pilih</span>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.9rem; color: rgba(255,255,255,0.8);">
                💡 <em>Jika warna hijau dan pink sama = Anda menjawab dengan benar!</em>
            </div>
        </div>
    `;
    
    let reviewHTML = summaryHTML + legendHTML;
    
    quizData.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;
        const statusClass = isCorrect ? 'correct' : 'incorrect';
        const statusIcon = isCorrect ? '✅' : '❌';
        const statusText = isCorrect ? 'BENAR' : 'SALAH';
        
        let answersHTML = '';
        question.answers.forEach((answer, answerIndex) => {
            let answerClass = 'review-answer-option';
            let prefix = String.fromCharCode(65 + answerIndex);
            
            if (answerIndex === question.correct) {
                answerClass += ' correct-answer';
            }
            
            if (answerIndex === userAnswer) {
                answerClass += ' user-answer';
            }
            
            answersHTML += `
                <div class="${answerClass}">
                    <strong>${prefix}.</strong> ${answer}
                </div>
            `;
        });
        
        reviewHTML += `
            <div class="answer-review-item ${statusClass}">
                <div class="review-question-number">Soal ${index + 1}</div>
                <div class="review-question-text">${question.question}</div>
                <div class="review-answers">${answersHTML}</div>
                <div class="review-status ${statusClass}">
                    <span style="font-size: 1.2rem;">${statusIcon}</span>
                    <span style="font-weight: 700;">${statusText}</span>
                    ${!isCorrect ? `<span style="margin-left: 1rem; color: rgba(255,255,255,0.9); font-weight: normal;">→ Jawaban benar: <strong>${String.fromCharCode(65 + question.correct)}</strong></span>` : ''}
                </div>
            </div>
        `;
    });
    
    reviewList.innerHTML = reviewHTML;
    reviewSection.style.display = 'block';
    reviewButton.textContent = '🔼 Sembunyikan Review';
    
    setTimeout(() => {
        reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ========================================
// FUNGSI-FUNGSI NAVIGASI HALAMAN
// ========================================
        
function showHome() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('quizPage').style.display = 'none';
    document.getElementById('resultsPage').style.display = 'none';
    document.getElementById('leaderboardPage').style.display = 'none';
    document.getElementById('commentsPage').style.display = 'none';
    
    document.getElementById('topicsSection').style.display = 'none';
    
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('searchInput').value = '';
    
    document.getElementById('popularSection').style.display = 'none';
    document.getElementById('recommendSection').style.display = 'none';
    
    checkUserClass();
}

function showLeaderboard() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('quizPage').style.display = 'none';
    document.getElementById('resultsPage').style.display = 'none';
    document.getElementById('leaderboardPage').style.display = 'block';
    document.getElementById('commentsPage').style.display = 'none';

    updateLeaderboard();
}

// ========================================
// FUNGSI LEADERBOARD REALTIME
// ========================================
        
function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';

    const sortedUsers = [...allUsers]
        .sort((a, b) => (b.total_stars || 0) - (a.total_stars || 0))
        .slice(0, 10);

    sortedUsers.forEach((user, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        
        const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32'];
        const rankColor = index < 3 ? rankColors[index] : '#4ecdc4';
        
        if (user.full_name === currentUser) {
            item.style.border = '2px solid #ff6b9d';
            item.style.backgroundColor = 'rgba(255, 107, 157, 0.1)';
        }
        
        const classNames = {
            'kelas1': 'X',
            'kelas2': 'XI', 
            'kelas3': 'XII'
        };
        
        const userClass = user.selected_class ? ` (${classNames[user.selected_class]})` : '';
        
        item.innerHTML = `
            <div class="leaderboard-rank" style="color: ${rankColor};">#${index + 1}</div>
            <div class="leaderboard-name">${user.full_name}${userClass}${user.full_name === currentUser ? ' (You)' : ''}</div>
            <div class="leaderboard-stars">
                <span class="star-icon">⭐</span>
                <span>${user.total_stars || 0}</span>
            </div>
        `;
        
        leaderboardList.appendChild(item);
    });

    if (sortedUsers.length === 0) {
        leaderboardList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7);">Belum ada data leaderboard</p>';
    }
}

// ========================================
// FUNGSI SISTEM KOMENTAR
// ========================================
        
function showComments() {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('quizPage').style.display = 'none';
    document.getElementById('resultsPage').style.display = 'none';
    document.getElementById('leaderboardPage').style.display = 'none';
    document.getElementById('commentsPage').style.display = 'block';
    
    displayComments();
}
        
async function postComment() {
    if (!currentUser) return;
    
    const textarea = document.getElementById('commentTextarea');
    const commentText = textarea.value.trim();
    
    if (!commentText) return;
    
    const submitBtn = event.target;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        const newComment = {
            comment_id: generateCommentId(),
            comment_text: commentText,
            comment_author: currentUser,
            comment_timestamp: new Date().toISOString(),
            parent_comment_id: ''
        };
        
        const createResult = await window.dataSdk.create(newComment);
        if (createResult.isOk) {
            textarea.value = '';
            displayComments();
        }
    } catch (error) {
        console.error('Error posting comment:', error);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}
        
function generateCommentId() {
    return 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
        
function displayComments() {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    
    const mainComments = allComments
        .filter(comment => !comment.parent_comment_id)
        .sort((a, b) => new Date(b.comment_timestamp) - new Date(a.comment_timestamp));
    
    if (mainComments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7);">Belum ada komentar. Jadilah yang pertama berkomentar!</p>';
        return;
    }
    
    mainComments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        
        const replyCount = countAllReplies(comment.comment_id);
        if (replyCount > 0) {
            const threadControls = document.createElement('div');
            threadControls.style.cssText = `
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-top: 0.5rem;
            `;
            
            const replyCounter = document.createElement('div');
            replyCounter.style.cssText = `
                color: #4ecdc4;
                font-size: 0.85rem;
                font-weight: 600;
                opacity: 0.8;
            `;
            replyCounter.innerHTML = `🧵 ${replyCount} balasan dalam thread ini`;
            
            const collapseBtn = document.createElement('button');
            collapseBtn.style.cssText = `
                background: rgba(78, 205, 196, 0.2);
                border: 1px solid rgba(78, 205, 196, 0.4);
                color: #4ecdc4;
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Comic Neue', cursive;
                font-weight: 600;
            `;
            collapseBtn.innerHTML = '📁 Sembunyikan Thread';
            collapseBtn.onclick = () => toggleThread(comment.comment_id, collapseBtn);
            
            collapseBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(78, 205, 196, 0.3)';
            });
            
            collapseBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(78, 205, 196, 0.2)';
            });
            
            threadControls.appendChild(replyCounter);
            threadControls.appendChild(collapseBtn);
            
            const actionsDiv = commentElement.querySelector('.comment-actions');
            actionsDiv.appendChild(threadControls);
        }
        
        commentsList.appendChild(commentElement);
    });
}
        
function countAllReplies(commentId) {
    let count = 0;
    const directReplies = allComments.filter(comment => comment.parent_comment_id === commentId);
    
    count += directReplies.length;
    
    directReplies.forEach(reply => {
        count += countAllReplies(reply.comment_id);
    });
    
    return count;
}
        
function toggleThread(commentId, button) {
    const repliesContainer = document.getElementById(`replies_${commentId}`);
    
    if (repliesContainer.style.display === 'none') {
        repliesContainer.style.display = 'block';
        button.innerHTML = '📁 Sembunyikan Thread';
        
        repliesContainer.style.opacity = '0';
        repliesContainer.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            repliesContainer.style.transition = 'all 0.3s ease';
            repliesContainer.style.opacity = '1';
            repliesContainer.style.transform = 'translateY(0)';
        }, 10);
    } else {
        repliesContainer.style.transition = 'all 0.3s ease';
        repliesContainer.style.opacity = '0';
        repliesContainer.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            repliesContainer.style.display = 'none';
            button.innerHTML = '📂 Tampilkan Thread';
        }, 300);
    }
}
        
function createCommentElement(comment, depth = 0) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    
    const indentStyle = depth > 0 ? `margin-left: ${Math.min(depth * 20, 100)}px; border-left: 2px solid rgba(78, 205, 196, 0.3);` : '';
    commentDiv.style.cssText = indentStyle;
    
    commentDiv.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${comment.comment_author}</span>
            <span class="comment-time">${formatTime(comment.comment_timestamp)}</span>
            ${depth > 0 ? `<span class="reply-indicator">↳ Balasan Level ${depth}</span>` : ''}
            ${depth === 0 ? '<span class="thread-starter" style="background: rgba(255, 107, 157, 0.2); color: #ff6b9d; padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.8rem; font-weight: 600;">🧵 Thread Starter</span>' : ''}
        </div>
        <div class="comment-text">${comment.comment_text}</div>
        <div class="comment-actions">
            <button class="reply-btn" onclick="toggleReplyForm('${comment.comment_id}')">💬 Balas</button>
        </div>
        <div class="reply-form" id="replyForm_${comment.comment_id}">
            <textarea class="reply-textarea" placeholder="Tulis balasan Anda..." id="replyText_${comment.comment_id}"></textarea>
            <div style="margin-top: 0.5rem;">
                <button class="control-btn btn-primary" style="font-size: 0.9rem; padding: 0.5rem 1rem;" onclick="postReply('${comment.comment_id}')">Kirim Balasan</button>
                <button class="control-btn btn-secondary" style="font-size: 0.9rem; padding: 0.5rem 1rem;" onclick="toggleReplyForm('${comment.comment_id}')">Batal</button>
            </div>
        </div>
        <div class="replies-container" id="replies_${comment.comment_id}"></div>
    `;
    
    displayNestedReplies(comment.comment_id, commentDiv.querySelector(`#replies_${comment.comment_id}`), depth + 1);
    
    return commentDiv;
}
        
function displayNestedReplies(parentCommentId, repliesContainer, depth = 1) {
    const replies = allComments
        .filter(comment => comment.parent_comment_id === parentCommentId)
        .sort((a, b) => new Date(a.comment_timestamp) - new Date(b.comment_timestamp));
    
    repliesContainer.innerHTML = '';
    replies.forEach(reply => {
        const replyElement = createCommentElement(reply, depth);
        repliesContainer.appendChild(replyElement);
    });
}
        
function toggleReplyForm(commentId) {
    const replyForm = document.getElementById(`replyForm_${commentId}`);
    if (replyForm.style.display === 'block') {
        replyForm.style.display = 'none';
    } else {
        replyForm.style.display = 'block';
        document.getElementById(`replyText_${commentId}`).focus();
    }
}
        
async function postReply(parentCommentId) {
    if (!currentUser) return;
    
    const textarea = document.getElementById(`replyText_${parentCommentId}`);
    const replyText = textarea.value.trim();
    
    if (!replyText) return;
    
    try {
        const newReply = {
            comment_id: generateCommentId(),
            comment_text: replyText,
            comment_author: currentUser,
            comment_timestamp: new Date().toISOString(),
            parent_comment_id: parentCommentId
        };
        
        const createResult = await window.dataSdk.create(newReply);
        if (createResult.isOk) {
            textarea.value = '';
            toggleReplyForm(parentCommentId);
            displayComments();
        }
    } catch (error) {
        console.error('Error posting reply:', error);
    }
}
        
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function showMenu() {
    const existingMenu = document.getElementById('dropdownMenu');
    if (existingMenu) {
        document.body.removeChild(existingMenu);
        return;
    }

    const menuDropdown = document.createElement('div');
    menuDropdown.id = 'dropdownMenu';
    menuDropdown.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(15, 15, 35, 0.95);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        padding: 1rem;
        z-index: 1000;
        font-family: 'Comic Neue', cursive;
        min-width: 200px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;

    const menuItems = [
        { icon: '🏠', text: 'Home', action: () => { showHome(); closeMenu(); } },
        { icon: '🏆', text: 'Leaderboard', action: () => { showLeaderboard(); closeMenu(); } },
        { icon: '💭', text: 'Komentar', action: () => { showComments(); closeMenu(); } }
    ];

    if (currentUser) {
        menuItems.push({ icon: '🚪', text: 'Logout', action: () => { handleLogout(); closeMenu(); } });
    }

    menuItems.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: ${index < menuItems.length - 1 ? '0.5rem' : '0'};
        `;
        
        menuItem.innerHTML = `
            <span style="font-size: 1.2rem;">${item.icon}</span>
            <span>${item.text}</span>
        `;
        
        menuItem.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(78, 205, 196, 0.2)';
        });
        
        menuItem.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        });
        
        menuItem.onclick = item.action;
        
        menuDropdown.appendChild(menuItem);
    });

    document.body.appendChild(menuDropdown);

    setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
    }, 100);

    function handleOutsideClick(e) {
        if (!menuDropdown.contains(e.target) && !e.target.closest('.settings-btn')) {
            closeMenu();
            document.removeEventListener('click', handleOutsideClick);
        }
    }
}

function closeMenu() {
    const menu = document.getElementById('dropdownMenu');
    if (menu) {
        document.body.removeChild(menu);
    }
}

// ========================================
// FUNGSI PENCARIAN
// ========================================
        
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        
        if (searchTerm.length < 2) {
            document.getElementById('searchResults').style.display = 'none';
            return;
        }
        
        performSearch(searchTerm);
    });
}

function performSearch(searchTerm) {
    const searchResults = document.getElementById('searchResults');
    const searchResultsList = document.getElementById('searchResultsList');
    
    let results = [];
    
    const categoryKey = categoryMapping[searchTerm] || searchTerm;
    
    if (selectedClass && topicsDatabase[selectedClass]) {
        Object.keys(topicsDatabase[selectedClass]).forEach(category => {
            topicsDatabase[selectedClass][category].forEach(topic => {
                if (topic.name.toLowerCase().includes(searchTerm) || 
                    topic.description.toLowerCase().includes(searchTerm) ||
                    category === categoryKey) {
                    results.push({
                        category: category,
                        topic: topic,
                        type: 'topic'
                    });
                }
            });
        });
    }
    
    if (results.length > 0) {
        searchResultsList.innerHTML = '';
        results.forEach(result => {
            const categoryNames = {
                math: 'Matematika',
                english: 'Bahasa Inggris',
                indonesian: 'Bahasa Indonesia'
            };
            
            const resultItem = document.createElement('div');
            resultItem.className = 'search-item';
            resultItem.innerHTML = `
                <div style="font-weight: 700; margin-bottom: 0.25rem;">
                    ${result.topic.icon} ${result.topic.name}
                </div>
                <div style="font-size: 0.85rem; opacity: 0.8;">
                    ${categoryNames[result.category]} - ${result.topic.description}
                </div>
            `;
            resultItem.onclick = () => {
                startQuiz(result.category, result.topic.id);
                document.getElementById('searchResults').style.display = 'none';
                document.getElementById('searchInput').value = '';
            };
            searchResultsList.appendChild(resultItem);
        });
        searchResults.style.display = 'block';
    } else {
        searchResultsList.innerHTML = '<div style="padding: 1rem; text-align: center; color: rgba(255,255,255,0.7);">Tidak ada hasil ditemukan</div>';
        searchResults.style.display = 'block';
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
        
document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('signupForm').addEventListener('submit', handleSignup);

// ========================================
// INISIALISASI SAAT HALAMAN LOAD
// ========================================
        
window.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeSearch();
});