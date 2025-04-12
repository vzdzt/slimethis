class NeonGridPainter {
  static get inputProperties() {
    return ['--primary', '--glow', '--accent'];
  }

  paint(ctx, size, properties) {
    const primary = properties.get('--primary').toString().trim();
    const glow = properties.get('--glow').toString().trim();
    const accent = properties.get('--accent').toString().trim();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, size.width, size.height);

    const gridSize = 15;
    const time = Date.now() * 0.002;
    ctx.strokeStyle = primary;
    ctx.lineWidth = 0.8;
    ctx.shadowBlur = 8;
    ctx.shadowColor = glow;

    // Grid with glitch effect
    for (let x = 0; x <= size.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x + (Math.sin(time + x * 0.05) * 2), 0);
      ctx.lineTo(x + (Math.cos(time + x * 0.05) * 2), size.height);
      ctx.stroke();
    }
    for (let y = 0; y <= size.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y + (Math.sin(time + y * 0.05) * 2));
      ctx.lineTo(size.width, y + (Math.cos(time + y * 0.05) * 2));
      ctx.stroke();
    }

    // Accent pulses
    ctx.globalAlpha = Math.abs(Math.sin(time)) * 0.4 + 0.3;
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, size.width, size.height);
    ctx.globalAlpha = 1;
  }
}

registerPaint('neon-grid', NeonGridPainter);
