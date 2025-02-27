document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            processImage(img, 50); // 初期値を50に（高劣化）
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('quality').addEventListener('input', function() {
    const quality = 51 - this.value; // 50が最低画質、1が最高画質に逆転
    const img = new Image();
    img.onload = function() {
        processImage(img, quality);
    };
    img.src = document.getElementById('canvas').toDataURL(); 
});

document.getElementById('download').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const link = document.createElement('a');
    link.download = 'kapikapi.png';
    link.href = canvas.toDataURL();
    link.click();
});

function processImage(img, quality) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // 画像の最大幅を150pxに制限し、比率を維持
    const maxWidth = 150;
    const scale = Math.min(maxWidth / img.width, 1);
    
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    // 画像をキャンバスに描画し、JPEGに圧縮
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const compressedData = canvas.toDataURL('image/jpeg', quality / 50);

    // 劣化した画像を再読み込み
    const degradedImg = new Image();
    degradedImg.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(degradedImg, 0, 0, canvas.width, canvas.height);
    };
    degradedImg.src = compressedData;
}
