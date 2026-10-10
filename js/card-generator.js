/**
 * Interactive Anniversary Greeting Card Generator & PNG Exporter
 * Allows custom message selection, theme customization, and HD export.
 */

class AnniversaryCardGenerator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.state = {
      theme: 'midnight-rose',
      coupleName: 'Sumanth & Teena Mohitha',
      dateText: 'Happy Anniversary • October 13, 2025',
      message: 'To my dearest Teena Mohitha, every second spent by your side feels like a gentle blessing from above. Happy Anniversary! Sumanth will cherish you forever. 💖✨',
      subtitle: 'With Eternal Love & Devotion'
    };

    this.themes = {
      'midnight-rose': {
        bgStart: '#140c1c',
        bgEnd: '#29122b',
        primary: '#ffd79e',
        secondary: '#ff4d79',
        accent: '#ffffff',
        border: 'rgba(212, 175, 55, 0.6)'
      },
      'champagne-gold': {
        bgStart: '#0e1118',
        bgEnd: '#1e1c15',
        primary: '#f5d77f',
        secondary: '#d4af37',
        accent: '#f8f5ee',
        border: 'rgba(245, 215, 127, 0.7)'
      },
      'velvet-crimson': {
        bgStart: '#1f080e',
        bgEnd: '#3d0a1a',
        primary: '#ffb3c1',
        secondary: '#ff4d6d',
        accent: '#fff0f3',
        border: 'rgba(255, 77, 109, 0.6)'
      },
      'celestial-sapphire': {
        bgStart: '#080e1e',
        bgEnd: '#112240',
        primary: '#80d0c7',
        secondary: '#00adb5',
        accent: '#e6f1ff',
        border: 'rgba(128, 208, 199, 0.6)'
      }
    };

    this.renderCard();
  }

  updateState(updates) {
    this.state = { ...this.state, ...updates };
    this.renderCard();
  }

  renderCard() {
    const width = 1200;
    const height = 750;
    this.canvas.width = width;
    this.canvas.height = height;
    const ctx = this.ctx;
    const theme = this.themes[this.state.theme] || this.themes['midnight-rose'];

    // 1. Background Gradient
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
    gradient.addColorStop(0, theme.bgEnd);
    gradient.addColorStop(1, theme.bgStart);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative Background Sparkles / Star Field
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < 40; i++) {
      const sx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
      const sy = (Math.cos(i * 77) * 0.5 + 0.5) * height;
      const sr = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Double Gold Luxury Border
    ctx.save();
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    // Corner Ornaments
    const cornerSize = 25;
    const corners = [
      [55, 55],
      [width - 55, 55],
      [55, height - 55],
      [width - 55, height - 55]
    ];
    ctx.fillStyle = theme.primary;
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 4. Romantic Header Icon / Monogram & Photo Badge
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '24px "Playfair Display", serif';
    ctx.fillStyle = theme.secondary;
    ctx.fillText('✨  S  ❤️  M  ✨', width / 2, 95);
    ctx.restore();

    // 5. Anniversary Date Banner
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '600 18px "Outfit", sans-serif';
    ctx.fillStyle = theme.primary;
    ctx.letterSpacing = '4px';
    ctx.fillText(this.state.dateText.toUpperCase(), width / 2, 135);
    ctx.restore();

    // 6. Couple Names in Regal Serif Typography
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'italic bold 52px "Playfair Display", serif';
    ctx.fillStyle = theme.primary;
    ctx.shadowColor = theme.secondary;
    ctx.shadowBlur = 18;
    ctx.fillText(this.state.coupleName, width / 2, 210);
    ctx.restore();

    // 7. Divider Line with Heart Center
    ctx.save();
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 180, 270);
    ctx.lineTo(width / 2 - 20, 270);
    ctx.moveTo(width / 2 + 20, 270);
    ctx.lineTo(width / 2 + 180, 270);
    ctx.stroke();

    ctx.font = '18px "Outfit", sans-serif';
    ctx.fillStyle = theme.secondary;
    ctx.textAlign = 'center';
    ctx.fillText('❦', width / 2, 276);
    ctx.restore();

    // 8. Custom Romantic / Professional Wish Text (Multi-line wrap)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '24px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = theme.accent;
    
    const maxTextWidth = 840;
    const lineHeight = 38;
    const lines = this.wrapText(this.state.message, maxTextWidth, ctx);
    
    const startY = 345 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    ctx.restore();

    // 9. Subtitle / Signature
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'italic 22px "Playfair Display", serif';
    ctx.fillStyle = theme.secondary;
    ctx.fillText(`“ ${this.state.subtitle} ”`, width / 2, 630);

    ctx.font = '14px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('Sumanth & Teena Mohitha • October 13 Milestone', width / 2, 665);
    ctx.restore();
  }

  wrapText(text, maxWidth, ctx) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  downloadCard(filename = 'Sumanth_Mohitha_Anniversary_Card.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvas.toDataURL('image/png', 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

window.AnniversaryCardGenerator = AnniversaryCardGenerator;
