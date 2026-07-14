<?php include __DIR__ . '/_header.php'; ?>

<div class="premium-card">
  <div class="premium-card-header">
    <h5 class="premium-card-title"><i class="fas fa-tags text-primary mr-2"></i> Danh mục thể loại phim</h5>
    <a class="btn btn-primary btn-sm" href="index.php?act=genre_add" style="background: var(--primary-gradient); border: none; font-weight:600; border-radius:8px; padding: 6px 14px;">
      <i class="fas fa-plus-circle mr-1"></i> Thêm thể loại mới
    </a>
  </div>
  
  <div class="p-0 table-responsive">
    <table class="premium-table">
      <thead>
        <tr>
          <th style="width: 100px;">ID</th>
          <th>Tên thể loại</th>
          <th>Biểu tượng (Icon Class)</th>
          <th class="text-right" style="width: 120px;">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($genres)): ?>
          <tr>
            <td colspan="4" class="text-center text-muted">Không có thể loại nào.</td>
          </tr>
        <?php else: ?>
          <?php foreach($genres as $g): ?>
            <tr>
              <td><span class="text-muted">#<?= $g['id'] ?></span></td>
              <td><strong><?= htmlspecialchars($g['name']) ?></strong></td>
              <td>
                <span class="badge-premium info">
                  <i class="<?= htmlspecialchars($g['icon_class']) ?> mr-2"></i> <code><?= htmlspecialchars($g['icon_class']) ?></code>
                </span>
              </td>
              <td class="text-right">
                <a class="btn-action edit mr-1" href="index.php?act=genre_edit&id=<?= $g['id'] ?>" title="Chỉnh sửa">
                  <i class="fas fa-edit"></i>
                </a>
                <a class="btn-action delete" onclick="return confirm('Bạn có chắc chắn muốn xóa thể loại này? Các phim thuộc thể loại này sẽ bị gán thể loại thành trống.')" href="index.php?act=genre_delete&id=<?= $g['id'] ?>" title="Xóa">
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
