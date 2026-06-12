import { useState } from "react";

export default function AddMenuForm({ categories = [] }) {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [material, setMaterial] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [preview, setPreview] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("folder", "menus"); // 🔥 ini penting

            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Upload gagal: " + (data.message || "Unknown error"));
                return;
            }

            setImageUrl(data.publicUrl);
            setPreview(data.publicUrl);
        } catch (err) {
            alert("Upload gagal: " + (err.message || "Unknown error"));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !categoryId || !price) {
            alert("Nama, kategori, dan harga wajib diisi!");
            return;
        }

        if (!imageUrl) {
            alert("Gambar wajib diupload dulu!");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/menus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                category_id: Number(categoryId),
                price: Number(price),
                material,
                is_favorite: isFavorite,
                image_url: imageUrl,
            }),
        });

        setLoading(false);

        if (res.ok) {
            alert("Menu berhasil ditambahkan!");
            window.location.href = "/admin/menu";
        } else {
            const data = await res.json().catch(() => ({}));
            alert("Gagal tambah menu: " + (data.message || "Unknown error"));
        }
    };

    const selectedCategoryName = categoryId ? categories.find((c) => String(c.id) === String(categoryId))?.name : null;

    return (
        <div className="dashboard-main-body">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <h6 className="font-semibold mb-0 dark:text-white">Tambah Menu</h6>
            </div>

            <div className="grid grid-cols-12">
                <div className="col-span-12 lg:col-span-8">
                    <div className="card border-0">
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Nama */}
                                <div>
                                    <label className="form-label">Nama Menu</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Contoh: Kopi Susu Gula Aren"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                {/* Kategori */}
                                <div>
                                    <label className="form-label">Kategori</label>

                                    {/* Dropdown Start */}
                                    <div className="relative inline-block w-full">
                                        <button
                                            type="button"
                                            data-dropdown-toggle="menuCategoryDropdown"
                                            data-dropdown-placement="bottom"
                                            className="w-full text-primary-600 focus:bg-primary-600 hover:bg-primary-700 border border-primary-600 hover:text-white focus:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-5 py-4 text-left inline-flex items-center justify-between dark:text-primary-400 dark:hover:text-white dark:focus:text-white dark:focus:ring-primary-800"
                                        >
                                            {categoryId ? categories.find((c) => String(c.id) === String(categoryId))?.name : "-- Pilih Kategori --"}

                                            <svg
                                                className="w-2.5 h-2.5 ms-3"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="m1 1 4 4 4-4"
                                                />
                                            </svg>
                                        </button>

                                        {/* Dropdown menu */}
                                        <div
                                            id="menuCategoryDropdown"
                                            className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-2xl w-full dark:bg-gray-700"
                                        >
                                            <ul className="py-2 text-base text-gray-700 dark:text-gray-200">
                                                {categories.map((cat) => (
                                                    <li key={cat.id}>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCategoryId(String(cat.id));
                                                                document.getElementById("menuCategoryDropdown")?.classList.add("hidden");
                                                            }}
                                                            className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        >
                                                            {cat.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    {/* Dropdown End */}
                                </div>

                                {/* Harga */}
                                <div>
                                    <label className="form-label">Harga</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Contoh: 18000"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                {/* Material */}
                                <div>
                                    <label className="form-label">Material</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="isi dari menu..."
                                        value={material}
                                        onChange={(e) => setMaterial(e.target.value)}
                                    />
                                </div>

                                {/* Deskripsi */}
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={isFavorite} onChange={(e) => setIsFavorite(e.target.checked)} />
                                    <label>Jadikan Menu Favorite</label>
                                </div>

                                {/* Upload Gambar */}
                                <div>
                                    <label className="form-label">Upload Gambar</label>

                                    <input type="file" accept="image/*" className="form-control" onChange={handleUploadImage} />

                                    {uploading && <p className="text-sm mt-2 text-gray-500 dark:text-gray-300">Uploading...</p>}

                                    {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn bg-success-600 hover:bg-success-700 text-white rounded-lg px-5 py-[11px]"
                                >
                                    {loading ? "Menyimpan..." : "Simpan Menu"}
                                </button>

                                <a href="/admin/menu" className="btn btn-sm text-white bg-primary-600 hover:bg-primary-700">
                                    Kembali
                                </a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
