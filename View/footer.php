<style>
  .site-footer {
    margin-top: 80px;
    color: #fff;
    background:
      radial-gradient(circle at top left, rgba(242, 129, 35, 0.18), transparent 28%),
      linear-gradient(135deg, #081722 0%, #10283c 48%, #173453 100%);
    position: relative;
    overflow: hidden;
  }

  .site-footer::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 24%);
    pointer-events: none;
  }

  .site-footer-inner {
    position: relative;
    z-index: 1;
    padding: 72px 0 24px;
  }

  .footer-brand {
    max-width: 380px;
  }

  .footer-brand img {
    max-width: 220px;
    margin-bottom: 18px;
  }

  .footer-kicker {
    margin-bottom: 12px;
    color: #f28123;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .footer-summary {
    margin-bottom: 0;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.8;
  }

  .footer-cta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin: 28px 0 26px;
  }

  .footer-cta-primary,
  .footer-cta-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 170px;
    min-height: 50px;
    padding: 12px 24px;
    border-radius: 999px;
    font-weight: 700;
    transition: all 0.2s ease;
  }

  .footer-cta-primary {
    background: #f28123;
    color: #fff;
    box-shadow: 0 12px 28px rgba(242, 129, 35, 0.28);
  }

  .footer-cta-primary:hover {
    color: #fff;
    background: #ff9d48;
    transform: translateY(-1px);
  }

  .footer-cta-secondary {
    border: 1px solid rgba(255, 255, 255, 0.28);
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }

  .footer-cta-secondary:hover {
    color: #fff;
    border-color: #f28123;
    background: rgba(242, 129, 35, 0.14);
  }

  .footer-contact-list,
  .footer-links {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .footer-contact-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.82);
    line-height: 1.7;
  }

  .footer-contact-list li i {
    width: 18px;
    margin-top: 6px;
    color: #f28123;
    text-align: center;
  }

  .footer-contact-list a {
    color: rgba(255, 255, 255, 0.82);
  }

  .footer-contact-list a:hover {
    color: #fff;
  }

  .footer-social {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 26px;
  }

  .footer-social a {
    width: 42px;
    height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.2s ease;
  }

  .footer-social a:hover {
    color: #fff;
    background: #f28123;
    border-color: #f28123;
    transform: translateY(-2px);
  }

  .footer-nav-title {
    margin-bottom: 22px;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .footer-links li {
    margin-bottom: 14px;
  }

  .footer-links a {
    color: rgba(255, 255, 255, 0.78);
    transition: color 0.2s ease, padding-left 0.2s ease;
  }

  .footer-links a:hover {
    color: #fff;
    padding-left: 4px;
  }

  .site-footer-bottom {
    margin-top: 40px;
    padding-top: 22px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .site-footer-bottom p {
    margin: 0;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.7;
  }

  @media (max-width: 991px) {
    .site-footer {
      margin-top: 60px;
    }

    .site-footer-inner {
      padding: 60px 0 22px;
    }

    .footer-column {
      margin-top: 36px;
    }
  }

  @media (max-width: 575px) {
    .footer-cta-group {
      flex-direction: column;
    }

    .footer-cta-primary,
    .footer-cta-secondary {
      width: 100%;
    }

    .site-footer-bottom .text-md-right {
      text-align: left !important;
      margin-top: 8px;
    }
  }
</style>

<footer class="site-footer">
  <div class="container site-footer-inner">
    <div class="row">
      <div class="col-lg-5">
        <div class="footer-brand">
          <a href="<?= BASE_URL ?>index.php">
            <img src="<?= BASE_URL ?>assets/img/logo.png" alt="CineTicket">
          </a>
          <p class="footer-kicker">&#272;&#7863;t v&eacute; xem phim online</p>
          <p class="footer-summary">
            CineTicket gi&uacute;p b&#7841;n ch&#7885;n phim, ch&#7885;n gh&#7871; v&agrave; ho&agrave;n t&#7845;t &#273;&#7863;t v&eacute; nhanh tr&ecirc;n m&#7897;t giao di&#7879;n &#273;&#417;n gi&#7843;n, r&otilde; r&agrave;ng v&agrave; ph&ugrave; h&#7907;p cho c&#7843; desktop l&#7851;n mobile.
          </p>

          <div class="footer-cta-group">
            <a class="footer-cta-primary" href="<?= BASE_URL ?>index.php?act=sanpham">&#272;&#7863;t v&eacute; ngay</a>
            <a class="footer-cta-secondary" href="<?= BASE_URL ?>index.php?act=news">Tin &#432;u &#273;&atilde;i</a>
          </div>

          <ul class="footer-contact-list">
            <li>
              <i class="fas fa-phone-alt"></i>
              <span>1900 9999</span>
            </li>
            <li>
              <i class="fas fa-envelope"></i>
              <a href="mailto:support@cineticket.com">support@cineticket.com</a>
            </li>
            <li>
              <i class="fas fa-map-marker-alt"></i>
              <span>T&#7847;ng 5, 123 &#272;&#432;&#7901;ng &#272;i&#7879;n &#7842;nh, Qu&#7853;n 1, TP.HCM</span>
            </li>
          </ul>

          <div class="footer-social">
            <a href="https://facebook.com/CineTicket" target="_blank" rel="noopener" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="<?= BASE_URL ?>index.php?act=news" aria-label="Tin tức">
              <i class="far fa-newspaper"></i>
            </a>
            <a href="<?= BASE_URL ?>index.php?act=contact" aria-label="Liên hệ">
              <i class="fas fa-headset"></i>
            </a>
            <a href="<?= BASE_URL ?>index.php?act=cart" aria-label="Giỏ vé">
              <i class="fas fa-ticket-alt"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="col-lg-2 col-md-4 footer-column">
        <h3 class="footer-nav-title">T&agrave;i kho&#7843;n</h3>
        <ul class="footer-links">
          <?php if (!empty($_SESSION['user'])): ?>
            <li><a href="<?= BASE_URL ?>index.php?act=account">H&#7891; s&#417; c&aacute; nh&acirc;n</a></li>
            <li><a href="<?= BASE_URL ?>index.php?act=myorders">&#272;&#417;n c&#7911;a t&ocirc;i</a></li>
            <li><a href="<?= BASE_URL ?>index.php?act=account">C&#7853;p nh&#7853;t t&agrave;i kho&#7843;n</a></li>
            <li><a href="<?= BASE_URL ?>index.php?act=logout">&#272;&#259;ng xu&#7845;t</a></li>
          <?php else: ?>
            <li><a href="<?= BASE_URL ?>index.php?act=login">&#272;&#259;ng nh&#7853;p</a></li>
            <li><a href="<?= BASE_URL ?>index.php?act=registration">&#272;&#259;ng k&yacute;</a></li>
            <li><a href="<?= BASE_URL ?>index.php?act=forgetpassword">Qu&ecirc;n m&#7853;t kh&#7849;u</a></li>
            <li><a href="<?= BASE_URL ?>index.php?act=cart">Gi&#7887; v&eacute;</a></li>
          <?php endif; ?>
        </ul>
      </div>

      <div class="col-lg-2 col-md-4 footer-column">
        <h3 class="footer-nav-title">Kh&aacute;m ph&aacute;</h3>
        <ul class="footer-links">
          <li><a href="<?= BASE_URL ?>index.php">Trang ch&#7911;</a></li>
          <li><a href="<?= BASE_URL ?>index.php?act=sanpham">Phim &#273;ang chi&#7871;u</a></li>
          <li><a href="<?= BASE_URL ?>index.php?act=news">Tin t&#7913;c phim</a></li>
          <li><a href="<?= BASE_URL ?>index.php?act=cart">Gi&#7887; h&agrave;ng</a></li>
        </ul>
      </div>

      <div class="col-lg-3 col-md-4 footer-column">
        <h3 class="footer-nav-title">H&#7895; tr&#7907;</h3>
        <ul class="footer-links">
          <li><a href="<?= BASE_URL ?>index.php?act=contact">Li&ecirc;n h&#7879; h&#7895; tr&#7907;</a></li>
          <li><a href="<?= BASE_URL ?>index.php?act=contact">Gi&#7901; ho&#7841;t &#273;&#7897;ng 08:00 - 22:00</a></li>
          <li><a href="<?= BASE_URL ?>index.php?act=news">Khuy&#7871;n m&atilde;i m&#7899;i</a></li>
          <?php if (!empty($_SESSION['user']) && (($_SESSION['user']['role'] ?? '') === 'admin')): ?>
            <li><a href="<?= ADMIN_URL ?>">Trang qu&#7843;n tr&#7883;</a></li>
          <?php else: ?>
            <li><a href="<?= BASE_URL ?>index.php?act=login">Th&agrave;nh vi&ecirc;n CineTicket</a></li>
          <?php endif; ?>
        </ul>
      </div>
    </div>

    <div class="row site-footer-bottom">
      <div class="col-md-6">
        <p>Copyright &copy; 2026 CineTicket. &#272;&#7863;t v&eacute; nhanh, ch&#7885;n gh&#7871; d&#7877; v&agrave; theo d&otilde;i &#432;u &#273;&atilde;i t&#7841;i m&#7897;t n&#417;i.</p>
      </div>
      <div class="col-md-6 text-md-right">
        <p>Hotline 1900 9999 | support@cineticket.com</p>
      </div>
    </div>
  </div>
</footer>

<script src="<?= BASE_URL ?>assets/js/jquery-1.11.3.min.js"></script>
<script src="<?= BASE_URL ?>assets/bootstrap/js/bootstrap.min.js"></script>
<script src="<?= BASE_URL ?>assets/js/jquery.countdown.js"></script>
<script src="<?= BASE_URL ?>assets/js/jquery.isotope-3.0.6.min.js"></script>
<script src="<?= BASE_URL ?>assets/js/waypoints.js"></script>
<script src="<?= BASE_URL ?>assets/js/owl.carousel.min.js"></script>
<script src="<?= BASE_URL ?>assets/js/jquery.magnific-popup.min.js"></script>
<script src="<?= BASE_URL ?>assets/js/jquery.meanmenu.min.js"></script>
<script src="<?= BASE_URL ?>assets/js/sticker.js"></script>
<script src="<?= BASE_URL ?>assets/js/main.js"></script>
<?php if (($act ?? '') === 'payment'): ?>
<script src="<?= BASE_URL ?>assets/js/payment.js?v=<?= time() ?>"></script>
<?php endif; ?>
<script>
  (function () {
    var menus = document.querySelectorAll('.account-menu');
    if (!menus.length) return;

    function closeAll(except) {
      menus.forEach(function (menu) {
        if (menu !== except) {
          menu.classList.remove('open');
          var toggle = menu.querySelector('.account-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    document.addEventListener('click', function (event) {
      var clickedMenu = event.target.closest('.account-menu');
      var clickedToggle = event.target.closest('.account-toggle');

      if (clickedToggle) {
        event.preventDefault();
        var menu = clickedToggle.closest('.account-menu');
        var isOpen = menu.classList.contains('open');
        closeAll(menu);
        menu.classList.toggle('open', !isOpen);
        clickedToggle.setAttribute('aria-expanded', String(!isOpen));
        return;
      }

      if (!clickedMenu) {
        closeAll();
      }
    });
  })();
</script>
</body>
</html>
