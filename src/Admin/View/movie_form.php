<?php include __DIR__ . '/_header.php'; ?>

<div class="premium-card">
  <div class="premium-card-header">
    <h5 class="premium-card-title">
      <i class="fas <?= $mode === 'add' ? 'fa-plus-circle' : 'fa-edit' ?> text-primary mr-2"></i>
      <?= $mode === 'add' ? 'Thêm bộ phim mới' : 'Chỉnh sửa thông tin phim' ?>
    </h5>
    <a class="btn btn-sm btn-outline-secondary" href="index.php?act=movies" style="border-radius: 8px;">
      <i class="fas fa-arrow-left mr-1"></i> Quay lại
    </a>
  </div>
  
  <div class="p-4" style="background-color: #fff;">
    <form method="post" enctype="multipart/form-data">
      <div class="row g-4">
        <!-- Details Column -->
        <div class="col-lg-8">
          <div class="premium-form-group">
            <label class="premium-label">Tiêu đề phim</label>
            <input class="premium-input" name="title" value="<?= htmlspecialchars($movie['title'] ?? '') ?>" placeholder="Ví dụ: John Wick 4" required>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="premium-form-group">
                <label class="premium-label">Giá vé (đ)</label>
                <input class="premium-input" type="number" name="price" value="<?= htmlspecialchars($movie['price'] ?? 75000) ?>" min="0" step="1000" required>
              </div>
            </div>
            <div class="col-md-6">
              <div class="premium-form-group">
                <label class="premium-label">Thể loại</label>
                <select class="premium-input" name="genre_id" style="appearance: auto;">
                  <?php foreach($genres as $g): ?>
                    <option value="<?= $g['id'] ?>" <?= (!empty($movie['genre_id']) && $movie['genre_id'] == $g['id']) ? 'selected' : '' ?>>
                      <?= htmlspecialchars($g['name']) ?>
                    </option>
                  <?php endforeach; ?>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="premium-form-group">
                <label class="premium-label">Thời lượng (phút)</label>
                <input class="premium-input" type="number" name="duration_min" value="<?= htmlspecialchars($movie['duration_min'] ?? 120) ?>" min="1">
              </div>
            </div>
            <div class="col-md-6">
              <div class="premium-form-group">
                <label class="premium-label">Giới hạn độ tuổi (Rating)</label>
                <select class="premium-input" name="rating" style="appearance: auto;">
                  <?php
                    $ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'P', 'K', 'T13', 'T16', 'T18', 'C18', 'RG-18'];
                    $currentRating = $movie['rating'] ?? 'PG-13';
                    if (!empty($currentRating) && !in_array($currentRating, $ratings, true)) {
                        $ratings[] = $currentRating;
                    }
                    foreach ($ratings as $r):
                  ?>
                    <option value="<?= htmlspecialchars($r) ?>" <?= $currentRating === $r ? 'selected' : '' ?>>
                      <?= htmlspecialchars($r) ?>
                    </option>
                  <?php endforeach; ?>
                </select>
              </div>
            </div>
          </div>

          <div class="premium-form-group">
            <label class="premium-label">Đường dẫn Trailer (Youtube URL)</label>
            <input class="premium-input" name="trailer_url" value="<?= htmlspecialchars($movie['trailer_url'] ?? '') ?>" placeholder="Ví dụ: https://www.youtube.com/watch?v=...">
          </div>

          <div class="premium-form-group">
            <label class="premium-label">Mô tả tóm tắt nội dung</label>
            <textarea class="premium-input" name="description" rows="5" placeholder="Nhập mô tả tóm tắt..." style="resize: vertical;"><?= htmlspecialchars($movie['description'] ?? '') ?></textarea>
          </div>

          <div class="premium-form-group mt-4">
            <label class="premium-label" style="font-size: 16px; font-weight: 700; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">
              <i class="fas fa-clock text-primary mr-1"></i> Quản lý suất chiếu
            </label>
            
            <div id="showtime-rows-container">
              <?php 
              $stIndex = 0;
              if (!empty($movieShowtimes) && is_array($movieShowtimes)):
                foreach ($movieShowtimes as $st):
              ?>
                <div class="showtime-row row g-2 align-items-end mb-3" data-index="<?= $stIndex ?>">
                  <input type="hidden" name="showtimes[<?= $stIndex ?>][id]" value="<?= $st['id'] ?>">
                  <div class="col-md-4">
                    <label class="text-muted small mb-1">Rạp chiếu</label>
                    <select name="showtimes[<?= $stIndex ?>][cinema_id]" class="premium-input form-control-sm" style="appearance: auto;" required>
                      <?php foreach ($cinemas as $c): ?>
                        <option value="<?= $c['id'] ?>" <?= $st['cinema_id'] == $c['id'] ? 'selected' : '' ?>>
                          <?= htmlspecialchars($c['name']) ?>
                        </option>
                      <?php endforeach; ?>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="text-muted small mb-1">Ngày chiếu</label>
                    <input type="date" name="showtimes[<?= $stIndex ?>][show_date]" class="premium-input form-control-sm" value="<?= htmlspecialchars($st['show_date']) ?>" required>
                  </div>
                  <div class="col-md-3">
                    <label class="text-muted small mb-1">Giờ chiếu</label>
                    <input type="time" name="showtimes[<?= $stIndex ?>][show_time]" class="premium-input form-control-sm" value="<?= htmlspecialchars(date('H:i', strtotime($st['show_time']))) ?>" required>
                  </div>
                  <div class="col-md-1 text-center">
                    <button type="button" class="btn btn-link text-danger btn-remove-showtime" style="padding: 6px 0; font-size: 18px;"><i class="fas fa-trash-alt"></i></button>
                  </div>
                </div>
              <?php 
                $stIndex++;
                endforeach;
              endif;
              ?>
            </div>
            
            <button type="button" class="btn btn-sm btn-outline-primary mt-2" id="btn-add-showtime" style="border-radius: 8px; font-weight: 600;">
              <i class="fas fa-plus mr-1"></i> Thêm suất chiếu
            </button>
          </div>
        </div>

        <!-- Poster Upload Column -->
        <div class="col-lg-4">
          <div class="premium-form-group">
            <label class="premium-label">Poster phim</label>
            <div class="poster-preview-card">
              <?php if(!empty($movie['poster'])): ?>
                <img id="poster-preview" src="../assets/<?= htmlspecialchars($movie['poster']) ?>" alt="Poster Preview">
                <div class="text-muted small mb-2">Ảnh hiện tại của phim</div>
              <?php else: ?>
                <img id="poster-preview" src="../assets/img/products/product-img-1.jpg" alt="Poster Placeholder" style="opacity: 0.6;">
                <div class="text-muted small mb-2">Chưa tải lên ảnh poster</div>
              <?php endif; ?>
              
              <div class="mt-2 text-left">
                <input class="form-control-file" type="file" name="poster" id="poster-input" accept="image/*" style="font-size:12px;">
              </div>
              <div class="text-muted small mt-2 text-left" style="font-size:11px; line-height:1.4;">
                * Hỗ trợ ảnh định dạng .jpg, .jpeg, .png, .webp. Ảnh tải lên tự động được lưu vào thư mục `assets/img/uploads`.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="border-top pt-4 mt-4 text-right">
        <a class="btn btn-outline-secondary mr-2" href="index.php?act=movies" style="border-radius: 8px; padding: 8px 20px; font-weight: 600;">Hủy bỏ</a>
        <button class="btn btn-primary" type="submit" style="background: var(--primary-gradient); border: none; border-radius: 8px; padding: 8px 24px; font-weight: 600; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
          Lưu thông tin
        </button>
      </div>
    </form>
  </div>
