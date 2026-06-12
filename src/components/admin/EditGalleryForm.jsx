import { useState, useEffect } from "react";

export default function EditGalleryForm({ gallery }) {
    const [name, setName] = useState(gallery.name || "");
    const [imageUrl, setImageUrl] = useState(gallery.image_url || "");
    const [preview, setPreview] = useState(gallery.image_url || "");
    const [uploading, setUploading] = useState(false);

    const handleUploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("folder", "galleries");

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
            const res = await fetch(`/api/spot/${gallery.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), image_url: imageUrl }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert("Gagal update gallery: " + (data.message || "Unknown error"));
                return;
            }

            alert("Gallery berhasil diupdate!");
            window.location.href = "/admin/spot";
        } catch (err) {
            alert("Terjadi kesalahan: " + (err.message || "Unknown error"));
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5>Edit Gallery</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="form-label">Nama Gallery</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
                    </div>

                    <div>
                        <label className="form-label">Gambar</label>
                        <input type="file" accept="image/*" onChange={handleUploadImage} disabled={uploading} className="mb-2" />
                        {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />}
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="btn bg-success-600 hover:bg-success-700 text-white rounded-lg px-5 py-[11px]"
                    >
                        {uploading ? "Menyimpan..." : "Update Gallery"}
                    </button>

                    <a href="/admin/spot" className="btn btn-sm text-white bg-primary-600 hover:bg-primary-700">
                        Kembali
                    </a>
                </form>
            </div>
        </div>
    );
}
