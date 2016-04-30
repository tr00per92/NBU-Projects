<?php if (isset($_SESSION['error'])): ?>
    <div class="alert alert-danger text-center">
        <button type="button" id="close-btn" class="close"><span>&times;</span></button>
        <?= $_SESSION['error'] ?>
    </div>
<?php unset($_SESSION['error']); endif; ?>
