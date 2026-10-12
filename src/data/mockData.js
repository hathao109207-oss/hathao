export const genres = [
  { id: 1, name: "Hành Động" },
  { id: 2, name: "Kinh Dị" },
  { id: 3, name: "Hài Hước" },
  { id: 4, name: "Hoạt Hình" },
  { id: 5, name: "Tình Cảm" },
  { id: 6, name: "Khoa Học Viễn Tưởng" },
  { id: 7, name: "Tâm Lý" }
];

export const movies = [
  {
    id: 1,
    title: "Avatar 2 - Dòng Chảy Của Nước",
    genre_id: 6,
    genre_name: "Khoa Học Viễn Tưởng",
    price: 110000,
    rating: 8.5,
    duration: 192,
    release_date: "2024-12-16",
    image: "/assets/img/products/avatar-2.jpg",
    director: "James Cameron",
    cast: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
    description: "Jake Sully cùng Neytiri phải rời khỏi tổ ấm và khám phá những vùng đất mới lạ của Pandora khi một mối đe dọa cổ xưa quay trở lại.",
    trailer_url: "https://www.youtube.com/embed/d9MyW72ELq0",
    status: "now_showing",
    format: "3D IMAX",
    age_rating: "T13"
  },
  {
    id: 2,
    title: "John Wick: Chapter 4",
    genre_id: 1,
    genre_name: "Hành Động",
    price: 105000,
    rating: 8.8,
    duration: 169,
    release_date: "2024-03-24",
    image: "/assets/img/products/john-wick-4.jpg",
    director: "Chad Stahelski",
    cast: "Keanu Reeves, Donnie Yen, Bill Skarsgård",
    description: "John Wick tìm ra con đường để đánh bại High Table, nhưng trước khi giành được tự do, anh phải đối đầu với một kẻ thù mới với các liên minh quyền lực toàn cầu.",
    trailer_url: "https://www.youtube.com/embed/qEVUtrk8_B4",
    status: "now_showing",
    format: "2D Digital",
    age_rating: "T18"
  },
  {
    id: 3,
    title: "Kẻ Vô Danh 2 (Nobody 2)",
    genre_id: 1,
    genre_name: "Hành Động",
    price: 95000,
    rating: 7.9,
    duration: 110,
    release_date: "2025-08-15",
    image: "/assets/img/products/ke-vo-danh-2.jpg",
    director: "Timo Tjahjanto",
    cast: "Bob Odenkirk, Connie Nielsen, Christopher Lloyd",
    description: "Hutch Mansell trở lại trong một trận chiến sinh tử mới, bảo vệ gia đình trước thế lực ngầm nguy hiểm nhất thế giới.",
    trailer_url: "https://www.youtube.com/embed/wZti8UjWFaI",
    status: "now_showing",
    format: "2D Phụ đề",
    age_rating: "T18"
  },
  {
    id: 4,
    title: "The Conjuring: Last Rites",
    genre_id: 2,
    genre_name: "Kinh Dị",
    price: 100000,
    rating: 8.2,
    duration: 125,
    release_date: "2025-09-05",
    image: "/assets/img/products/conjuring-4.jpg",
    director: "Michael Chaves",
    cast: "Patrick Wilson, Vera Farmiga",
    description: "Vụ án cuối cùng đầy kinh hoàng của cặp vợ chồng trừ tà Ed và Lorraine Warren đối mặt với một thế lực siêu nhiên hắc ám chưa từng có.",
    trailer_url: "https://www.youtube.com/embed/ejMMn0t58Lc",
    status: "now_showing",
    format: "2D Atmos",
    age_rating: "T16"
  },
  {
    id: 5,
    title: "M3GAN 2.0",
    genre_id: 2,
    genre_name: "Kinh Dị",
    price: 95000,
    rating: 7.4,
    duration: 105,
    release_date: "2025-06-27",
    image: "/assets/img/products/m3gan-2.jpg",
    director: "Gerard Johnstone",
    cast: "Allison Williams, Violet McGraw, Amie Donald",
    description: "Búp bê trí tuệ nhân tạo M3GAN quay trở lại với sự tiến hóa kinh hoàng và khả năng kết nối mạng lưới đe dọa loài người.",
    trailer_url: "https://www.youtube.com/embed/BRb4U99OU80",
    status: "now_showing",
    format: "2D Digital",
    age_rating: "T16"
  },
  {
    id: 6,
    title: "Doraemon 44: Nobita và Bức Tranh Thế Giới",
    genre_id: 4,
    genre_name: "Hoạt Hình",
    price: 90000,
    rating: 8.3,
    duration: 108,
    release_date: "2025-05-24",
    image: "/assets/img/products/doraemon-44-2025.jpg",
    director: "Yukiyo Teramoto",
    cast: "Wasabi Mizuta, Megumi Oohara, Yumi Kakazu",
    description: "Doraemon và nhóm bạn bước vào một thế giới kỳ diệu bên trong bức tranh cổ tích và đối mặt với hiểm nguy bảo vệ xứ sở diệu kỳ.",
    trailer_url: "https://www.youtube.com/embed/vf330Z7iE4Y",
    status: "now_showing",
    format: "2D Lồng tiếng",
    age_rating: "P"
  },
  {
    id: 7,
    title: "Bố Già (The Godfather)",
    genre_id: 7,
    genre_name: "Tâm Lý",
    price: 120000,
    rating: 9.2,
    duration: 175,
    release_date: "2024-02-14",
    image: "/assets/img/products/bo-gia.jpg",
    director: "Francis Ford Coppola",
    cast: "Marlon Brando, Al Pacino, James Caan",
    description: "Tác phẩm kinh điển vượt thời gian về đế chế mafia Corleone và sự trỗi dậy đầy thăng trầm của Michael Corleone.",
    trailer_url: "https://www.youtube.com/embed/sY1S34973zA",
    status: "now_showing",
    format: "4K Remastered",
    age_rating: "T18"
  },
  {
    id: 8,
    title: "Mortal Kombat 2",
    genre_id: 1,
    genre_name: "Hành Động",
    price: 105000,
    rating: 8.0,
    duration: 130,
    release_date: "2025-10-24",
    image: "/assets/img/products/mortal-kombat-2.jpg",
    director: "Simon McQuoid",
    cast: "Karl Urban, Lewis Tan, Jessica McNamee",
    description: "Giải đấu sinh tử Outworld chính thức bắt đầu với sự xuất hiện của ngôi sao Johnny Cage và các đấu sĩ huyền thoại.",
    trailer_url: "https://www.youtube.com/embed/jBa_aHwCbCg",
    status: "coming_soon",
    format: "IMAX 2D",
    age_rating: "T18"
  },
  {
    id: 9,
    title: "Elio",
    genre_id: 4,
    genre_name: "Hoạt Hình",
    price: 90000,
    rating: 7.8,
    duration: 100,
    release_date: "2025-06-13",
    image: "/assets/img/products/elio-2025.jpg",
    director: "Adrian Molina",
    cast: "Yonas Kibreab, America Ferrera, Jameela Jamil",
    description: "Một cậu bé Trái Đất bất ngờ bị đưa lên vũ trụ và bị hiểu nhầm là đại sứ lãnh đạo của cả hành tinh Trái Đất.",
    trailer_url: "https://www.youtube.com/embed/2w_K3CB8puE",
    status: "coming_soon",
    format: "3D Digital",
    age_rating: "P"
  },
  {
    id: 10,
    title: "Titanic (Bản Kỷ Niệm 25 Năm)",
    genre_id: 5,
    genre_name: "Tình Cảm",
    price: 110000,
    rating: 9.0,
    duration: 194,
    release_date: "2024-02-10",
    image: "/assets/img/products/titanic-1997.jpg",
    director: "James Cameron",
    cast: "Leonardo DiCaprio, Kate Winslet, Billy Zane",
    description: "Bản tình ca vĩ đại nhất mọi thời đại giữa Jack và Rose trên con tàu định mệnh Titanic với chất lượng 4K 3D đỉnh cao.",
    trailer_url: "https://www.youtube.com/embed/kVrqfYjkTdQ",
    status: "now_showing",
    format: "3D 4K HFR",
    age_rating: "T13"
  }
];

