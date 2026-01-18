export const translations = {
  // Common
  common: {
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Ubah',
    add: 'Tambah',
    search: 'Cari',
    filter: 'Filter',
    loading: 'Memuat...',
    success: 'Berhasil',
    error: 'Gagal',
    confirm: 'Konfirmasi',
    yes: 'Ya',
    no: 'Tidak',
  },

  // Auth
  auth: {
    login: 'Masuk',
    logout: 'Keluar',
    username: 'Nama Pengguna',
    password: 'Kata Sandi',
    loginSuccess: 'Login berhasil',
    loginFailed: 'Login gagal',
    invalidCredentials: 'Username atau password salah',
  },

  // POS
  pos: {
    title: 'Sistem Kasir',
    newOrder: 'Order Baru',
    cart: 'Keranjang',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Pajak',
    discount: 'Diskon',
    grandTotal: 'Total Bayar',
    addToCart: 'Tambah ke Keranjang',
    removeFromCart: 'Hapus dari Keranjakan',
    clearCart: 'Kosongkan Keranjang',
    checkout: 'Bayar',
  },

  // Orders
  orders: {
    orderNumber: 'Nomor Order',
    orderType: 'Tipe Order',
    dineIn: 'Makan di Tempat',
    takeaway: 'Bungkus',
    delivery: 'Delivery',
    status: 'Status',
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    preparing: 'Sedang Dimasak',
    ready: 'Siap',
    served: 'Sudah Disajikan',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    customerName: 'Nama Pelanggan',
    tableNumber: 'Nomor Meja',
    items: 'Item',
    quantity: 'Jumlah',
    price: 'Harga',
    notes: 'Catatan',
  },

  // Kitchen
  kitchen: {
    title: 'Dapur',
    newOrder: 'Order Baru!',
    orderReady: 'Order Siap!',
    cookingTime: 'Waktu Memasak',
    elapsed: 'Sudah',
    minutes: 'menit',
    markAsReady: 'Tandai Siap',
    markAsPreparing: 'Tandai Sedang Dimasak',
  },

  // Payment
  payment: {
    title: 'Pembayaran',
    method: 'Metode Pembayaran',
    cash: 'Tunai',
    debitCard: 'Kartu Debit',
    creditCard: 'Kartu Kredit',
    qris: 'QRIS',
    digitalWallet: 'Dompet Digital',
    amount: 'Jumlah',
    paid: 'Dibayar',
    change: 'Kembalian',
    paymentSuccess: 'Pembayaran Berhasil',
    paymentFailed: 'Pembayaran Gagal',
    printReceipt: 'Cetak Struk',
    receipt: 'Struk',
  },

  // Products
  products: {
    title: 'Produk',
    name: 'Nama Produk',
    category: 'Kategori',
    price: 'Harga',
    stock: 'Stok',
    available: 'Tersedia',
    notAvailable: 'Tidak Tersedia',
    preparationTime: 'Waktu Persiapan',
    addProduct: 'Tambah Produk',
    editProduct: 'Ubah Produk',
    deleteProduct: 'Hapus Produk',
  },

  // Tables
  tables: {
    title: 'Meja',
    tableNumber: 'Nomor Meja',
    capacity: 'Kapasitas',
    location: 'Lokasi',
    status: 'Status',
    occupied: 'Terisi',
    available: 'Tersedia',
    addTable: 'Tambah Meja',
    editTable: 'Ubah Meja',
    deleteTable: 'Hapus Meja',
  },

  // Staff
  staff: {
    title: 'Staff',
    name: 'Nama',
    email: 'Email',
    role: 'Peran',
    admin: 'Administrator',
    manager: 'Manager',
    server: 'Pelayan',
    counter: 'Kasir',
    kitchen: 'Dapur',
    active: 'Aktif',
    inactive: 'Tidak Aktif',
    addStaff: 'Tambah Staff',
    editStaff: 'Ubah Staff',
    deleteStaff: 'Hapus Staff',
  },

  // Reports
  reports: {
    title: 'Laporan',
    sales: 'Penjualan',
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
    revenue: 'Pendapatan',
    orders: 'Pesanan',
    topProducts: 'Produk Terlaris',
    exportReport: 'Ekspor Laporan',
  },

  // Validation
  validation: {
    required: 'Wajib diisi',
    invalidEmail: 'Email tidak valid',
    invalidNumber: 'Angka tidak valid',
    minLength: 'Minimal {min} karakter',
    maxLength: 'Maksimal {max} karakter',
    mustBePositive: 'Harus lebih dari 0',
  },

  // Messages
  messages: {
    deleteConfirm: 'Apakah Anda yakin ingin menghapus?',
    saveSuccess: 'Data berhasil disimpan',
    saveFailed: 'Gagal menyimpan data',
    deleteSuccess: 'Data berhasil dihapus',
    deleteFailed: 'Gagal menghapus data',
    updateSuccess: 'Data berhasil diperbarui',
    updateFailed: 'Gagal memperbarui data',
    noData: 'Tidak ada data',
    serverError: 'Terjadi kesalahan server',
    networkError: 'Koneksi internet bermasalah',
  },
}

export type TranslationKey = typeof translations
```

### File: `frontend/src/hooks/useTranslation.ts`
```typescript
import { translations } from '@/i18n/id'

export function useTranslation() {
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      value = value?.[k]
    }

    return typeof value === 'string' ? value : key
  }

  return { t }
}
