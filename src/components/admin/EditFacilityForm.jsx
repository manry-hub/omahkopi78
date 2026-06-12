import { useState } from "react";

export default function EditFacilityForm({ facility }) {
    const [name, setName] = useState(facility.name || "");
    const [descName, setDescName] = useState(facility.desc_name || "");
    const [position, setPosition] = useState(facility.position || "");
    const [imageUrl, setImageUrl] = useState(facility.image_url || "");
    const [preview, setPreview] = useState(facility.image_url || "");
    const [uploading, setUploading] = useState(false); // ✅ HARUS ADA

    const handleUploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("folder", "facilities");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            });

            const data = await res.json();

            if (!res.ok || !data.publicUrl) {
                alert("Upload gagal: " + (data.message || "Unknown error"));
                return;
            }

            setImageUrl(data.publicUrl);
            setPreview(data.publicUrl); // langsung tampil preview
        } catch (err) {
            alert("Upload gagal: " + (err.message || "Unknown error"));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            alert("Nama fasilitas wajib diisi!");
            return;
        }

        try {
            const res = await fetch(`/api/facility/${facility.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    desc_name: descName,
                    position,
                    image_url: imageUrl,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert("Gagal update fasilitas: " + (data.message || "Unknown error"));
                return;
            }

            alert("Fasilitas berhasil diupdate!");
            window.location.href = "/admin/fasilitas";
        } catch (err) {
            alert("Terjadi kesalahan: " + (err.message || "Unknown error"));
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">Edit Fasilitas</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nama */}
                    <div>
                        <label className="form-label">Nama Fasilitas</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="form-label">Deskripsi</label>
                        <textarea value={descName} onChange={(e) => setDescName(e.target.value)} className="form-control" rows={3} />
                    </div>

                    {/* Posisi */}
                    <div>
                        <label className="form-label">Posisi / Lokasi</label>
                        <div className="relative inline-block w-full">
                            <button
                                type="button"
                                className="w-full text-primary-600 focus:bg-primary-600 hover:bg-primary-700 border border-primary-600 hover:text-white focus:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-5 py-4 text-left inline-flex items-center justify-between dark:text-primary-400 dark:hover:text-white dark:focus:text-white dark:focus:ring-primary-800"
                                onClick={() => {
                                    const el = document.getElementById("menuPositionDropdown");
                                    el?.classList.toggle("hidden");
                                }}
                            >
                                {position ? (position === "left" ? "Kiri" : "Kanan") : "-- Pilih Posisi --"}
                            </button>
                            <div
                                id="menuPositionDropdown"
                                className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-2xl w-full dark:bg-gray-700"
                            >
                                <ul className="py-2 text-base text-gray-700 dark:text-gray-200">
                                    {["left", "right"].map((pos) => (
                                        <li key={pos}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPosition(pos);
                                                    document.getElementById("menuPositionDropdown")?.classList.add("hidden");
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
                        {uploading && <p className="text-sm text-gray-500 dark:text-gray-300">Uploading...</p>}
                        {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />}
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="btn bg-success-600 hover:bg-success-700 text-white rounded-lg px-5 py-[11px]"
                    >
                        Update Fasilitas
                    </button>

                    <a href="/admin/fasilitas" className="btn btn-sm text-white bg-primary-600 hover:bg-primary-700">
                        Kembali
                    </a>
                </form>
            </div>
        </div>
    );
}
