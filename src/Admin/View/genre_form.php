<?php include __DIR__ . '/_header.php'; ?>

<div class="premium-card">
  <div class="premium-card-header">
    <h5 class="premium-card-title">
      <i class="fas <?= $mode === 'add' ? 'fa-plus-circle' : 'fa-edit' ?> text-primary mr-2"></i>
      <?= $mode === 'add' ? 'Thêm thể loại mới' : 'Chỉnh sửa thể loại' ?>
    </h5>
    <a class="btn btn-sm btn-outline-secondary" href="index.php?act=genres" style="border-radius: 8px;">
      <i class="fas fa-arrow-left mr-1"></i> Quay lại
    </a>
  </div>
  
  <div class="p-4" style="background-color: #fff; max-width: 680px; margin: 0 auto;">
    <form method="post">
      <div class="premium-form-group">
        <label class="premium-label">Tên thể loại phim</label>
        <input class="premium-input" name="name" value="<?= htmlspecialchars($genre['name'] ?? '') ?>" placeholder="Ví dụ: Khoa học viễn tưởng, Giật gân" required>
      </div>
      
      <div class="premium-form-group">
        <label class="premium-label">Lớp biểu tượng (FontAwesome class)</label>
        <input class="premium-input" name="icon_class" value="<?= htmlspecialchars($genre['icon_class'] ?? 'fas fa-film') ?>" placeholder="Ví dụ: fas fa-film, fas fa-bolt, far fa-laugh, fas fa-ghost" required>
        <div class="text-muted small mt-2">
          Gợi ý: 
          <code class="mr-2">fas fa-bolt</code> (Hành động), 
          <code class="mr-2">far fa-laugh</code> (Hài hước), 
          <code class="mr-2">fas fa-ghost</code> (Kinh dị), 
          <code>fas fa-heart</code> (Tình cảm)
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="border-top pt-4 mt-4 text-right">
        <a class="btn btn-outline-secondary mr-2" href="index.php?act=genres" style="border-radius: 8px; padding: 8px 20px; font-weight: 600;">Hủy bỏ</a>
        <button class="btn btn-primary" type="submit" style="background: var(--primary-gradient); border: none; border-radius: 8px; padding: 8px 24px; font-weight: 600; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
          Lưu thể loại
        </button>
      </div>
    </form>
  </div>
</div>

<?php include __DIR__ . '/_footer.php'; ?>
