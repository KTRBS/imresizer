let originalImage = null; // 元画像を保存

document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        originalImage = new Image();
        originalImage.onload = function() {
            processImage(50); // 初期値を最大劣化
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('quality').addEventListener('input', function() {
    const quality = 51 - this.value; // 50→1（最悪画質）, 1→50（最高画質）
    if (originalImage) {
        processImage(quality);
    }
});

document.getElementById('download').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const link = document.createElement('a');
    link.download = 'kapikapi.png';
    link.href = canvas.toDataURL();
    link.click();
});

function processImage(quality) {
    if (!originalImage) return; // 元画像がない場合は処理しない

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // 画像の最大幅を150pxに制限し、比率を維持
    const maxWidth = 150;
    const scale = Math.min(maxWidth / originalImage.width, 1);
    
    canvas.width = originalImage.width * scale;
    canvas.height = originalImage.height * scale;

    // 元画像を使って再圧縮する
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    const compressedData = canvas.toDataURL('image/jpeg', quality / 100);

    // 劣化した画像をキャンバスに再描画
    const degradedImg = new Image();
    degradedImg.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(degradedImg, 0, 0, canvas.width, canvas.height);
    };
    degradedImg.src = compressedData;
}
