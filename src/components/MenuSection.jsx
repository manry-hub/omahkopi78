import { useState, useEffect } from "react";

export default function MenuSection({ mainCategory, category, menus = [] }) {
    const [activeId, setActiveId] = useState(null);
    useEffect(() => {
        const menuOne = menus.find((m) => m.id === 1);
        if (menuOne) {
            setActiveId(1);
        }
    }, [menus]);
    // Espresso terbuka duluan, selain itu tertutup
    const [isOpen, setIsOpen] = useState(category === "Espresso");

    const toggleMenu = (id) => {
        setActiveId(activeId === id ? null : id);
    };

    const toggleCategory = () => {
        setIsOpen((prev) => !prev);

        // optional: kalau kategori ditutup, reset item yg kebuka
        if (isOpen) setActiveId(null);
    };

    return (
        <section class="set-bg-img-section">
            <div class="container">
                <div class="ak-section-heading ak-style-1 ak-type-1">
                    <div class="ak-section-subtitle">{mainCategory}</div>

                    {/* Dropdown menyatu dengan title */}
                    <div style={{ marginTop: "15px" }}>
                        <button
                            type="button"
                            onClick={toggleCategory}
                            style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                margin: 0,
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                color: "inherit",
                            }}
                        >
                            <h2 class="ak-section-title " id={category} style={{ margin: 0 }}>
                                {category}
                            </h2>

                            <span style={{ fontSize: "18px", marginLeft: "10px" }}>{isOpen ? "▲" : "▼"}</span>
                        </button>
                    </div>
                </div>

                <div class="ak-height-65 ak-height-lg-30"></div>

                {/* Isi menu tampil kalau open */}
                {isOpen && (
                    <div class="menu-grid">
                        {menus.map((menu) => (
                            <div class="menu-item" key={menu.id}>
                                {/* HEADER */}
                                <div class="menu-item-header clickable" onClick={() => toggleMenu(menu.id)}>
                                    <h4 class="menu-title">{menu.name}</h4>

                                    <div class="food-menu-hr">
                                        <div class="food-menu-hr style-1"></div>
                                    </div>

                                    <span class="menu-price">{menu.price}k</span>
                                </div>

                                {/* DESKRIPSI */}
                                <div class="menu-item-header">
                                    <p class="menu-desc">{menu.material}</p>
                                </div>

                                {/* IMAGE (TOGGLE) */}
                                {activeId === menu.id && menu.image_url && (
                                    <div class="menu-image">
                                        <img src={menu.image_url} alt={menu.name} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
