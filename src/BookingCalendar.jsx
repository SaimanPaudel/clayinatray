import React, { useState } from 'react';

/**
 * BookingCalendar
 * Props:
 *   bookedRanges  — array of { checkIn: ISOString, checkOut: ISOString }
 *   checkIn       — selected check-in date string (YYYY-MM-DD) or ''
 *   checkOut      — selected check-out date string (YYYY-MM-DD) or ''
 *   onCheckIn     — fn(dateStr) called when user picks check-in
 *   onCheckOut    — fn(dateStr) called when user picks check-out
 *   maxGuests     — max guests number (for display, optional)
 */
export default function BookingCalendar({ bookedRanges = [], checkIn, checkOut, onCheckIn, onCheckOut }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Which month/year the calendar is showing
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  // Selection phase: 'checkin' or 'checkout'
  const [selecting, setSelecting] = useState(checkIn ? 'checkout' : 'checkin');
  const [hoverDate, setHoverDate] = useState(null);

  // ── helpers ──────────────────────────────────────────────────────────────

  const toStr = (d) => {
    // Returns YYYY-MM-DD for a Date object using local time (not UTC)
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const fromStr = (s) => {
    // Parse YYYY-MM-DD without timezone issues
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const isBooked = (date) => {
    return bookedRanges.some(range => {
      const start = new Date(range.checkIn);
      const end = new Date(range.checkOut);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return date >= start && date < end;
    });
  };

  const isPast = (date) => date < today;

  const isCheckIn = (date) => checkIn && toStr(date) === checkIn;
  const isCheckOut = (date) => checkOut && toStr(date) === checkOut;

  const isInRange = (date) => {
    const start = checkIn ? fromStr(checkIn) : null;
    const end = (selecting === 'checkout' && hoverDate)
      ? hoverDate
      : checkOut ? fromStr(checkOut) : null;
    if (!start || !end) return false;
    return date > start && date < end;
  };

  // ── navigation ────────────────────────────────────────────────────────────

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // ── click handler ─────────────────────────────────────────────────────────

  const handleDayClick = (date) => {
    if (isPast(date) || isBooked(date)) return;
    const str = toStr(date);

    if (selecting === 'checkin') {
      onCheckIn(str);
      onCheckOut('');
      setSelecting('checkout');
    } else {
      // checkout phase
      if (checkIn && date <= fromStr(checkIn)) {
        // picked before check-in — restart
        onCheckIn(str);
        onCheckOut('');
        setSelecting('checkout');
        return;
      }
      // Make sure no booked days fall inside the range
      const rangeHasConflict = bookedRanges.some(range => {
        const rStart = new Date(range.checkIn);
        const rEnd = new Date(range.checkOut);
        rStart.setHours(0, 0, 0, 0);
        rEnd.setHours(0, 0, 0, 0);
        const selStart = fromStr(checkIn);
        return rStart > selStart && rStart < date;
      });
      if (rangeHasConflict) return; // blocked — can't span over a booked period
      onCheckOut(str);
      setSelecting('checkin');
    }
  };

  // ── build calendar grid ───────────────────────────────────────────────────

  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' });

  // Cells: nulls for leading empty slots + day numbers
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  // Pad to complete last week
  while (cells.length % 7 !== 0) cells.push(null);

  // ── night count ───────────────────────────────────────────────────────────
  const nights = checkIn && checkOut
    ? Math.round((fromStr(checkOut) - fromStr(checkIn)) / 86400000)
    : 0;

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="bc-wrap">
      <style>{`
        .bc-wrap {
          font-family: inherit;
          width: 100%;
        }

        /* Prompt bar */
        .bc-prompt {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
        }
        .bc-prompt-chip {
          flex: 1;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid #ccc;
          background: #fff;
          font-size: 12px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .bc-prompt-chip.active {
          border-color: #c0623a;
          background: #fff5f2;
        }
        .bc-prompt-chip label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.6px;
          color: #888;
          margin-bottom: 2px;
          text-transform: uppercase;
        }
        .bc-prompt-chip span {
          font-size: 13px;
          color: #2c2c2c;
          font-weight: 500;
        }

        /* Calendar header */
        .bc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .bc-nav {
          width: 30px; height: 30px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
          font-size: 15px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .bc-nav:hover { background: #f0ebe3; }
        .bc-month-label {
          font-size: 15px;
          font-weight: 600;
          color: #2c2c2c;
        }

        /* Day-of-week header */
        .bc-dow {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 4px;
        }
        .bc-dow-cell {
          text-align: center;
          font-size: 11px;
          font-weight: 600;
          color: #999;
          padding: 4px 0;
          letter-spacing: 0.4px;
        }

        /* Grid */
        .bc-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .bc-day {
          position: relative;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 500;
          color: #2c2c2c;
          cursor: pointer;
          border-radius: 50%;
          transition: background 0.12s, color 0.12s;
          user-select: none;
        }
        .bc-day:hover:not(.bc-day--disabled):not(.bc-day--booked) {
          background: #f0ebe3;
        }
        .bc-day--empty { cursor: default; }
        .bc-day--past {
          color: #ccc;
          cursor: not-allowed;
        }
        .bc-day--booked {
          color: #bbb;
          cursor: not-allowed;
          text-decoration: line-through;
        }
        /* Strikethrough slash for booked */
        .bc-day--booked::after {
          content: '';
          position: absolute;
          width: 70%; height: 1px;
          background: #d9b8ae;
          transform: rotate(-45deg);
          pointer-events: none;
        }
        .bc-day--today {
          font-weight: 700;
          border: 1.5px solid #c0623a;
        }
        .bc-day--checkin,
        .bc-day--checkout {
          background: #c0623a !important;
          color: #fff !important;
          border-radius: 50%;
          z-index: 2;
        }
        .bc-day--in-range {
          background: #f5ddd7;
          border-radius: 0;
          color: #2c2c2c;
        }
        /* Round the left edge of range on check-in */
        .bc-day--range-start {
          border-radius: 50% 0 0 50%;
        }
        .bc-day--range-end {
          border-radius: 0 50% 50% 0;
        }
        .bc-day--disabled {
          color: #ddd;
          cursor: not-allowed;
        }

        /* Legend */
        .bc-legend {
          display: flex;
          gap: 16px;
          margin-top: 12px;
          font-size: 11px;
          color: #888;
        }
        .bc-legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .bc-legend-dot {
          width: 12px; height: 12px;
          border-radius: 50%;
        }
        .bc-legend-dot--available { background: #c0623a; }
        .bc-legend-dot--booked {
          background: #ddd;
          position: relative;
          overflow: hidden;
        }
        .bc-legend-dot--booked::after {
          content: '';
          position: absolute;
          width: 130%; height: 1px;
          background: #bbb;
          top: 50%; left: -15%;
          transform: rotate(-45deg);
        }

        /* Night count */
        .bc-nights {
          margin-top: 10px;
          font-size: 13px;
          color: #c0623a;
          font-weight: 600;
          text-align: center;
        }

        /* Hint text */
        .bc-hint {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 8px;
        }
      `}</style>

      {/* Check-in / Check-out chips */}
      <div className="bc-prompt">
        <div
          className={`bc-prompt-chip ${selecting === 'checkin' ? 'active' : ''}`}
          onClick={() => setSelecting('checkin')}
        >
          <label>Check-in</label>
          <span>{checkIn ? fromStr(checkIn).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : 'Add date'}</span>
        </div>
        <div
          className={`bc-prompt-chip ${selecting === 'checkout' ? 'active' : ''}`}
          onClick={() => { if (checkIn) setSelecting('checkout'); }}
        >
          <label>Check-out</label>
          <span>{checkOut ? fromStr(checkOut).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : 'Add date'}</span>
        </div>
      </div>

      {/* Month nav */}
      <div className="bc-header">
        <button className="bc-nav" onClick={prevMonth}>‹</button>
        <span className="bc-month-label">{monthName} {viewYear}</span>
        <button className="bc-nav" onClick={nextMonth}>›</button>
      </div>

      {/* Day-of-week labels */}
      <div className="bc-dow">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="bc-dow-cell">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="bc-grid">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} className="bc-day bc-day--empty" />;

          const date = new Date(viewYear, viewMonth, day);
          date.setHours(0, 0, 0, 0);

          const past = isPast(date);
          const booked = isBooked(date);
          const todayMark = toStr(date) === toStr(today);
          const ciDay = isCheckIn(date);
          const coDay = isCheckOut(date);
          const inRange = isInRange(date);

          // Detect range edges for rounding
          const checkInDate = checkIn ? fromStr(checkIn) : null;
          const endDate = (selecting === 'checkout' && hoverDate)
            ? hoverDate
            : checkOut ? fromStr(checkOut) : null;

          const isRangeStart = checkInDate && toStr(date) === toStr(checkInDate) && endDate && date < endDate;
          const isRangeEnd = endDate && toStr(date) === toStr(endDate) && checkInDate && date > checkInDate;

          let cls = 'bc-day';
          if (past) cls += ' bc-day--past';
          else if (booked) cls += ' bc-day--booked';
          else {
            if (ciDay) cls += ' bc-day--checkin';
            else if (coDay) cls += ' bc-day--checkout';
            else if (inRange) {
              cls += ' bc-day--in-range';
              if (isRangeStart) cls += ' bc-day--range-start';
              if (isRangeEnd) cls += ' bc-day--range-end';
            }
          }
          if (todayMark && !ciDay && !coDay) cls += ' bc-day--today';

          return (
            <div
              key={idx}
              className={cls}
              onClick={() => handleDayClick(date)}
              onMouseEnter={() => !past && !booked && setHoverDate(date)}
              onMouseLeave={() => setHoverDate(null)}
              title={booked ? 'Already booked' : undefined}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Night count or hint */}
      {nights > 0
        ? <div className="bc-nights">✓ {nights} night{nights > 1 ? 's' : ''} selected</div>
        : <div className="bc-hint">
            {selecting === 'checkin' ? 'Select your check-in date' : 'Now select your check-out date'}
          </div>
      }

      {/* Legend */}
      <div className="bc-legend">
        <div className="bc-legend-item">
          <div className="bc-legend-dot bc-legend-dot--available" />
          Selected
        </div>
        <div className="bc-legend-item">
          <div className="bc-legend-dot bc-legend-dot--booked" />
          Unavailable
        </div>
      </div>
    </div>
  );
}
