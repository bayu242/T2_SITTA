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
    edit_bahan_ajar: false,
    index_bahan_ajar: 0,
    data_stok: 0,
    filterUpbjj: "",
    filterKategori: "",
    filterStok: false,
    jenisPengurutan: "",
    modePengurutan: "menaik",
    tambahBahanAjar: false,
    bahanAjarBaru: {
      kode: "",
      judul: "",
      kategori: "",
      upbjj: "",
      lokasiRak: "",
      harga: 0,
      qty: 0,
      safety: 0,
      catatanHTML: "",
    },
    pesanError: "",
  },
  computed: {
    filterSortDataStok() {
      let dataBahanAjar = [...this.stok];

      //   filter
      if (this.filterUpbjj) {
        dataBahanAjar = dataBahanAjar.filter(
          (data) => data.upbjj == this.filterUpbjj
        );
      }
      if (this.filterKategori) {
        dataBahanAjar = dataBahanAjar.filter(
          (data) => data.kategori == this.filterKategori
        );
      }
      if (this.filterStok) {
        dataBahanAjar = dataBahanAjar.filter(
          (data) => (data.qty <= data.safety) | (data.qty == 0)
        );
      }
      //   Urut

      if (this.jenisPengurutan) {
        let modifier = 1;
        if (this.modePengurutan == "menurun") {
          modifier = -1;
        } else {
          modifier = 1;
        }

        dataBahanAjar = dataBahanAjar.sort((a, b) => {
          let valA = a[this.jenisPengurutan];
          let valB = b[this.jenisPengurutan];

          if (
            (this.jenisPengurutan == "qty") |
            (this.jenisPengurutan == "stok")
          ) {
            valA = Number(valA);
            valB = Number(valB);
          } else if (this.jenisPengurutan == "judul") {
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
          }

          if (valA < valB) {
            return -1 * modifier;
          }
          if (valA > valB) {
            return 1 * modifier;
          }
          return 0;
        });
      }

      return dataBahanAjar
        .map((bahanAjar, index) => {
          return `
        <div class="bahan-ajar" key=${index}>
          <div class="judul">
            <span><strong>Judul : </strong></span>
            <span>${bahanAjar.judul}</span>
            <span>(${bahanAjar.kode})</span>
          </div>
          <div class="detail">
            <div><strong>Kategori : </strong> ${bahanAjar.kategori}</div>
            <div><strong>UPBJJ : </strong> ${bahanAjar.upbjj}</div>
            <div><strong>Lokasi Rak : </strong> ${bahanAjar.lokasiRak}</div>
            <div>
              <strong>Jumlah Stok Bahan Ajar : </strong> ${bahanAjar.qty}
            </div>
            <div>
              <strong>Jumlah Safety Stok Bahan Ajar : </strong> ${
                bahanAjar.safety
              }
            </div>
            <div class=${this.status(bahanAjar.qty, bahanAjar.safety)}>
              <strong>Status : </strong> ${this.status(
                bahanAjar.qty,
                bahanAjar.safety
              )}
            </div>
          </div>
          <div><strong>Harga : </strong>${this.formatRupiah(
            bahanAjar.harga
          )}</div>
          <div class="catatan">
            <strong>Catatan : </strong>
            <div>${bahanAjar.catatanHTML}</div>
          </div>
        </div>`;
        })
        .join("");
    },
    daftarEditBahanAjar() {
      return this.stok.map((data, index) => {
        return `<option value=${index}>${data.judul} (${data.kode})</option>`;
      });
    },
  },
  methods: {
    status(stokBahanAjar, stokSafetyBahanAjar) {
      if (stokBahanAjar >= stokSafetyBahanAjar) {
        return "Aman";
      } else if (stokBahanAjar < stokSafetyBahanAjar && stokBahanAjar != 0) {
        return "Menipis";
      } else {
        return "Kosong";
      }
    },
    editStok() {
      if (!this.edit_bahan_ajar) {
        this.edit_bahan_ajar = true;
      } else {
        this.edit_bahan_ajar = false;
      }
    },
    simpanEditStok() {
      this.stok[this.index_bahan_ajar].qty = this.data_stok;
      alert(
        `stok bahan ajar ${
          this.stok[this.index_bahan_ajar].judul
        } berhasil dirubah`
      );
      this.edit_bahan_ajar = false;
      this.data_stok = 0;
    },
    batalEditStok() {
      this.data_stok = 0;
      this.edit_bahan_ajar = false;
    },
    formatRupiah(angka) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(angka);
    },
    resetFilter() {
      this.filterUpbjj = "";
      this.filterKategori = "";
      this.filterStok = false;
    },
    tampilkanFormTambahBahanAjar() {
      if (this.tambahBahanAjar == false) {
        this.tambahBahanAjar = true;
      } else {
        this.tambahBahanAjar = false;
      }
    },
    simpanBahanAjarBaru() {
      const data = this.bahanAjarBaru;

      if (this.pesanError == true) {
        this.stok.push(data);
      } else {
        alert("Periksa Kembali");
      }
    },
    batalTambahBahanAjar() {
      this.tambahBahanAjar = false;
    },
  },
  watch: {
    bahanAjarBaru: {
      handler(dataBaru) {
        if (dataBaru.judul == "") {
          this.pesanError = "Judul belum terisi";
        } else if (dataBaru.kode == "") {
          this.pesanError = "Kode belum terisi";
        } else if (dataBaru.kategori == "") {
          this.pesanError = "Kategori belum dipilih";
        } else if (dataBaru.upbjj == "") {
          this.pesanError = "UT-Daerah belum dipilih";
        } else if (dataBaru.lokasiRak == "") {
          this.pesanError = "Lokasi RAK belum terisi";
        } else if (dataBaru.harga == 0) {
          this.pesanError = "Harga belum terisi";
        } else if (dataBaru.qty == 0) {
          this.pesanError = "Stok belum terisi";
        } else if (dataBaru.safety == 0) {
          this.pesanError = "Stok safety belum terisi";
        } else if (
          dataBaru.judul &&
          dataBaru.kode &&
          dataBaru.kategori &&
          dataBaru.upbjj &&
          dataBaru.lokasiRak &&
          dataBaru.harga &&
          dataBaru.qty &&
          dataBaru.safety
        ) {
          this.pesanError = true;
        } else {
          this.pesanError = false;
        }
      },
      deep: true,
    },
  },
});
