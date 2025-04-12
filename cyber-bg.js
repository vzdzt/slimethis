class CyberBackgroundPainter {
  static get inputProperties() {
    return ['--primary', '--secondary', '--dark'];
  }

  paint(ctx, size, properties) {
    const primary = properties.get('--primary').toString().trim();
    const secondary = properties.get('--secondary').toString().trim();
    const dark = properties.get('--dark').toString().trim();
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, size.width, size.height);

    const time = Date.now() * 0.001;
    const particleCount = 50;

    // Particles
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.sin(time + i) * size.width / 2 + size.width / 2) % size.width;
      const y = (Math.cos(time + i * 0.7) * size.height / 2 + size.height / 2) % size.height;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? primary : secondary;
      ctx.globalAlpha = Math.random() * 0.5 + 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Subtle noise
    for (let i = 0; i < size.width * size.height * 0.01; i++) {
      const x = Math.random() * size.width;
      const y = Math.random() * size.height;
      ctx.fillStyle = primary;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(x, y, 1, 1);
      ctx.globalAlpha = 1;
    }
  }
}

registerPaint('cyber-bg', CyberBackgroundPainter);
