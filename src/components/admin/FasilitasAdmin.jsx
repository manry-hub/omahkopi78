export default function FasilitasAdmin({ facilities = [] }) {
    const handleDelete = async (id) => {
        const ok = confirm("Yakin mau hapus kategori ini?");
        if (!ok) return;

        const res = await fetch(`/api/facility/${id}`, { method: "DELETE" });

        const data = await res.json();

        if (res.ok) {
            alert("Berhasil dihapus");
            window.location.reload();
        } else {
            alert("Gagal hapus: " + data.message);
        }
    };

    return (
        <div className="dashboard-main-body">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <h6 className="font-semibold mb-0 dark:text-white">Kelola Fasilitas</h6>
            </div>

            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <div className="card border-0">
                        <div className="card-header flex flex-wrap items-center justify-between gap-3">
                            <div></div>

                            <div className="flex flex-wrap items-center gap-3">
                                <a
                                    href="/admin/fasilitas/add"
                                    className="btn btn-sm text-white bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
                                >
                                    <i className="ri-add-line"></i> Tambah Fasilitas
                                </a>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive scroll-sm">
                                <table className="table bordered-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama</th>
                                            <th>Deskripsi</th>
                                            <th>Posisi</th>
                                            <th>Gambar</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {facilities?.length > 0 ? (
                                            facilities.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>

                                                    <td className="font-medium">{item.name}</td>

                                                    <td>
                                                        <span className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                                                            {item.desc_name || "-"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                                                            {item.position || "-"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {item.image_url ? (
                                                            <img
                                                                src={item.image_url}
                                                                alt={item.name}
                                                                className="w-12 rounded-lg object-cover border"
                                                            />
                                                        ) : (
                                                            <span className="text-neutral-500">-</span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <a
                                                                href={`/admin/fasilitas/${item.id}`}
                                                                className="w-8 h-8 bg-success-100 dark:bg-success-600/25 text-success-600 dark:text-success-400 rounded-full inline-flex items-center justify-center"
                                                            >
                                                                <iconify-icon icon="lucide:edit"></iconify-icon>
                                                            </a>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(item.id)}
                                                                className="w-8 h-8 bg-danger-100 dark:bg-danger-600/25 text-danger-600 dark:text-danger-400 rounded-full inline-flex items-center justify-center"
                                                            >
                                                                <iconify-icon icon="mingcute:delete-2-line"></iconify-icon>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-6">
                                                    Data menu masih kosong.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
