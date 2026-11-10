// Efek Suara Klik / Menu (Web Audio API)
function playClickSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
        // Ignore audio context restriction
    }
}

// Fungsi Navigasi Antar Bagian dengan Efek Suara
function switchSection(sectionId) {
    playClickSound();
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Efek Suara Sederhana untuk Game (Menang/Kalah)
function playSound(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        if (type === 'win') {
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
        } else if (type === 'lose') {
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        }
    } catch (e) {
        // Ignore
    }
}

// --- GAME 1: TEBAK ANGKA LOGIC ---
let angkaRahasia = Math.floor(Math.random() * 50) + 1;
let sisaKesempatan = 10;
let skorTebak = 0;

function prosesTebakan() {
    playClickSound();
    const inputEl = document.getElementById('inputTebakan');
    const feedbackEl = document.getElementById('feedbackTebak');
    const tebakan = parseInt(inputEl.value);

    if (isNaN(tebakan) || tebakan < 1 || tebakan > 50) {
        feedbackEl.style.color = '#ef4444';
        feedbackEl.textContent = '⚠️ Masukkan angka yang valid antara 1 sampai 50!';
        return;
    }

    sisaKesempatan--;
    document.getElementById('sisaKesempatan').textContent = sisaKesempatan;

    if (tebakan === angkaRahasia) {
        feedbackEl.style.color = '#22c55e';
        feedbackEl.textContent = `🎉 Selamat! Tebakan Anda benar (${angkaRahasia}).`;
        skorTebak += 10;
        document.getElementById('skorTebak').textContent = skorTebak;
        playSound('win');
        document.getElementById('btnTebak').disabled = true;
    } else if (sisaKesempatan === 0) {
        feedbackEl.style.color = '#ef4444';
        feedbackEl.textContent = `❌ Game Over! Angka rahasianya adalah ${angkaRahasia}.`;
        playSound('lose');
        document.getElementById('btnTebak').disabled = true;
    } else if (tebakan < angkaRahasia) {
        feedbackEl.style.color = '#f59e0b';
        feedbackEl.textContent = '📈 Terlalu KECIL! Coba angka yang lebih besar.';
        playSound('lose');
    } else {
        feedbackEl.style.color = '#f59e0b';
        feedbackEl.textContent = '📉 Terlalu BESAR! Coba angka yang lebih kecil.';
        playSound('lose');
    }
    inputEl.value = '';
    inputEl.focus();
}

function resetTebakAngka() {
    playClickSound();
    angkaRahasia = Math.floor(Math.random() * 50) + 1;
    sisaKesempatan = 10;
    document.getElementById('sisaKesempatan').textContent = sisaKesempatan;
    document.getElementById('feedbackTebak').textContent = '';
    document.getElementById('btnTebak').disabled = false;
    document.getElementById('inputTebakan').value = '';
}

// --- GAME 2: KUIS PENGETAHUAN WEB (Soal Diperbanyak) ---
const soalKuis = [
    {
        tanya: "Tag HTML apa yang digunakan untuk membuat hyperlink?",
        opsi: ["<a>", "<link>", "<href>", "<url>"],
        jawaban: 0
    },
    {
        tanya: "Properti CSS apa yang digunakan untuk mengubah warna teks?",
        opsi: ["font-color", "text-style", "color", "background-color"],
        jawaban: 2
    },
    {
        tanya: "Metode JavaScript apa yang digunakan untuk menampilkan data di console?",
        opsi: ["print()", "console.log()", "debug.log()", "alert()"],
        jawaban: 1
    },
    {
        tanya: "Atribut HTML apa yang biasa digunakan untuk memberikan jalur link gambar?",
        opsi: ["href", "src", "link", "alt"],
        jawaban: 1
    },
    {
        tanya: "Apa kepanjangan dari CSS dalam dunia web development?",
        opsi: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheet"],
        jawaban: 1
    }
];

let indeksSoal = 0;
let skorKuis = 0;

function mulaiKuis() {
    playClickSound();
    indeksSoal = 0;
    skorKuis = 0;
    document.getElementById('quiz-question-box').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
    tampilkanSoal();
}

function tampilkanSoal() {
    if (indeksSoal < soalKuis.length) {
        const current = soalKuis[indeksSoal];
        document.getElementById('soalPertanyaan').textContent = `Soal ${indeksSoal + 1}: ${current.tanya}`;
        const opsiContainer = document.getElementById('pilihanOpsi');
        opsiContainer.innerHTML = '';

        current.opsi.forEach((opsi, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-secondary';
            styleQuizButton(btn);
            btn.textContent = opsi;
            btn.onclick = () => cekJawabanKuis(index);
            opsiContainer.appendChild(btn);
        });
    } else {
        document.getElementById('quiz-question-box').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'block';
        document.getElementById('hasilSkorKuis').textContent = `Skor Akhir Kuis Anda: ${skorKuis} dari ${soalKuis.length * 10}`;
        playSound('win');
    }
}

function styleQuizButton(btn) {
    btn.style.width = '100%';
    btn.style.textAlign = 'left';
    btn.style.padding = '1rem';
    btn.style.background = '#334155';
    btn.style.border = '1px solid #475569';
    btn.style.borderRadius = '8px';
    btn.style.cursor = 'pointer';
    btn.style.color = '#fff';
    btn.style.fontWeight = '500';
    btn.onmouseover = () => btn.style.background = '#475569';
    btn.onmouseout = () => btn.style.background = '#334155';
}

function cekJawabanKuis(pilihanIndex) {
    playClickSound();
    if (pilihanIndex === soalKuis[indeksSoal].jawaban) {
        skorKuis += 10;
        playSound('win');
    } else {
        playSound('lose');
    }
    indeksSoal++;
    tampilkanSoal();
}

// Inisialisasi Kuis saat pertama kali dimuat
mulaiKuis();