let originalImage = null;

document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        originalImage = new Image();
        originalImage.crossOrigin = "anonymous";
        originalImage.onload = function() {
            drawOriginalImage();
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('quality').addEventListener('input', function() {
    const quality = this.value / 100; // 100 → 1.00, 1 → 0.01
    document.getElementById('quality-input').value = quality.toFixed(2);
    processImage(quality);
});

document.getElementById('quality-input').addEventListener('input', function() {
    let value = parseFloat(this.value);
    if (isNaN(value) || value < 0.01 || value > 1.00) return;
    document.getElementById('quality').value = (value * 100).toFixed(0);
    processImage(value);
});

document.getElementById('download').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const link = document.createElement('a');
    link.download = 'compressed.png';
    link.href = canvas.toDataURL();
    link.click();
});

function drawOriginalImage() {
    if (!originalImage) return;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const maxWidth = 200;
    const scale = Math.min(maxWidth / originalImage.width, 1);

    canvas.width = originalImage.width * scale;
    canvas.height = originalImage.height * scale;

    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
}

function processImage(quality) {
    if (!originalImage) return;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const maxWidth = 200;
    const scale = Math.min(maxWidth / originalImage.width, 1);

    canvas.width = originalImage.width * scale;
    canvas.height = originalImage.height * scale;

    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    const compressedData = canvas.toDataURL('image/jpeg', quality);

    const degradedImg = new Image();
    degradedImg.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(degradedImg, 0, 0, canvas.width, canvas.height);
    };
    degradedImg.src = compressedData;
}
