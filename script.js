function hitung() {
    // Ambil nilai waktu (t) dari input dan konversi ke float
    const t = parseFloat(document.getElementById("time").value);
    
    // Ambil persamaan dari input
    let persamaan = document.getElementById("persamaan").value;

    // Validasi input: pastikan persamaan tidak kosong dan t adalah angka
    if (!persamaan || isNaN(t)) {
        alert("Pastikan persamaan dan waktu sudah diisi dengan benar.");
        return;
    }

    // Menambahkan tanda * untuk perkalian yang hilang dan mengganti ^ menjadi ** untuk eksponen
    const persamaanAsli = persamaan; // Simpan persamaan asli untuk ditampilkan
    persamaan = persamaan
        .replace(/([0-9])([t])/g, "$1*$2")  // Tambahkan * antara angka dan t
        .replace(/([t])(\^)/g, "$1**");    // Ganti ^ dengan ** untuk JavaScript

    try {
        // Evaluasi persamaan posisi dengan mengganti t pada persamaan
        const posisi = eval(persamaan.replace(/t/g, `(${t})`));

        // Hitung turunan dari persamaan
        const turunanPersamaan = hitungTurunan(persamaan);

        // Evaluasi turunan untuk mendapatkan kecepatan
        const kecepatan = eval(turunanPersamaan.replace(/t/g, `(${t})`));

        // Menampilkan hasil kecepatan dan pembahasan
        document.getElementById("posisi").innerHTML = ""; // Kosongkan elemen posisi (tidak digunakan)
        document.getElementById("kecepatan").innerHTML = `
            <strong>Kecepatan Kendaraan:</strong> Pada t = ${t} detik, kecepatan kendaraan adalah ${kecepatan} m/s.<br>
            <strong>Pembahasan:</strong>
            <ul>
                <li>Persamaan posisi kendaraan: <em>${persamaanAsli}</em></li>
                <li>Turunan posisi kendaraan (kecepatan): <em>${turunanPersamaan.replace(/\*\*/g, "^").replace(/\*\*/g, "")}</em></li>
                <li>Substitusi t = ${t} ke turunan posisi kendaraan: <em>${turunanPersamaan.replace(/\*\*/g, "^").replace(/t/g, t)}</em></li>
                <li>Hasil (dalam m/s): ${kecepatan} m/s</li>
            </ul>
            <br>
            <strong>Konversi Kecepatan ke km/jam:</strong>
            <p>Kecepatan dalam satuan m/s dikonversi menjadi km/jam dengan mengalikan hasil kecepatan (m/s) dengan <strong>3.6</strong>, karena:</p>
            <ul>
                <li>1 meter = <span class="fraction"><span class="numerator">1</span><span class="denominator">1000</span></span> kilometer (m ke km)</li>
                <li>1 detik = <span class="fraction"><span class="numerator">1</span><span class="denominator">3600</span></span> jam (s ke jam)</li>
                <li>Sehingga, 1 m/s = 3.6 km/jam</li>
            </ul>
            <strong>Kecepatan dalam km/jam: </strong> ${kecepatan * 3.6} km/jam
        `;
    } catch (error) {
        // Tangani kesalahan pada format persamaan
        alert("Terjadi kesalahan dalam menghitung persamaan. Pastikan format persamaan benar.");
    }
}

function hitungTurunan(persamaan) {
    // Menangani persamaan dengan tanda + dan - dengan cara yang benar
    const suku = persamaan.replace(/ - /g, " + -").split("+").map(s => s.trim());
    let turunan = [];

    // Iterasi setiap suku untuk menghitung turunannya
    suku.forEach((s) => {
        // Ekspresi reguler untuk memisahkan koefisien, variabel t, dan pangkatnya
        const regex = /([+-]?\d*\.?\d+)?\*?t(?:\*\*([0-9]+))?/;
        const match = s.match(regex);

        if (match) {
            const koefisien = parseFloat(match[1] || "1"); // Ambil koefisien, default 1
            const pangkat = parseFloat(match[2] || "1");   // Ambil pangkat, default 1

            if (pangkat > 1) {
                // Jika pangkat > 1, turunkan dengan aturan pangkat
                turunan.push(`${koefisien * pangkat}*t**${pangkat - 1}`);
            } else if (pangkat === 1) {
                // Jika pangkat 1, hasilkan hanya koefisien
                turunan.push(`${koefisien}`);
            }
        } else if (!s.includes("t")) {
            // Abaikan suku konstanta (tanpa variabel t)
        } else {
            // Jika regex gagal, masukkan suku apa adanya (fallback)
            turunan.push(s);
        }
    });

    // Gabungkan kembali turunan menjadi string persamaan dan perbaiki tanda + dan -
    let hasil = turunan.join(" + ");
    hasil = hasil.replace(/\+ -/g, "- ").replace(/^-/g, "-");
    return hasil;
}


