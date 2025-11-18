const waktu = new Date();

var app = new Vue({
  el: "#app",
  data: {
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    pengirimanList: [
      { kode: "REG", nama: "Reguler (3-5 hari)" },
      { kode: "EXP", nama: "Ekspres (1-2 hari)" },
    ],
    paket: [
      {
        kode: "PAKET-UT-001",
        nama: "PAKET IPS Dasar",
        isi: ["EKMA4116", "EKMA4115"],
        harga: 120000,
      },
      {
        kode: "PAKET-UT-002",
        nama: "PAKET IPA Dasar",
        isi: ["BIOL4201", "FISIP4001"],
        harga: 140000,
      },
    ],
    stok: [
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>",
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "<strong>Cover baru</strong>",
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah",
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder",
      },
    ],
    // Simulasi status DO (opsional fitur Tracking DO)
    tracking: {
      "DO2025-0001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE",
        tanggalKirim: "2025-08-25",
        paket: "PAKET-UT-001",
        total: 120000,
        perjalanan: [
          {
            waktu: "2025-08-25 10:12:20",
            keterangan: "Penerimaan di Loket: TANGSEL",
          },
          { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
          {
            waktu: "2025-08-26 08:44:01",
            keterangan: "Diteruskan ke Kantor Tujuan",
          },
        ],
      },
    },
    nomerDO: "",
    nomerGlobalTracking: 1,
    dataTracking: {},
    pesanError: "",
    tampilPesanError: false,
    tampilDataTracking: false,
    dataDOBaru: {
      nim: "",
      nama: "",
      status: "",
      ekspedisi: "",
      tanggalKirim: "",
      paket: "",
      total: 0,
      perjalanan: [],
    },
    kodePaket: "",
    dataPaket: {
      kode: "",
      nama: "",
      isi: [],
      harga: 0,
    },
    tampilMenuTambahDO: false,
  },
  computed: {
    daftarPerjalananPaket() {
      if (this.dataTracking.perjalanan) {
        return this.dataTracking.perjalanan
          .map((data, index) => {
            return `<div>${data.waktu}</div> <div>${data.keterangan}</div>`;
          })
          .join("");
      }
    },
    daftarIsiPaket() {
      if (this.dataPaket.isi.length != 0) {
        return this.dataPaket.isi
          .map((dt, index) => {
            const bahanAjar = this.stok.find((ba) => ba.kode == dt);
            return `
            <tr>
                <td>${index + 1}</td>
                <td>${dt}</td>
                <td>${bahanAjar.judul}</td>
            </tr>`;
          })
          .join("");
      }
    },
  },
  methods: {
    buatNomerDo() {
      this.nomerGlobalTracking++;
      const str = `DO${waktu.getFullYear()}-000${this.nomerGlobalTracking}`;
      return str;
    },
    cariDataTracking() {
      const data = this.tracking[this.nomerDO];
      if (data) {
        this.dataTracking = data;
        this.tampilDataTracking = true;
        this.dataTracking.nomerDO = this.nomerDO;
      } else {
        this.pesanError = "Data tracking tidak ditemukan";
        this.tampilDataTracking = false;
      }
    },
    formatRupiah(angka) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(angka);
    },
    tampilTambaDO() {
      if (this.tampilMenuTambahDO == false) {
        this.tampilMenuTambahDO = true;
      } else {
        this.tampilMenuTambahDO = false;
      }
    },
    tambahDO() {
      const str = `${waktu.getFullYear()}-${waktu.getMonth()}-${waktu.getDate()}`;
      this.dataDOBaru.tanggalKirim = str;
      this.tracking[this.buatNomerDo()] = this.dataDOBaru;
      this.tampilMenuTambahDO = false;
      alert("Delivery Order Sukses");
    },
    batalTambahDO() {
      this.tampilMenuTambahDO = false;
    },
  },
  watch: {
    pesanError() {
      this.tampilPesanError = true;
      setTimeout(() => {
        this.pesanError = " ";
        this.tampilPesanError = false;
      }, 1000);
    },
    kodePaket() {
      const data = this.paket.filter((p) => p.kode == this.kodePaket);
      if (data.length != 0) {
        this.dataPaket.kode = data[0].kode;
        this.dataPaket.nama = data[0].nama;
        this.dataPaket.isi = data[0].isi;
        this.dataPaket.harga = data[0].harga;

        this.dataDOBaru.paket = data[0].kode;
        this.dataDOBaru.total = data[0].harga;
      } else {
        this.dataPaket.kode = "";
        this.dataPaket.nama = "";
        this.dataPaket.isi = [];
        this.dataPaket.harga = "";
      }
    },
  },
});