export const ageRatings = [
  { code: "P", label: "P - Phổ biến (Mọi lứa tuổi)", color: "#10b981" },
  { code: "T13", label: "T13 - Trên 13 tuổi", color: "#3b82f6" },
  { code: "T16", label: "T16 - Trên 16 tuổi", color: "#f59e0b" },
  { code: "T18", label: "T18 - Trên 18 tuổi", color: "#ef4444" },
  { code: "K", label: "K - Dành cho trẻ em", color: "#8b5cf6" },
];

export const showtimes = [
  { id: 101, movie_id: 1, cinema_name: "CineTicket Quận 1 VIP", room: "Phòng VIP 01 - Laser IMAX", show_date: "2026-10-12", show_time: "14:30" },
  { id: 102, movie_id: 1, cinema_name: "CineTicket Quận 1 VIP", room: "Phòng VIP 02 - Dolby Atmos", show_date: "2026-10-12", show_time: "18:00" },
  { id: 103, movie_id: 1, cinema_name: "CineTicket Landmark 81", room: "Phòng VIP Gold Class", show_date: "2026-10-12", show_time: "20:45" },
  { id: 104, movie_id: 2, cinema_name: "CineTicket Quận 1 VIP", room: "Phòng VIP 01 - Laser IMAX", show_date: "2026-10-12", show_time: "15:00" },
  { id: 105, movie_id: 2, cinema_name: "CineTicket Landmark 81", room: "Phòng VIP Gold Class", show_date: "2026-10-12", show_time: "19:15" },
  { id: 106, movie_id: 3, cinema_name: "CineTicket Quận 1 VIP", room: "Phòng Standard 03", show_date: "2026-10-12", show_time: "16:40" },
  { id: 107, movie_id: 4, cinema_name: "CineTicket Landmark 81", room: "Phòng VIP Gold Class", show_date: "2026-10-12", show_time: "21:30" },
  { id: 108, movie_id: 5, cinema_name: "CineTicket Quận 1 VIP", room: "Phòng Standard 02", show_date: "2026-10-12", show_time: "17:15" },
  { id: 109, movie_id: 6, cinema_name: "CineTicket Quận 1 VIP", room: "Phòng Gia Đình VIP", show_date: "2026-10-12", show_time: "10:30" },
  { id: 110, movie_id: 7, cinema_name: "CineTicket Landmark 81", room: "Phòng Cổ Điển 01", show_date: "2026-10-12", show_time: "20:00" },
  { id: 111, movie_id: 10, cinema_name: "CineTicket Landmark 81", room: "Phòng VIP Gold Class", show_date: "2026-10-12", show_time: "19:00" }
];

