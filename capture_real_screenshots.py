import os
import sys
import time
import json
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = r"d:\ITC-SV\laragon\www\NguyenNgocHaThao_501250482\screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

ADMIN_USER = {
    "id": 1,
    "username": "admin",
    "password": "admin123",
    "fullname": "Quản Trị Viên VIP",
    "email": "admin@cineticket.vn",
    "phone": "0909123456",
    "role": "admin"
}

MEMBER_USER = {
    "id": 2,
    "username": "hathao",
    "password": "123456",
    "fullname": "Nguyễn Ngọc Hà Thảo",
    "email": "hathao@cineticket.vn",
    "phone": "0337191740",
    "role": "member"
}

SAMPLE_CART = [
    {
        "id": 1,
        "title": "Avatar 2: Dòng Chảy Của Nước",
        "genre_name": "Khoa Học Viễn Tưởng",
        "image": "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
        "price": 120000,
        "qty": 2
    },
    {
        "id": 2,
        "title": "Mai (Trấn Thành)",
        "genre_name": "Tâm Lý, Tình Cảm",
        "image": "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
        "price": 95000,
        "qty": 1
    }
]

SAMPLE_BOOKING = {
    "movieId": 1,
    "showtimeId": 101,
    "cinemaName": "CineTicket Quận 1 VIP",
    "seats": ["F07", "F08"],
    "snacks": [
        {"id": 1, "name": "Combo Bắp Phô Mai & Nước Ngọt VIP", "price": 85000, "qty": 1}
    ]
}

