import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

sys.stdout.reconfigure(encoding='utf-8')

SCREENSHOT_DIR = r"d:\ITC-SV\laragon\www\NguyenNgocHaThao_501250482\screenshots"
OUTPUT_PPTX    = r"d:\ITC-SV\laragon\www\NguyenNgocHaThao_501250482\BaoCao_ChucNang_CineTicket.pptx"

FONT_NAME  = "Times New Roman"
FONT_BODY  = Pt(16)
FONT_HEAD  = Pt(20)
FONT_TAG   = Pt(13)

BG_COLOR     = RGBColor(11,  14,  23)
CARD_BG      = RGBColor(18,  23,  37)
GOLD_ACCENT  = RGBColor(243, 207, 122)
GOLD_DARK    = RGBColor(212, 175,  55)
EMERALD      = RGBColor(16,  185, 129)
CYAN         = RGBColor(56,  189, 248)
WHITE        = RGBColor(255, 255, 255)
GRAY_TEXT    = RGBColor(210, 215, 225)
BORDER_COLOR = RGBColor(40,   50,  75)


def apply_background(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_COLOR
    bg.line.fill.background()


def add_header(slide, slide_num, category, title):
    # Tag line
    tag = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(12), Inches(0.4))
    tf = tag.text_frame
    p = tf.paragraphs[0]
    p.text = f"CINETICKET VIP  •  CHỨC NĂNG #{slide_num:02d}  •  {category.upper()}"
    p.font.name  = FONT_NAME
    p.font.size  = FONT_TAG
    p.font.bold  = True
    p.font.color.rgb = GOLD_ACCENT

    # Main title
    tbox = slide.shapes.add_textbox(Inches(0.5), Inches(0.68), Inches(12), Inches(0.72))
    tf2 = tbox.text_frame
    tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.text = title
    p2.font.name  = FONT_NAME
    p2.font.size  = FONT_HEAD
    p2.font.bold  = True
    p2.font.color.rgb = WHITE

    # Gold divider line (thin rectangle)
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.5), Inches(1.42), Inches(12.333), Inches(0.04))
    line.fill.solid()
    line.fill.fore_color.rgb = GOLD_DARK
    line.line.fill.background()


def add_feature_card(slide, bullets):
    """Left panel: keyword bullet list (no summary note)."""
    card = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.55), Inches(5.6), Inches(5.6))
    card.fill.solid()
    card.fill.fore_color.rgb = CARD_BG
    card.line.color.rgb = BORDER_COLOR
    card.line.width = Pt(1.2)

    tb = slide.shapes.add_textbox(Inches(0.6), Inches(1.7), Inches(5.2), Inches(5.3))
    tf = tb.text_frame
    tf.word_wrap = True

    # Section label
    p0 = tf.paragraphs[0]
    p0.text = "CHỨC NĂNG CHÍNH"
    p0.font.name  = FONT_NAME
    p0.font.size  = Pt(14)
    p0.font.bold  = True
    p0.font.color.rgb = GOLD_ACCENT
    p0.space_after = Pt(10)

    for bullet in bullets:
        p = tf.add_paragraph()
        p.text = f"▸  {bullet}"
        p.font.name  = FONT_NAME
        p.font.size  = FONT_BODY
        p.font.color.rgb = GRAY_TEXT
        p.space_after = Pt(8)


def add_screenshot(slide, image_filename, caption):
    img_path = os.path.join(SCREENSHOT_DIR, image_filename)
    if not os.path.exists(img_path):
        print(f"  [WARN] Image not found: {img_path}")
        return

    # Frame
    frame = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.3), Inches(1.55), Inches(6.6), Inches(5.6))
    frame.fill.solid()
    frame.fill.fore_color.rgb = CARD_BG
    frame.line.color.rgb = GOLD_DARK
    frame.line.width = Pt(1.5)

    # Image
    slide.shapes.add_picture(img_path, Inches(6.45), Inches(1.70), width=Inches(6.3))

    # Caption
    cap = slide.shapes.add_textbox(Inches(6.45), Inches(6.38), Inches(6.3), Inches(0.4))
    tf = cap.text_frame
    p = tf.paragraphs[0]
    p.text = f"📸  {caption}"
    p.alignment = PP_ALIGN.CENTER
    p.font.name  = FONT_NAME
    p.font.size  = Pt(13)
    p.font.bold  = True
    p.font.color.rgb = GOLD_ACCENT