export const snacks = [
  {
    id: 1,
    name: "Combo Solo VIP",
    desc: "1 Bắp Rang Bơ Vàng Lớn (Vị Caramel/Phô Mai) + 1 Nước ngọt có ga 32oz",
    price: 85000,
    image: "/assets/img/products/product-img-1.jpg"
  },
  {
    id: 2,
    name: "Combo Couple Sweet",
    desc: "1 Bắp Khổng Lồ 2 Vị Tự Chọn + 2 Nước ngọt 32oz + 1 Bánh Snack Rong Biển",
    price: 135000,
    image: "/assets/img/products/product-img-2.jpg"
  },
  {
    id: 3,
    name: "Combo Hoàng Gia Gold Class",
    desc: "1 Bắp Nấm Truffle Cao Cấp + 2 Nước ép trái cây tươi hữu cơ + 1 Xúc xích Đức nướng phô mai",
    price: 195000,
    image: "/assets/img/products/product-img-3.jpg"
  },
  {
    id: 4,
    name: "Bắp Rang Phô Mai Đặc Biệt",
    desc: "Bắp nổ tươi giòn rụm phủ bột phô mai Cheddar béo ngậy hảo hạng",
    price: 60000,
    image: "/assets/img/products/product-img-4.jpg"
  },
  {
    id: 5,
    name: "Bắp Rang Vị Caramel Nướng",
    desc: "Vị ngọt dịu quyến rũ được nướng đường nâu chuẩn phong cách rạp Hollywood",
    price: 60000,
    image: "/assets/img/products/product-img-5.jpg"
  },
  {
    id: 6,
    name: "Trà Đào Cam Sả Thượng Hạng",
    desc: "Trà thảo mộc tươi mát kết hợp miếng đào giòn thơm dịu ngọt",
    price: 45000,
    image: "/assets/img/products/product-img-6.jpg"
  }
];

