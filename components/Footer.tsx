import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        <div>
          <h3 className="text-2xl font-bold text-white">DigitalStore</h3>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            Solusi digital lengkap untuk semua kebutuhan Anda. 
            Produk berkualitas, harga terjangkau, layanan terbaik.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Beranda</a></li>
              <li><a href="#" className="hover:text-white">Produk</a></li>
              <li><a href="#" className="hover:text-white">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-white">Kontak</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Streaming</a></li>
              <li><a href="#" className="hover:text-white">Design Tools</a></li>
              <li><a href="#" className="hover:text-white">Software</a></li>
              <li><a href="#" className="hover:text-white">Paket Premium</a></li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Ikuti Kami</h4>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <FaFacebook />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <FaInstagram />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <FaTwitter />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DigitalStore. All rights reserved.
      </div>
    </footer>
  );
}
