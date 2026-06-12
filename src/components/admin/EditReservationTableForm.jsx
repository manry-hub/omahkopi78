import { useEffect, useState } from "react";

export default function EditReservationTableForm({ reservationTables = {} }) {
    const [name, setName] = useState("");
    const [descName, setDescName] = useState("");
    const [minPay, setMinPay] = useState("");
    const [minPeople, setMinPeople] = useState("");
    const [capacity, setCapacity] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    // isi default value dari menu
    useEffect(() => {
        if (!reservationTables) return;

        setName(reservationTables.name ?? "");
        setDescName(reservationTables.desc_name ?? "");
        setMinPay(reservationTables.min_pay ? String(reservationTables.min_pay) : "");
        setMinPeople(reservationTables.min_people ? String(reservationTables.min_people) : "");
        setCapacity(reservationTables.capacity ? String(reservationTables.capacity) : "");
        setImageUrl(reservationTables.image_url ?? "");
    }, [reservationTables]);

    // =========================
    // Upload Image
    // =========================
    const handleUploadImage = async (e) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            setUploading(true);

            const fd = new FormData();
            fd.append("file", file);
            fd.append("folder", "reservation_tables");

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
        } catch (err) {
            alert("Upload gagal: " + (err.message || "Unknown error"));
        } finally {
            setUploading(false);
        }
    };

    // =========================
    // Submit Form
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !minPeople || !capacity) {
            alert("Nama, min payment, min orang, dan kapasitas wajib diisi!");
            return;
        }

        if (!imageUrl) {
            alert("Gambar wajib diupload dulu!");
            return;
        }

        setLoading(true);

        const res = await fetch(`/api/reservation-tables/${reservationTables.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                desc_name: descName,
                min_pay: Number(minPay),
                min_people: Number(minPeople),
                capacity: Number(capacity),
                image_url: imageUrl,
            }),
        });

        setLoading(false);

        if (res.ok) {
            alert("Meja reservasi berhasil diupdate!");
            window.location.href = "/admin/meja-reservasi";
        } else {
            const data = await res.json().catch(() => ({}));
            alert("Gagal update meja reservasi: " + (data.message || "Unknown error"));
        }
    };

    return (
        <div className="dashboard-main-body">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <h6 className="font-semibold mb-0 dark:text-white">Tambah Meja Reservasi</h6>
            </div>

            <div className="grid grid-cols-12">
                <div className="col-span-12 lg:col-span-8">
                    <div className="card border-0">
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Nama */}
                                <div>
                                    <label className="form-label">Nama Meja</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder='Contoh: Saung "Kandang Kebo"'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                {/* Deskripsi */}
                                <div>
                                    <label className="form-label">Deskripsi</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Deskripsi singkat meja reservasi..."
                                        value={descName}
                                        onChange={(e) => setDescName(e.target.value)}
                                    />
                                </div>

                                {/* Min Payment */}
                                <div>
                                    <label className="form-label">Minimal Payment</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Contoh: 150000"
                                        value={minPay}
                                        onChange={(e) => setMinPay(e.target.value)}
                                    />
                                </div>

                                {/* Min Orang */}
                                <div>
                                    <label className="form-label">Minimal Orang</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Contoh: 4"
                                        value={minPeople}
                                        onChange={(e) => setMinPeople(e.target.value)}
                                    />
                                </div>

                                {/* Kapasitas */}
                                <div>
                                    <label className="form-label">Kapasitas</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Contoh: 16"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                    />
                                </div>

                                {/* Upload Gambar */}
                                <div>
                                    <label className="form-label">Upload Gambar</label>

                                    <input type="file" accept="image/*" className="form-control" onChange={handleUploadImage} />

                                    {uploading && <p className="text-sm mt-2 text-gray-500 dark:text-gray-300">Uploading...</p>}

                                    {imageUrl && (
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Preview:</p>
                                            <img
                                                src={imageUrl}
                                                alt="preview"
                                                className="w-40 h-40 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn bg-success-600 hover:bg-success-700 text-white rounded-lg px-5 py-[11px]"
                                >
                                    {loading ? "Menyimpan..." : "Simpan Meja Reservasi"}
                                </button>

                                <a href="/admin/meja-reservasi" className="btn btn-sm text-white bg-primary-600 hover:bg-primary-700">
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
