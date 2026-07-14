<?php
/** @var array $items */
/** @var int $activeMovieId */
/** @var array $rows */
/** @var array $cols */
/** @var array $reservedSeats */
/** @var array $selectedSeats */
/** @var array $showtimesByMovie */
/** @var array $itemShowtime */
?>
<div class="breadcrumb-section breadcrumb-bg">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 offset-lg-2 text-center">
        <div class="breadcrumb-text">
          <p>Đặt vé</p>
          <h1>Chọn ghế</h1>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="container seat-page mt-4 mb-5">
  <div class="seat-steps">
    <div class="seat-step active">
      <div class="seat-step-icon"><i class="fas fa-th-large"></i></div>
      <div class="seat-step-text">Ch&#7885;n gh&#7871;</div>
    </div>
    <div class="seat-step">
      <div class="seat-step-icon"><i class="fas fa-shopping-basket"></i></div>
      <div class="seat-step-text">B&#7855;p n&#432;&#7899;c</div>
    </div>
    <div class="seat-step">
      <div class="seat-step-icon"><i class="far fa-credit-card"></i></div>
      <div class="seat-step-text">Thanh to&aacute;n</div>
    </div>
    <div class="seat-step">
      <div class="seat-step-icon"><i class="fas fa-ticket-alt"></i></div>
      <div class="seat-step-text">Th&ocirc;ng tin v&eacute;</div>
    </div>
  </div>

  <h2 class="seat-title">Ch&#7885;n gh&#7871; cho &#273;&#417;n #<?= (int)$order_id ?></h2>
  <p class="text-muted seat-subtitle">
    Ch&#7885;n gh&#7871; theo s&#7889; l&#432;&#7907;ng v&eacute; &#273;&atilde; &#273;&#7863;t. Gh&#7871; m&agrave;u x&aacute;m &#273;&atilde; c&oacute; ng&#432;&#7901;i kh&aacute;c &#273;&#7863;t, b&#7841;n kh&ocirc;ng th&#7875; &#273;&#7863;t tr&ugrave;ng.
  </p>

  <div class="movie-tabs">
    <?php foreach ($items as $it): $movieId = (int)$it['movie_id']; ?>
      <a class="movie-tab <?= $movieId === $activeMovieId ? 'active' : '' ?>"
         href="index.php?act=seat&order_id=<?= (int)$order_id ?>&movie_id=<?= $movieId ?>">
        <?= htmlspecialchars($it['title']) ?>
      </a>
    <?php endforeach; ?>
  </div>

  <form method="post" action="index.php?act=seat&order_id=<?= (int)$order_id ?>&movie_id=<?= $activeMovieId ?>">
    <input type="hidden" name="movie_id" value="<?= $activeMovieId ?>">

    <?php foreach ($items as $it): ?>
      <?php
        $movieId = (int)$it['movie_id'];
        if ($movieId !== $activeMovieId) {
          continue;
        }
        $need = (int)$it['qty'];
        $reserved = $reservedSeats[$movieId] ?? [];
        $mine = $selectedSeats[$movieId] ?? [];
        $times = $showtimesByMovie[$movieId] ?? [];
        $selectedShowtime = (int)($itemShowtime[$movieId] ?? 0);
      ?>
      <div class="card seat-card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div><strong><?= htmlspecialchars($it['title']) ?></strong></div>
          <div class="text-muted small">C&#7847;n <?= $need ?> gh&#7871;</div>
        </div>
        <div class="card-body">
          <?php if (!empty($times)): ?>
            <div class="showtime-list">
              <?php foreach ($times as $t): ?>
                <?php
                  $labelTime = date('H:i', strtotime($t['show_time']));
                  $labelDate = date('d/m', strtotime($t['show_date']));
                  $active = ((int)$t['id'] === $selectedShowtime);
                ?>
                <a class="showtime-btn <?= $active ? 'active' : '' ?>"
                   href="index.php?act=seat&order_id=<?= (int)$order_id ?>&movie_id=<?= $movieId ?>&set_showtime=<?= (int)$t['id'] ?>">
                  <?= htmlspecialchars($labelTime) ?>
                  <span>
                    <?= htmlspecialchars($labelDate) ?>
                    <?php if (!empty($t['cinema_name'])): ?>
                      - <?= htmlspecialchars($t['cinema_name']) ?>
                    <?php endif; ?>
                  </span>
                </a>
              <?php endforeach; ?>
            </div>
          <?php else: ?>
            <p class="text-danger small mb-2">Ch&#432;a c&oacute; su&#7845;t chi&#7871;u cho phim n&agrave;y.</p>
          <?php endif; ?>

          <div class="seat-legend">
            <span class="seat-legend-item"><span class="seat-legend-box seat-legend-selected"></span> Gh&#7871; b&#7841;n ch&#7885;n</span>
            <span class="seat-legend-item"><span class="seat-legend-box seat-legend-blocked"></span> Kh&ocirc;ng th&#7875; ch&#7885;n</span>
            <span class="seat-legend-item"><span class="seat-legend-box seat-legend-sold"></span> &#272;&atilde; &#273;&#7863;t</span>
          </div>

          <div class="seat-screen">MAN HINH</div>
          <div class="seat-grid" data-max="<?= $need ?>">
            <?php foreach ($rows as $r): ?>
              <div class="seat-row">
                <span class="seat-row-label"><?= $r ?></span>
                <div class="seat-row-seats">
                  <?php foreach ($cols as $c): ?>
                    <?php
                      $code = $r . $c;
                      $isMine = in_array($code, $mine, true);
                      $isLocked = isset($reserved[$code]) && $reserved[$code] !== $order_id;
                    ?>
                    <label class="seat <?= $isLocked ? 'seat-disabled' : '' ?> <?= $isMine ? 'seat-checked' : '' ?>">
                      <input type="checkbox" name="seats[<?= $movieId ?>][]" value="<?= $code ?>" <?= $isMine ? 'checked' : '' ?> <?= $isLocked ? 'disabled' : '' ?>>
                      <span><?= $code ?></span>
                    </label>
                  <?php endforeach; ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      </div>
    <?php endforeach; ?>

    <div class="seat-actions mt-4">
      <button type="submit" class="boxed-btn" style="border:none;">L&#432;u gh&#7871; v&agrave; ti&#7871;p t&#7909;c</button>
      <a class="bordered-btn ml-2" href="index.php?act=myorders">V&#7873; danh s&aacute;ch &#273;&#417;n</a>
      <div class="seat-save-status mt-2" data-seat-save-status></div>
    </div>
  </form>