export const newsArticles = [
  {
    id: 1,
    title: "CineTicket Khai Trương Phòng Chiếu IMAX Laser Gold Class Đầu Tiên",
    date: "10 Tháng 10, 2026",
    author: "Ban Biên Tập",
    summary: "Hệ thống máy chiếu 4K Laser thế hệ mới cùng ghế massage bọc da cao cấp mang đến trải nghiệm điện ảnh thượng lưu.",
    image: "/assets/img/products/product-img-1.jpg",
    content: "Được thiết kế theo tiêu chuẩn rạp 5 sao thế giới, CineTicket VIP cam kết mang lại không gian giải trí sang trọng, yên tĩnh và riêng tư nhất cho mọi khán giả."
  },
  {
    id: 2,
    title: "Bí Mật Hậu Trường Siêu Phẩm Avatar: Những Kỹ Xảo Chưa Từng Công Bố",
    date: "05 Tháng 10, 2026",
    author: "Cine Critic",
    summary: "James Cameron và ê-kíp đã phát triển công nghệ quay chuyển động dưới nước độc quyền suốt hơn 5 năm qua.",
    image: "/assets/img/products/product-img-2.jpg",
    content: "Khám phá câu chuyện phía sau sự thành công vang dội của phần 2, cùng những hé lộ đầu tiên về phần 3 sắp ra mắt."
  },
  {
    id: 3,
    title: "Đặc Quyền Thành Viên VIP: Giảm Đến 30% Vé & Tặng Combo Sinh Nhật",
    date: "01 Tháng 10, 2026",
    author: "CSKH CineTicket",
    summary: "Chương trình nâng hạng thành viên Diamond và Gold với hàng loạt ưu đãi vé xem phim 0 đồng và phòng chờ VIP Lounge.",
    image: "/assets/img/products/product-img-3.jpg",
    content: "Tích lũy điểm thưởng sau mỗi giao dịch để đổi vé xem phim, combo bắp nước thượng hạng và quà tặng phiên bản giới hạn."
  }
];

export const banks = [
  { code: "MB", name: "MB Bank (Ngân hàng Quân Đội)", account: "098765432199", holder: "CINETICKET VIETNAM CORP" },
  { code: "VCB", name: "Vietcombank", account: "1023456789", holder: "CINETICKET VIETNAM CORP" },
  { code: "TCB", name: "Techcombank", account: "19034567891011", holder: "CINETICKET VIETNAM CORP" },
  { code: "ACB", name: "ACB (Ngân hàng Á Châu)", account: "246813579", holder: "CINETICKET VIETNAM CORP" }
];

export const defaultUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    fullname: "Quản Trị Viên VIP",
    email: "admin@cineticket.vn",
    role: "admin"
  },
  {
    id: 2,
    username: "hathao",
    password: "123456",
    fullname: "Nguyễn Ngọc Hà Thảo",
    email: "hathao@cineticket.vn",
    role: "member"
  }
];

