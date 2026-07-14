<?php include __DIR__ . '/_header.php'; ?>

<div class="premium-card">
  <div class="premium-card-header">
    <h5 class="premium-card-title"><i class="fas fa-video text-primary mr-2"></i> Danh sách phim đang chiếu</h5>
    <a class="btn btn-primary btn-sm" href="index.php?act=movie_add" style="background: var(--primary-gradient); border: none; font-weight:600; border-radius:8px; padding: 6px 14px;">
      <i class="fas fa-plus-circle mr-1"></i> Thêm phim mới
    </a>
  </div>
  
  <div class="p-0 table-responsive">
    <table class="premium-table">
      <thead>
        <tr>
          <th style="width: 80px;">ID</th>
          <th style="width: 100px;">Poster</th>
          <th>Tiêu đề</th>
          <th>Thể loại</th>
          <th>Giá vé</th>
          <th>Ngày tạo</th>
          <th class="text-right" style="width: 120px;">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($movies)): ?>
          <tr>
            <td colspan="7" class="text-center text-muted">Không có bộ phim nào.</td>
          </tr>
        <?php else: ?>
          <?php foreach($movies as $m): ?>
            <tr>
              <td><span class="text-muted">#<?= $m['id'] ?></span></td>
              <td>
                <img src="../assets/<?= htmlspecialchars($m['poster']) ?>" 
                     alt="<?= htmlspecialchars($m['title']) ?>" 
                     style="width: 64px; height: 86px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid var(--border-color);">
              </td>
              <td>
                <strong><?= htmlspecialchars($m['title']) ?></strong>
                <div class="text-muted small mt-1">
                  <i class="far fa-clock mr-1"></i> <?= (int)$m['duration_min'] ?> phút | 
                  <span class="badge badge-secondary" style="font-size: 9px; padding: 2px 4px;"><?= htmlspecialchars($m['rating'] ?: 'PG-13') ?></span>
                </div>
              </td>
              <td>
                <span class="badge-premium info">
                  <i class="fas fa-tag mr-1"></i> <?= htmlspecialchars($m['genre_name'] ?? 'Chưa rõ') ?>
                </span>
              </td>
              <td>
                <strong class="text-primary"><?= number_format($m['price']) ?>đ</strong>
              </td>
              <td>
                <span class="text-muted small"><?= date('d/m/Y H:i', strtotime($m['created_at'])) ?></span>
              </td>
              <td class="text-right">
                <a class="btn-action edit mr-1" href="index.php?act=movie_edit&id=<?= $m['id'] ?>" title="Chỉnh sửa">
                  <i class="fas fa-edit"></i>
                </a>
                <a class="btn-action delete" onclick="return confirm('Bạn có chắc chắn muốn xóa bộ phim này không?')" href="index.php?act=movie_delete&id=<?= $m['id'] ?>" title="Xóa">
                  <i class="fas fa-trash-alt"></i>
                </a>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include __DIR__ . '/_footer.php'; ?>