</div>

<script>
  var seatForm = document.querySelector('.seat-page form');
  var saveStatus = document.querySelector('[data-seat-save-status]');
  var saveTimer = null;
  var latestRequest = 0;
  var isDirty = false;

  function setSaveStatus(message, state) {
    if (!saveStatus) return;
    saveStatus.textContent = message || '';
    saveStatus.classList.remove('is-saving', 'is-success', 'is-error');
    if (state) {
      saveStatus.classList.add(state);
    }
  }

  function syncSeatClasses(root) {
    root.querySelectorAll('.seat').forEach(function(label) {
      var input = label.querySelector('input[type="checkbox"]');
      if (!input) return;
      label.classList.toggle('seat-checked', input.checked);
    });
  }

  function flushAutosave(immediate) {
    if (!seatForm) return;
    if (saveTimer) clearTimeout(saveTimer);
    setSaveStatus('Dang luu ghe...', 'is-saving');
    var triggerSave = function() {
      var requestId = ++latestRequest;
      var formData = new FormData(seatForm);
      formData.append('autosave', '1');

      fetch(seatForm.getAttribute('action'), {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
        keepalive: !!immediate
      })
      .then(function(response) {
        return response.json().then(function(data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function(result) {
        if (requestId !== latestRequest) return;
        if (!result.ok || !result.data.ok) {
          throw result.data || { message: 'Khong the luu ghe luc nay.' };
        }
        isDirty = false;
        setSaveStatus(result.data.message || 'Da luu ghe tam thoi.', 'is-success');
      })
      .catch(function(error) {
        if (requestId !== latestRequest) return;
        setSaveStatus((error && error.message) ? error.message : 'Khong the luu ghe luc nay.', 'is-error');
      });
    };

    if (immediate) {
      triggerSave();
      return;
    }

    saveTimer = setTimeout(triggerSave, 180);
  }

  function scheduleAutosave() {
    isDirty = true;
    flushAutosave(false);
  }

  document.querySelectorAll('.seat-grid').forEach(function(grid) {
    var max = parseInt(grid.getAttribute('data-max'), 10) || 0;

    grid.addEventListener('change', function(e) {
      if (!e.target.matches('input[type="checkbox"]')) return;

      var checked = grid.querySelectorAll('input[type="checkbox"]:checked').length;
      if (checked > max) {
        e.target.checked = false;
        alert('Ban chi duoc chon toi da ' + max + ' ghe cho phim nay.');
      }

      var label = e.target.closest('.seat');
      if (label) {
        label.classList.toggle('seat-checked', e.target.checked);
      }

      scheduleAutosave();
    });

    syncSeatClasses(grid);
  });

  document.querySelectorAll('.seat-page a[href]').forEach(function(link) {
    link.addEventListener('click', function() {
      if (link.classList.contains('showtime-btn') || link.getAttribute('href').indexOf('set_showtime=') !== -1) {
        // Discard selections on the old showtime when changing showtime to avoid race condition re-saving old seats
        isDirty = false;
        return;
      }
      if (!isDirty) return;
      flushAutosave(true);
    });
  });

  window.addEventListener('pagehide', function() {
    if (!isDirty || !seatForm || !navigator.sendBeacon) return;
    var formData = new FormData(seatForm);
    formData.append('autosave', '1');
    navigator.sendBeacon(seatForm.getAttribute('action'), formData);
    isDirty = false;
  });
</script>
