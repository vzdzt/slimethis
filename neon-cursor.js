class NeonCursorPainter {
  static get inputProperties() {
    return ['--primary', '--glow'];
  }

  paint(ctx, size, properties) {
    const primary = properties.get('--primary').toString().trim();
    const glow = properties.get('--glow').toString().trim();
    const time = Date.now() * 0.005;
    const radius = size.width / 2;

    // Clear canvas
    ctx.clearRect(0, 0, size.width, size.height);

    // Flickering ring
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 1, 0, Math.PI * 2);
    ctx.strokeStyle = primary;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = glow;
    ctx.globalAlpha = Math.abs(Math.sin(time)) * 0.5 + 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Inner pulse
    ctx.beginPath();
    ctx.arc(radius, radius, radius / 2, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

registerPaint('neon-cursor', NeonCursorPainter);
