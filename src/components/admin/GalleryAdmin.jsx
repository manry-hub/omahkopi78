export default function GalleryAdmin({ galleries = [] }) {
    const handleDelete = async (id) => {
        const ok = confirm("Yakin mau hapus gallery ini?");
        if (!ok) return;

        const res = await fetch(`/api/spot/${id}`, { method: "DELETE" });

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
                <h6 className="font-semibold mb-0 dark:text-white">Kelola Gallery</h6>
            </div>

            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <div className="card border-0">
                        <div className="card-header flex flex-wrap items-center justify-between gap-3">
                            <div></div>

                            <div className="flex flex-wrap items-center gap-3">
                                <a
                                    href="/admin/spot/add"
                                    className="btn btn-sm text-white bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
                                >
                                    <i className="ri-add-line"></i> Tambah Gallery
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
                                            <th>Gambar</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {galleries?.length > 0 ? (
                                            galleries.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>

                                                    <td className="font-medium">{item.name}</td>

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
                                                                href={`/admin/spot/${item.id}`}
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