</div>

<script>
  // Simple interactive image preview on file selection
  document.getElementById('poster-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('poster-preview');
        preview.src = e.target.result;
        preview.style.opacity = '1';
      }
      reader.readAsDataURL(file);
    }
  });

  // Showtime management code
  document.addEventListener('DOMContentLoaded', function() {
    let showtimeIndex = <?= $stIndex ?>;
    const cinemasList = <?= json_encode($cinemas, JSON_UNESCAPED_UNICODE) ?>;
    const rowsContainer = document.getElementById('showtime-rows-container');
    const btnAddShowtime = document.getElementById('btn-add-showtime');

    if (btnAddShowtime && rowsContainer) {
      btnAddShowtime.addEventListener('click', function() {
        let cinemaOptions = '';
        cinemasList.forEach(function(c) {
          cinemaOptions += `<option value="${c.id}">${c.name}</option>`;
        });

        const newRow = document.createElement('div');
        newRow.className = 'showtime-row row g-2 align-items-end mb-3';
        newRow.setAttribute('data-index', showtimeIndex);
        newRow.innerHTML = `
          <input type="hidden" name="showtimes[${showtimeIndex}][id]" value="0">
          <div class="col-md-4">
            <label class="text-muted small mb-1">Rạp chiếu</label>
            <select name="showtimes[${showtimeIndex}][cinema_id]" class="premium-input form-control-sm" style="appearance: auto;" required>
              ${cinemaOptions}
            </select>
          </div>
          <div class="col-md-4">
            <label class="text-muted small mb-1">Ngày chiếu</label>
            <input type="date" name="showtimes[${showtimeIndex}][show_date]" class="premium-input form-control-sm" required>
          </div>
          <div class="col-md-3">
            <label class="text-muted small mb-1">Giờ chiếu</label>
            <input type="time" name="showtimes[${showtimeIndex}][show_time]" class="premium-input form-control-sm" required>
          </div>
          <div class="col-md-1 text-center">
            <button type="button" class="btn btn-link text-danger btn-remove-showtime" style="padding: 6px 0; font-size: 18px;"><i class="fas fa-trash-alt"></i></button>
          </div>
        `;
        rowsContainer.appendChild(newRow);
        showtimeIndex++;
      });

      rowsContainer.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-remove-showtime');
        if (btn) {
          const row = btn.closest('.showtime-row');
          if (row) {
            row.remove();
          }
        }
      });
    }
  });
</script>

<?php include __DIR__ . '/_footer.php'; ?>
