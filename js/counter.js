/**
 * Real-Time Anniversary Counter & Countdown Timer
 * Celebrates October 13 for Sumanth & Teena Mohitha
 */

class AnniversaryCounter {
  constructor() {
    // Journey start date: October 13, 2025
    this.startDate = new Date(2025, 9, 13, 0, 0, 0); // Month 9 is October (0-indexed)
    localStorage.setItem('anniversary_start_date', this.startDate.toISOString());
    this.anniversaryMonth = 9; // October (0-indexed)
    this.anniversaryDay = 13;
    
    this.elements = {
      // Time together
      years: document.getElementById('count-years'),
      months: document.getElementById('count-months'),
      days: document.getElementById('count-days'),
      hours: document.getElementById('count-hours'),
      minutes: document.getElementById('count-minutes'),
      seconds: document.getElementById('count-seconds'),

      // Next Anniversary Countdown
      cdDays: document.getElementById('cd-days'),
      cdHours: document.getElementById('cd-hours'),
      cdMinutes: document.getElementById('cd-minutes'),
      cdSeconds: document.getElementById('cd-seconds'),
      cdHeadline: document.getElementById('countdown-headline')
    };

    this.init();
  }

  init() {
    this.update();
    setInterval(() => this.update(), 1000);
  }

  setStartDate(year, month, day) {
    this.startDate = new Date(year, month - 1, day, 0, 0, 0);
    localStorage.setItem('anniversary_start_date', this.startDate.toISOString());
    this.update();
  }

  update() {
    const now = new Date();

    // 1. Time Together Calculation
    let diff = now - this.startDate;
    if (diff < 0) diff = 0;

    let totalSeconds = Math.floor(diff / 1000);
    let totalMinutes = Math.floor(totalSeconds / 60);
    let totalHours = Math.floor(totalMinutes / 60);
    let totalDays = Math.floor(totalHours / 24);

    // Approximate Year & Month breakdown
    let years = Math.floor(totalDays / 365.25);
    let remainingDays = totalDays - Math.floor(years * 365.25);
    let months = Math.floor(remainingDays / 30.4375);
    let days = Math.floor(remainingDays % 30.4375);
    let hours = totalHours % 24;
    let minutes = totalMinutes % 60;
    let seconds = totalSeconds % 60;

    if (this.elements.years) this.elements.years.textContent = this.formatNum(years);
    if (this.elements.months) this.elements.months.textContent = this.formatNum(months);
    if (this.elements.days) this.elements.days.textContent = this.formatNum(days);
    if (this.elements.hours) this.elements.hours.textContent = this.formatNum(hours);
    if (this.elements.minutes) this.elements.minutes.textContent = this.formatNum(minutes);
    if (this.elements.seconds) this.elements.seconds.textContent = this.formatNum(seconds);

    // 2. Countdown to Next October 13
    let nextAnniversary = new Date(now.getFullYear(), this.anniversaryMonth, this.anniversaryDay, 0, 0, 0);
    if (now > nextAnniversary) {
      // Passed this year, target next year
      nextAnniversary.setFullYear(now.getFullYear() + 1);
    }

    let isTodayAnniversary = (now.getMonth() === this.anniversaryMonth && now.getDate() === this.anniversaryDay);

    if (isTodayAnniversary) {
      if (this.elements.cdHeadline) {
        this.elements.cdHeadline.innerHTML = "🎉 TODAY IS OUR ANNIVERSARY! HAPPY OCTOBER 13! 🎉";
      }
      if (this.elements.cdDays) this.elements.cdDays.textContent = "00";
      if (this.elements.cdHours) this.elements.cdHours.textContent = "00";
      if (this.elements.cdMinutes) this.elements.cdMinutes.textContent = "00";
      if (this.elements.cdSeconds) this.elements.cdSeconds.textContent = "00";
    } else {
      let cdDiff = nextAnniversary - now;
      let cdTotalSec = Math.floor(cdDiff / 1000);
      let cdD = Math.floor(cdTotalSec / (3600 * 24));
      let cdH = Math.floor((cdTotalSec % (3600 * 24)) / 3600);
      let cdM = Math.floor((cdTotalSec % 3600) / 60);
      let cdS = Math.floor(cdTotalSec % 60);

      if (this.elements.cdDays) this.elements.cdDays.textContent = this.formatNum(cdD);
      if (this.elements.cdHours) this.elements.cdHours.textContent = this.formatNum(cdH);
      if (this.elements.cdMinutes) this.elements.cdMinutes.textContent = this.formatNum(cdM);
      if (this.elements.cdSeconds) this.elements.cdSeconds.textContent = this.formatNum(cdS);
    }
  }

  formatNum(num) {
    return num < 10 ? `0${num}` : `${num}`;
  }
}

window.AnniversaryCounter = AnniversaryCounter;