def capture_all():
    print("Starting capture of 100% REAL CineTicket web screenshots...")
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport={"width": 1400, "height": 880})
        page = context.new_page()

        # 1. Trang chu (Homepage)
        print("1. Capturing Homepage...")
        page.goto("http://localhost:5173/", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "01_trang_chu.png"))

        # 2. Danh sach phim (Movie List & Filter)
        print("2. Capturing Movie List & Filter...")
        page.goto("http://localhost:5173/movies", wait_until="networkidle")
        time.sleep(1.2)
        page.evaluate("window.scrollTo(0, 160)")
        time.sleep(0.4)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "02_danh_sach_phim.png"))

        # 3. Chi tiet phim Avatar 2 (Movie Detail)
        print("3. Capturing Movie Detail...")
        page.goto("http://localhost:5173/movie/1", wait_until="networkidle")
        time.sleep(1.2)
        page.evaluate("window.scrollTo(0, 140)")
        time.sleep(0.4)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "03_chi_tiet_phim.png"))

        # 4. So do chon ghe (Seat Selection)
        print("4. Capturing Seat Selection...")
        page.goto("http://localhost:5173/seat", wait_until="networkidle")
        time.sleep(1.2)
        try:
            seats = page.locator(".seat-cell:not(.seat-occupied)")
            if seats.count() >= 12:
                seats.nth(10).click()
                time.sleep(0.3)
                seats.nth(11).click()
                time.sleep(0.3)
        except Exception as e:
            print("Note on seat click:", e)
        page.evaluate("window.scrollTo(0, 100)")
        time.sleep(0.3)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "04_so_do_chon_ghe.png"))

        # 5. Chon bap nuoc (Snack Selection)
        print("5. Capturing Snack Selection...")
        page.goto("http://localhost:5173/snack", wait_until="networkidle")
        time.sleep(1.2)
        try:
            plus_btns = page.locator("button:has-text('+')")
            if plus_btns.count() > 0:
                plus_btns.first.click()
                time.sleep(0.3)
        except Exception as e:
            print("Note on snack click:", e)
        page.evaluate("window.scrollTo(0, 120)")
        time.sleep(0.3)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "05_chon_bap_nuoc.png"))

        # 6. Gio hang (Cart with populated items)
        print("6. Capturing Cart with items...")
        cart_json = json.dumps(SAMPLE_CART)
        page.goto("http://localhost:5173/", wait_until="networkidle")
        page.evaluate(f"localStorage.setItem('cineticket_cart', JSON.stringify({cart_json}));")
        page.goto("http://localhost:5173/cart", wait_until="networkidle")
        time.sleep(1.2)
        page.evaluate("window.scrollTo(0, 140)")
        time.sleep(0.3)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "06_gio_hang.png"))

        # 7. Thanh toan VietQR (Payment)
        print("7. Capturing Payment Gateway with VietQR...")
        booking_json = json.dumps(SAMPLE_BOOKING)
        user_json = json.dumps(MEMBER_USER)
        page.evaluate(f"""() => {{
            localStorage.setItem('cineticket_current_booking', JSON.stringify({booking_json}));
            localStorage.setItem('cineticket_user', JSON.stringify({user_json}));
            sessionStorage.setItem('cineticket_user', JSON.stringify({user_json}));
        }}""")
        page.goto("http://localhost:5173/payment", wait_until="networkidle")
        time.sleep(1.4)
        # Scroll down so the VietQR code, bank info and copy buttons are prominent
        page.evaluate("window.scrollTo(0, 320)")
        time.sleep(0.5)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "07_thanh_toan_vietqr.png"))

        # 8. Ve dien tu / Dat ve thanh cong (Order Success VIP Pass)
        print("8. Capturing E-Ticket VIP Pass...")
        page.goto("http://localhost:5173/order-success/99120", wait_until="networkidle")
        time.sleep(1.2)
        page.evaluate("window.scrollTo(0, 140)")
        time.sleep(0.3)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "08_ve_dien_tu_thanh_cong.png"))

        # 9. Lich su dat ve (My Orders)
        print("9. Capturing My Orders...")
        page.goto("http://localhost:5173/myorders", wait_until="networkidle")
        time.sleep(1.2)
        page.evaluate("window.scrollTo(0, 120)")
        time.sleep(0.3)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "09_lich_su_dat_ve.png"))

        # 10. Quan ly tai khoan ca nhan (Account)
        print("10. Capturing Account Management...")
        page.goto("http://localhost:5173/account", wait_until="networkidle")
        time.sleep(1.2)
        page.evaluate("window.scrollTo(0, 100)")
        time.sleep(0.3)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "10_quan_ly_tai_khoan.png"))

        # 11. Dang nhap (Login)
        print("11. Capturing Login Page...")
        page.evaluate("""() => {
            localStorage.removeItem('cineticket_user');
            sessionStorage.removeItem('cineticket_user');
        }""")
        page.goto("http://localhost:5173/login", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "11_dang_nhap.png"))

        # 12. Admin Dashboard - Thong ke KPI
        print("12. Capturing Admin Dashboard (Overview)...")
        admin_json = json.dumps(ADMIN_USER)
        page.evaluate(f"""() => {{
            localStorage.setItem('cineticket_user', JSON.stringify({admin_json}));
            sessionStorage.setItem('cineticket_user', JSON.stringify({admin_json}));
        }}""")
        page.goto("http://localhost:5173/admin", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "12_admin_thong_ke.png"))

        # 13. Admin Dashboard - Quan ly phim
        print("13. Capturing Admin Movies Management...")
        try:
            movie_tab = page.locator("button:has-text('Quản Lý Phim')").first
            if movie_tab.count() > 0:
                movie_tab.click(force=True)
                time.sleep(0.8)
        except Exception as e:
            print("Note on movie tab:", e)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "13_admin_quan_ly_phim.png"))

        # 14. Admin Dashboard - Cai dat ma QR Admin
        print("14. Capturing Admin QR Settings Tab...")
        try:
            qr_tab = page.locator("button:has-text('Cài Đặt Mã QR Admin')").first
            if qr_tab.count() > 0:
                qr_tab.click(force=True)
                time.sleep(0.8)
        except Exception as e:
            print("Note on QR tab:", e)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "14_admin_cai_dat_qr.png"))

        # 15. Trang Lien He & Ban do (Contact)
        print("15. Capturing Contact Page...")
        page.goto("http://localhost:5173/contact", wait_until="networkidle")
        time.sleep(1.2)
        page.evaluate("window.scrollTo(0, 140)")
        time.sleep(0.3)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "15_trang_lien_he.png"))

        browser.close()
        print("SUCCESS: All 15 real screenshots captured successfully!")

if __name__ == "__main__":
    capture_all()
