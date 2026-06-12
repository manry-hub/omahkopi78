import { useState } from "react";

export default function AddFacilityForm() {
    const [name, setName] = useState("");
    const [descName, setDescName] = useState("");
    const [position, setPosition] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);

    // Upload gambar ke API
    const handleUploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("folder", "facilities"); // 🔥 ini penting

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

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Nama fasilitas wajib diisi!");
            return;
        }

        if (!["left", "right"].includes(position)) {
            alert("Posisi harus dipilih!");
            return;
        }

        try {
            const res = await fetch("/api/facility", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    desc_name: descName,
                    position,
                    image_url: imageUrl,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Gagal menambahkan fasilitas: " + (data.message || "Unknown error"));
                return;
            }

            alert("Fasilitas berhasil ditambahkan!");
            window.location.href = "/admin/fasilitas";
        } catch (err) {
            alert("Terjadi kesalahan: " + (err.message || "Unknown error"));
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">Tambah Fasilitas</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nama */}
                    <div>
                        <label className="form-label">Nama Fasilitas</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Contoh: Pendopo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="form-label">Deskripsi</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            placeholder="Deskripsi fasilitas..."
                            value={descName}
                            onChange={(e) => setDescName(e.target.value)}
                        />
                    </div>

                    {/* Posisi / Lokasi */}
                    <div>
                        <label className="form-label">Posisi / Lokasi</label>
                        <div className="relative inline-block w-full">
                            <button
                                type="button"
                                className="w-full text-primary-600 focus:bg-primary-600 hover:bg-primary-700 border border-primary-600 hover:text-white focus:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-5 py-4 text-left inline-flex items-center justify-between dark:text-primary-400 dark:hover:text-white dark:focus:text-white dark:focus:ring-primary-800"
                                onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
                            >
                                {position ? (position === "left" ? "Kiri" : "Kanan") : "-- Pilih Posisi --"}

                                <svg
                                    className="w-2.5 h-2.5 ms-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>

                            <div
                                className={`z-10 absolute w-full bg-white divide-y divide-gray-100 rounded-lg shadow-2xl dark:bg-gray-700 ${
                                    positionDropdownOpen ? "" : "hidden"
                                }`}
                            >
                                <ul className="py-2 text-base text-gray-700 dark:text-gray-200">
                                    {["left", "right"].map((pos) => (
                                        <li key={pos}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPosition(pos);
                                                    setPositionDropdownOpen(false);
                                                }}
                                                className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                {pos === "left" ? "Kiri" : "Kanan"}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Gambar */}
                    <div>
                        <label className="block mb-1 font-medium">Gambar</label>
                        <input type="file" accept="image/*" onChange={handleUploadImage} className="mb-2" disabled={uploading} />
                        {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />}
                    </div>

                    {/* Submit */}
                    <div>
                        <button type="submit" className="btn btn-primary hover:bg-primary-700 text-white px-4 py-2 rounded-lg" disabled={uploading}>
                            {uploading ? "Uploading..." : "Tambah Fasilitas"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
