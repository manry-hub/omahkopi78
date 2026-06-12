import { useState } from "react";

export default function AddGalleryForm() {
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);

    // Upload gambar ke API
    const handleUploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("folder", "galleries"); // 🔥 ini penting

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

        if (!name.trim()) {
            alert("Nama gallery wajib diisi!");
            return;
        }

        try {
            const res = await fetch("/api/spot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), image_url: imageUrl }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Gagal menambahkan gallery: " + (data.message || "Unknown error"));
                return;
            }

            alert("Gallery berhasil ditambahkan!");
            window.location.href = "/admin/spot";
        } catch (err) {
            alert("Terjadi kesalahan: " + (err.message || "Unknown error"));
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">Tambah Gallery</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="form-label">Nama Gallery</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            placeholder="Contoh: Spot Foto"
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label">Gambar</label>
                        <input type="file" accept="image/*" onChange={handleUploadImage} className="mb-2" disabled={uploading} />
                        {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />}
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                        {uploading ? "Uploading..." : "Tambah Gallery"}
                    </button>
                </form>
            </div>
        </div>
    );
}