# ===========================================================================
def build_presentation():
    prs = Presentation()
    prs.slide_width  = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    # ── SLIDE 1: BÌA ──────────────────────────────────────────────────────
    s1 = prs.slides.add_slide(blank)
    apply_background(s1)

    cover = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                Inches(1.0), Inches(0.8), Inches(11.333), Inches(5.9))
    cover.fill.solid()
    cover.fill.fore_color.rgb = CARD_BG
    cover.line.color.rgb = GOLD_DARK
    cover.line.width = Pt(2)

    tb = s1.shapes.add_textbox(Inches(1.4), Inches(1.1), Inches(10.5), Inches(5.4))
    tf = tb.text_frame
    tf.word_wrap = True

    def row(tf, txt, size, bold, color, align=PP_ALIGN.CENTER, after=0):
        p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
        p.text = txt
        p.alignment = align
        p.font.name  = FONT_NAME
        p.font.size  = Pt(size)
        p.font.bold  = bold
        p.font.color.rgb = color
        p.space_after = Pt(after)
        return p

    p = tf.paragraphs[0]
    p.text = "BÁO CÁO TỔNG QUAN HỆ THỐNG & CHỨC NĂNG"
    p.alignment = PP_ALIGN.CENTER
    p.font.name  = FONT_NAME
    p.font.size  = Pt(16)
    p.font.bold  = True
    p.font.color.rgb = GOLD_ACCENT
    p.space_after = Pt(10)

    for txt, sz, bold, color, after in [
        ("CINETICKET VIP CINEMA",                                           34, True,  WHITE,       6),
        ("Hệ Thống Đặt Vé Xem Phim Trực Tuyến & Cổng Thanh Toán Mã QR",   16, False, CYAN,       30),
        ("Sinh viên: Nguyễn Ngọc Hà Thảo  |  MSSV: 501250482",            16, True,  WHITE,       8),
        ("Giảng viên hướng dẫn: Trần Duy Phương",                          16, False, GRAY_TEXT,   8),
        ("Trụ sở: 12 Trịnh Đình Thảo, Tân Phú, TP.HCM  |  0337191740",   16, False, GRAY_TEXT,   8),
        ("Email Admin: hthaongn@gmail.com",                                 16, True,  GOLD_ACCENT, 0),
    ]:
        p2 = tf.add_paragraph()
        p2.text = txt
        p2.alignment = PP_ALIGN.CENTER
        p2.font.name  = FONT_NAME
        p2.font.size  = Pt(sz)
        p2.font.bold  = bold
        p2.font.color.rgb = color
        p2.space_after = Pt(after)

    # ── SLIDE 2: TRANG CHỦ ────────────────────────────────────────────────
    s2 = prs.slides.add_slide(blank)
    apply_background(s2)
    add_header(s2, 1, "Trang Chủ", "TRANG CHỦ (HOME PAGE)  –  /")
    add_feature_card(s2, [
        "Banner Hero Slider – bom tấn nổi bật",
        "Phim Đang Chiếu / Phim Sắp Chiếu",
        "Bộ lọc thể loại tức thì",
        "Top Trending – xếp hạng lượng vé",
        "Header điều hướng & Footer thông tin",
    ])
    add_screenshot(s2, "01_trang_chu.png", "Giao diện Trang chủ CineTicket VIP")

    # ── SLIDE 3: DANH MỤC PHIM ────────────────────────────────────────────
    s3 = prs.slides.add_slide(blank)
    apply_background(s3)
    add_header(s3, 2, "Danh Mục Phim", "DANH MỤC LỊCH CHIẾU & BỘ LỌC THỂ LOẠI  –  /movies")
    add_feature_card(s3, [
        "Toàn bộ kho phim kèm poster & thông số",
        "Lọc nhanh theo thể loại (Hành động, Viễn tưởng…)",
        "Tìm kiếm phim theo tên / đạo diễn",
        "Điểm IMDb, thời lượng, độ tuổi (T13/T16/T18)",
        "Nút Đặt Vé & Xem Chi Tiết",
    ])
    add_screenshot(s3, "02_danh_sach_phim.png", "Trang danh mục phim & bộ lọc thể loại")

    # ── SLIDE 4: CHI TIẾT PHIM ────────────────────────────────────────────
    s4 = prs.slides.add_slide(blank)
    apply_background(s4)
    add_header(s4, 3, "Chi Tiết Phim", "CHI TIẾT PHIM, TRAILER & CHỌN SUẤT CHIẾU  –  /movie/:id")
    add_feature_card(s4, [
        "Đạo diễn, diễn viên, thời lượng, quốc gia",
        "Trailer Full HD nhúng trực tiếp",
        "Chọn cụm rạp, ngày chiếu, khung giờ",
        "Phòng chiếu VIP Gold Class / Laser IMAX",
        "Đánh giá & bình luận khán giả",
    ])
    add_screenshot(s4, "03_chi_tiet_phim.png", "Trang chi tiết phim & chọn suất chiếu")

    # ── SLIDE 5: CHỌN GHẾ ────────────────────────────────────────────────
    s5 = prs.slides.add_slide(blank)
    apply_background(s5)
    add_header(s5, 4, "Sơ Đồ Ghế", "SƠ ĐỒ CHỌN GHẾ VIP 5 SAO  –  /seat")
    add_feature_card(s5, [
        "Màn hình cong Cinema Screen trực quan",
        "Ghế Thường / VIP Gold Class / Sweetbox Đôi",
        "Màu sắc trạng thái: Trống / Đang chọn / Đã đặt",
        "Tự động tính tiền theo loại ghế",
        "Cơ chế khóa ghế – chống trùng lặp",
    ])
    add_screenshot(s5, "04_so_do_chon_ghe.png", "Sơ đồ phòng chiếu VIP thời gian thực")

    # ── SLIDE 6: BẮP NƯỚC ────────────────────────────────────────────────
    s6 = prs.slides.add_slide(blank)
    apply_background(s6)
    add_header(s6, 5, "Bắp Nước", "THỰC ĐƠN COMBO BẮP NƯỚC & TẠM TÍNH  –  /snack")
    add_feature_card(s6, [
        "Bắp rang phô mai, caramel, nước ngọt",
        "Combo Solo / Couple VIP / Family",
        "Nút tăng/giảm (+/–) số lượng tức thì",
        "Tạm tính: vé ghế + bắp nước",
        "Bỏ qua hoặc tiếp tục sang thanh toán",
    ])
    add_screenshot(s6, "05_chon_bap_nuoc.png", "Thực đơn combo & hóa đơn tạm tính")

    # ── SLIDE 7: GIỎ VÉ ──────────────────────────────────────────────────
    s7 = prs.slides.add_slide(blank)
    apply_background(s7)
    add_header(s7, 6, "Giỏ Vé", "GIỎ VÉ CỦA BẠN (CART)  –  /cart")
    add_feature_card(s7, [
        "Danh sách vé: poster, thể loại, đơn giá",
        "Tăng/giảm số lượng hoặc xóa vé",
        "Voucher giảm giá: VIP25, CINETICKET (–20%)",
        "Tạm tính / Giảm giá / Tổng thanh toán",
        "Điều hướng sang chọn ghế hoặc thanh toán",
    ])
    add_screenshot(s7, "06_gio_hang.png", "Giỏ vé với danh sách phim đã chọn")

    # ── SLIDE 8: THANH TOÁN VIETQR ───────────────────────────────────────
    s8 = prs.slides.add_slide(blank)
    apply_background(s8)
    add_header(s8, 7, "Thanh Toán", "CỔNG THANH TOÁN VIETQR ADMIN MB BANK  –  /payment")
    add_feature_card(s8, [
        "Mã VietQR chuẩn NAPAS – tự điền số tiền",
        "MB Bank – STK 098765432199",
        "1-Click Copy STK & nội dung chuyển khoản",
        "Đa phương thức: VietQR / MoMo / VNPAY / Visa",
        "Form nhập họ tên, SĐT, email nhận vé",
    ])
    add_screenshot(s8, "07_thanh_toan_vietqr.png", "Cổng thanh toán VietQR & thông tin MB Bank")

    # ── SLIDE 9: VÉ ĐIỆN TỬ ─────────────────────────────────────────────
    s9 = prs.slides.add_slide(blank)
    apply_background(s9)
    add_header(s9, 8, "Vé Điện Tử", "VÉ ĐIỆN TỬ VIP PASS & IN VÉ  –  /order-success")
    add_feature_card(s9, [
        "Thẻ VIP Pass viền vàng kim – ĐÃ THANH TOÁN",
        "Mã QR Check-in (phòng chiếu, ghế, suất)",
        "Cụm rạp / Phòng Laser IMAX / Giờ chiếu / Ghế",
        "Danh sách bắp nước đính kèm đơn hàng",
        "In vé (window.print) – xuất PDF hoặc in giấy",
    ])
    add_screenshot(s9, "08_ve_dien_tu_thanh_cong.png", "Vé điện tử VIP Pass & mã QR Check-in")

    # ── SLIDE 10: LỊCH SỬ ĐẶT VÉ ────────────────────────────────────────
    s10 = prs.slides.add_slide(blank)
    apply_background(s10)
    add_header(s10, 9, "My Orders", "LỊCH SỬ ĐẶT VÉ & BỘ LỌC TRẠNG THÁI  –  /myorders")
    add_feature_card(s10, [
        "Danh sách vé theo trình tự thời gian",
        "Lọc: Tất cả / Đã thanh toán / Chờ xác nhận / Đã hủy",
        "Tên phim, giờ chiếu, ghế, tổng tiền",
        "Xem lại mã QR Check-in bất kỳ lúc nào",
        "Theo dõi và kiểm tra trạng thái đơn",
    ])
    add_screenshot(s10, "09_lich_su_dat_ve.png", "Lịch sử đặt vé & bộ lọc trạng thái")

    # ── SLIDE 11: QUẢN LÝ TÀI KHOẢN ─────────────────────────────────────
    s11 = prs.slides.add_slide(blank)
    apply_background(s11)
    add_header(s11, 10, "Tài Khoản", "QUẢN LÝ TÀI KHOẢN CÁ NHÂN  –  /account")
    add_feature_card(s11, [
        "Hồ sơ VIP: họ tên, email, SĐT",
        "Chỉnh sửa thông tin → Lưu Thay Đổi",
        "Đổi mật khẩu (xác nhận mật khẩu cũ)",
        "Lưu vào LocalStorage & SessionStorage",
        "Đăng xuất xóa phiên an toàn",
    ])
    add_screenshot(s11, "10_quan_ly_tai_khoan.png", "Trang quản lý tài khoản & đổi mật khẩu")

    # ── SLIDE 12: ĐĂNG NHẬP ──────────────────────────────────────────────
    s12 = prs.slides.add_slide(blank)
    apply_background(s12)
    add_header(s12, 11, "Đăng Nhập", "ĐĂNG NHẬP & ĐĂNG KÝ THÀNH VIÊN VIP  –  /login")
    add_feature_card(s12, [
        "Giao diện Glassmorphism Dark Luxury",
        "2 vai trò: Member (xem phim) & Admin",
        "Nút điền nhanh Demo 1-Click",
        "Form đăng ký (Validation họ tên / email / mật khẩu)",
        "Ghi nhớ phiên – bảo mật quyền truy cập",
    ])
    add_screenshot(s12, "11_dang_nhap.png", "Trang đăng nhập & đăng ký thành viên VIP")

    # ── SLIDE 13: ADMIN – THỐNG KÊ KPI ───────────────────────────────────
    s13 = prs.slides.add_slide(blank)
    apply_background(s13)
    add_header(s13, 12, "Admin Dashboard", "ADMIN: THỐNG KÊ DOANH THU & KPI  –  /admin")
    add_feature_card(s13, [
        "KPI: Doanh thu / Vé bán / Phim chiếu / Thành viên",
        "Biểu đồ doanh thu theo tuần / tháng",
        "Bảng giao dịch mới nhất & trạng thái",
        "Phân quyền: chỉ role admin được truy cập",
        "Dashboard tải nhanh – điều hành trực quan",
    ])
    add_screenshot(s13, "12_admin_thong_ke.png", "Admin Dashboard – KPI & biểu đồ doanh thu")

    # ── SLIDE 14: ADMIN – QUẢN LÝ PHIM ───────────────────────────────────
    s14 = prs.slides.add_slide(blank)
    apply_background(s14)
    add_header(s14, 13, "Quản Lý Phim", "ADMIN: QUẢN LÝ KHO PHIM & SUẤT CHIẾU")
    add_feature_card(s14, [
        "Danh sách phim: poster, thể loại, giá vé",
        "Thêm phim mới (poster URL, trailer, tóm tắt)",
        "Chỉnh sửa thông tin phim (Edit Movie)",
        "Xóa / ẩn phim đã ngừng chiếu",
        "Đồng bộ tức thì sang trang chủ & danh mục",
    ])
    add_screenshot(s14, "13_admin_quan_ly_phim.png", "Admin – danh sách phim & nút Thêm/Sửa/Xóa")

    # ── SLIDE 15: ADMIN – CÀI ĐẶT QR ─────────────────────────────────────
    s15 = prs.slides.add_slide(blank)
    apply_background(s15)
    add_header(s15, 14, "Cài Đặt QR", "ADMIN: CÀI ĐẶT MÃ QR & TÀI KHOẢN NGÂN HÀNG")
    add_feature_card(s15, [
        "Cấu hình ngân hàng: MB Bank / VCB / Viettin…",
        "Số tài khoản & tên chủ tài khoản",
        "Ví MoMo Admin: 0337191740",
        "Live VietQR Preview – khách thấy ngay",
        "Lưu cấu hình bền vững (LocalStorage)",
    ])
    add_screenshot(s15, "14_admin_cai_dat_qr.png", "Admin – cài đặt mã QR & live preview")

    # ── SLIDE 16: LIÊN HỆ ────────────────────────────────────────────────
    s16 = prs.slides.add_slide(blank)
    apply_background(s16)
    add_header(s16, 15, "Liên Hệ", "TRANG LIÊN HỆ & BẢN ĐỒ TRỤ SỞ RẠP  –  /contact")
    add_feature_card(s16, [
        "12 Trịnh Đình Thảo, Tân Phú, TP.HCM",
        "Hotline 24/7: 0337191740",
        "Email: hthaongn@gmail.com",
        "Bản đồ Google Maps tích hợp trực tiếp",
        "Form gửi liên hệ & góp ý",
    ])
    add_screenshot(s16, "15_trang_lien_he.png", "Trang liên hệ – bản đồ & hotline 24/7")

    prs.save(OUTPUT_PPTX)
    print(f"Saved → {OUTPUT_PPTX}")


if __name__ == "__main__":
    build_presentation()
