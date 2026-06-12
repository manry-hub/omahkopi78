export default function KategoriMenu({ kategoriMenu = [] }) {
    const handleDelete = async (id) => {
        const ok = confirm("Yakin mau hapus kategori ini?");
        if (!ok) return;

        const res = await fetch(`/api/menu-categories/${id}`, { method: "DELETE" });

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
                <h6 className="font-semibold mb-0 dark:text-white">Kelola Kategori Menu</h6>
            </div>

            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <div className="card border-0">
                        <div className="card-header flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-3"></div>

                            <div className="flex flex-wrap items-center gap-3">
                                <a
                                    href="/admin/kategori-menu/add"
                                    className="btn btn-sm text-white bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
                                >
                                    <i className="ri-add-line"></i> Tambah Kategori Menu
                                </a>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive scroll-sm">
                                <table className="table bordered-table mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <div className="form-check style-check flex items-center gap-2">
                                                    <label className="form-check-label" htmlFor="checkAll">
                                                        No
                                                    </label>
                                                </div>
                                            </th>
                                            <th scope="col">nama</th>
                                            <th scope="col">keterangan</th>
                                            <th scope="col">posisi</th>
                                            <th scope="col">aksi</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {kategoriMenu?.length > 0 ? (
                                            kategoriMenu.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="form-check style-check flex items-center gap-2">
                                                            <label className="form-check-label">{index + 1}</label>
                                                        </div>
                                                    </td>

                                                    <td>{item.name}</td>

                                                    <td>
                                                        <div className="flex items-center">
                                                            <h6 className="text-base mb-0 font-medium grow">{item.description}</h6>
                                                        </div>
                                                    </td>

                                                    <td>{item.position}</td>

                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <a
                                                                href={`/admin/kategori-menu/${item.id}`}
                                                                class="w-8 h-8 bg-success-100 dark:bg-success-600/25 text-success-600 dark:text-success-400 rounded-full inline-flex items-center justify-center"
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
                                                <td colSpan="5" className="text-center py-6">
                                                    Data kategori menu masih kosong.
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
