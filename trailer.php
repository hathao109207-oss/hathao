<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Model/hanghoa.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$movie = $id > 0 ? HangHoa::find($id) : null;

function buildYoutubeEmbedUrl($url) {
    $url = trim((string)$url);
    if ($url === '') {
        return '';
    }

    $parts = parse_url($url);
    if (!$parts || empty($parts['host'])) {
        return '';
    }

    $host = strtolower($parts['host']);
    $videoId = '';

    if (strpos($host, 'youtu.be') !== false) {
        $videoId = trim($parts['path'] ?? '', '/');
    } elseif (strpos($host, 'youtube.com') !== false) {
        parse_str($parts['query'] ?? '', $query);
        if (!empty($query['v'])) {
            $videoId = $query['v'];
        } elseif (!empty($parts['path'])) {
            $path = trim($parts['path'], '/');
            if (strpos($path, 'embed/') === 0) {
                $videoId = substr($path, 6);
            } elseif (strpos($path, 'shorts/') === 0) {
                $videoId = substr($path, 7);
            }
        }
    }

    if ($videoId === '') {
        return '';
    }

    return 'https://www.youtube.com/embed/' . rawurlencode($videoId) . '?autoplay=1';
}

$trailerUrl = $movie['trailer_url'] ?? '';
$embedUrl = buildYoutubeEmbedUrl($trailerUrl);

header('Content-Type: text/html; charset=UTF-8');
require_once __DIR__ . '/View/headder.php';
?>

<div class="breadcrumb-section breadcrumb-bg">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 offset-lg-2 text-center">
                <div class="breadcrumb-text">
                    <p>Xem trailer</p>
                    <h1><?= htmlspecialchars($movie['title'] ?? 'Trailer phim') ?></h1>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container mt-5 mb-5">
    <?php if (!$movie): ?>
        <div class="alert alert-danger">Không tìm thấy phim.</div>
    <?php elseif ($embedUrl === ''): ?>
        <div class="alert alert-warning">Phim này chưa có trailer hợp lệ.</div>
    <?php else: ?>
        <div class="row">
            <div class="col-lg-10 offset-lg-1">
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe
                        class="embed-responsive-item"
                        src="<?= htmlspecialchars($embedUrl) ?>"
                        title="Trailer <?= htmlspecialchars($movie['title'] ?? '') ?>"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                </div>
            </div>
        </div>
    <?php endif; ?>

    <div class="text-center mt-4">
        <?php if (!empty($movie['id'])): ?>
            <a href="index.php?act=sanphamchitiet&id=<?= (int)$movie['id'] ?>" class="boxed-btn">Quay lại chi tiết phim</a>
        <?php else: ?>
            <a href="index.php?act=sanpham" class="boxed-btn">Quay lại danh sách phim</a>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/View/footer.php'; ?>
