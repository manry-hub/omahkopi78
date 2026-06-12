#!/bin/bash

# Pastikan berada di direktori project
cd /home/ughway/Debiancode/Myprojects/OmahKopi78

# Inisialisasi Git
git init

# Helper function untuk commit
do_commit() {
  local msg="$1"
  shift
  local added_files=false
  # Tambahkan setiap path
  for path in "$@"; do
    if git add "$path" 2>/dev/null; then
        # if anything was staged, we can commit
        added_files=true
    fi
  done
  
  # Check if anything is staged to prevent empty commits from failing the script
  if git diff --cached --quiet; then
    echo "Skipping commit '$msg': no changes to commit"
  else
    git commit -m "$msg"
  fi
}

# 1. init: scaffold Astro project
do_commit "init: scaffold Astro project" package.json astro.config.mjs tsconfig.json public/favicon.ico public/favicon* public/robots.txt structure.txt

# 2. chore: add dependencies for React, Clerk, and MySQL
do_commit "chore: add dependencies for React, Clerk, and MySQL" package.json pnpm-lock.yaml

# 3. feat: setup database connection utility
do_commit "feat: setup database connection utility" src/lib/db.ts .env

# 4. feat: create base layouts for public and admin
do_commit "feat: create base layouts for public and admin" src/layouts/BaseLayout.astro src/layouts/AdminLayout.astro src/layouts/LoginLayout.astro

# 5. style: add global CSS, fonts, and static assets
do_commit "style: add global CSS, fonts, and static assets" public/assets/css public/assets/fonts public/assets/img public/assets/js public/assets/sass

# 6. feat: build shared UI components for frontend
do_commit "feat: build shared UI components for frontend" src/components/Header.astro src/components/Footer.astro src/components/Preloader.astro src/components/OpeningHoursInfo.astro src/components/Testimonial.astro src/components/Profile.astro

# 7. feat: implement homepage sections and hero banner
do_commit "feat: implement homepage sections and hero banner" src/pages/index.astro src/components/MainHero.astro src/components/AboutContent.astro src/components/FunFact.astro src/components/WhyChooseUs.astro src/components/OurStory.astro src/components/RoomSection.astro src/components/VideoSection.astro src/components/VideoPopup.astro src/components/CommonHero.astro

# 8. feat: add menu page and food showcase components
do_commit "feat: add menu page and food showcase components" src/pages/menu/index.astro src/components/MenuSplitSection.astro src/components/FoodShowCase.astro src/components/MenuSection.jsx src/components/BestItem.astro src/components/BestSeller.astro

# 9. feat: implement facility and reservation pages
do_commit "feat: implement facility and reservation pages" src/pages/facility/index.astro src/pages/reservation/index.astro src/components/FacilitySection.astro src/components/BookingSystem.astro src/components/GallerySection.astro

# 10. feat: add blog and contact us static pages
do_commit "feat: add blog and contact us static pages" src/pages/blog/index.astro src/pages/blog/*.astro src/pages/contact-us/index.astro src/components/ContactSection.astro src/components/WidgetBlog.astro src/components/BlogsSection.astro

# 11. feat: integrate Clerk auth middleware for admin routes
do_commit "feat: integrate Clerk auth middleware for admin routes" src/middleware.ts astro.config.mjs

# 12. feat: build admin login page
do_commit "feat: build admin login page" src/pages/admin/login src/layouts/LoginLayout.astro src/components/admin/Login.astro

# 13. feat: implement admin dashboard UI structure
do_commit "feat: implement admin dashboard UI structure" src/pages/admin/index.astro src/components/admin/Dashboard.astro src/components/admin/SidebarAdmin.astro src/components/admin/HeaderAdmin.astro public/assets_admin

# 14. feat: add core file upload API endpoint
do_commit "feat: add core file upload API endpoint" src/pages/api/upload public/uploads

# 15. feat: build menu categories API and admin UI
do_commit "feat: build menu categories API and admin UI" src/pages/api/menu-categories src/pages/admin/kategori-menu src/components/admin/KategoriMenuAdmin.jsx

# 16. feat: build API endpoints for menu management
do_commit "feat: build API endpoints for menu management" src/pages/api/menus

# 17. feat: implement menu management UI in admin panel
do_commit "feat: implement menu management UI in admin panel" src/pages/admin/menu src/components/admin/MenuAdmin.jsx src/components/admin/AddMenuForm.jsx src/components/admin/EditMenuForm.jsx

# 18. feat: implement facility management (API & UI)
do_commit "feat: implement facility management (API & UI)" src/pages/api/facility src/pages/admin/fasilitas src/components/admin/FasilitasAdmin.jsx src/components/admin/AddFacilityForm.jsx src/components/admin/EditFacilityForm.jsx

# 19. feat: implement reservation tables management (API & UI)
do_commit "feat: implement reservation tables management (API & UI)" src/pages/api/reservation-tables src/pages/admin/meja-reservasi src/components/admin/MejaReservasiAdmin.jsx src/components/admin/AddReservationTableForm.jsx src/components/admin/EditReservationTableForm.jsx

# 20. feat: implement gallery/spot management (API & UI)
do_commit "feat: implement gallery/spot management (API & UI)" src/pages/api/spot src/pages/admin/spot src/components/admin/GalleryAdmin.jsx src/components/admin/AddGalleryForm.jsx src/components/admin/EditGalleryForm.jsx

# 21. fix: handle dynamic file extensions and paths in upload API
do_commit "fix: handle dynamic file extensions and paths in upload API" src/pages/api/upload

# 22. refactor: optimize React state logic in admin forms
do_commit "refactor: optimize React state logic in admin forms" src/components/admin/AddMenuForm.jsx src/components/admin/EditMenuForm.jsx src/components/admin/AddFacilityForm.jsx

# 23. fix: resolve hydration errors on Clerk signed-in components
do_commit "fix: resolve hydration errors on Clerk signed-in components" src/layouts/AdminLayout.astro src/components/admin/SidebarAdmin.astro

# 24. chore: add SEO optimizations and sitemap generation
do_commit "chore: add SEO optimizations and sitemap generation" package.json astro.config.mjs src/layouts/BaseLayout.astro

# 25. feat: add custom 404 error page
do_commit "feat: add custom 404 error page" src/pages/404

# 26. Final commit for everything remaining
git add .
if git diff --cached --quiet; then
  echo "No remaining files to commit."
else
  git commit -m "chore: add remaining uncommitted files and build artifacts"
fi

echo "Git simulation finished successfully."
