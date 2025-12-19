import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const OpticiansDashboard = () => {
  const [page, setPage] = useState('dashboard');
  const [selectedOptician, setSelectedOptician] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedDay, setSelectedDay] = useState(null);
  const [numberOfDiary, setNumberOfDiary] = useState(30);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const opticians = ['ROY', 'PTR', 'ALS', 'PDY', 'CLR', 'PAM'];
  
  const salesData = {
    ROY: { lens: 800, frame: 1500, fees: 300 },
    PTR: { lens: 750, frame: 1400, fees: 290 },
    ALS: { lens: 650, frame: 1200, fees: 250 },
    PDY: { lens: 720, frame: 1350, fees: 280 },
    CLR: { lens: 580, frame: 1100, fees: 220 },
    PAM: { lens: 690, frame: 1280, fees: 260 }
  };

  const formatCurrency = (amount) => `€${amount.toLocaleString()}`;

  const getTodayData = (optician) => {
    const data = salesData[optician];
    return { ...data, total: data.lens + data.frame + data.fees };
  };

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  const getDaysInMonth = (month, year = 2026) =>
    new Date(year, months.indexOf(month) + 1, 0).getDate();

  const generateDailySales = (optician, month) => {
    const days = getDaysInMonth(month);
    const base = salesData[optician];

    return Array.from({ length: days }, (_, i) => {
      const variation = 0.7 + Math.random() * 0.6;
      const fees = Math.round(base.fees * variation);
      const frame = Math.round(base.frame * variation);
      const lens = Math.round(base.lens * variation);
      return { day: i + 1, fees, frame, lens, total: fees + frame + lens };
    });
  };

  /* ---------------- PAGE 3: DETAILS ---------------- */
  if (page === 'details' && selectedDay) {
    const d = selectedDay;

    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100 p-4">
        <button
          onClick={() => setPage('calendar')}
          className="mb-4 px-4 py-2 bg-white border-2 rounded-lg"
        >
          ← Back to Calendar
        </button>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6">{selectedOptician}</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {['fees','frame','lens'].map(k => (
              <div key={k} className="bg-stone-100 p-6 rounded-xl text-center">
                <p className="text-sm font-semibold text-stone-600">{k.toUpperCase()}</p>
                <p className="text-3xl font-bold text-stone-900">
                  {formatCurrency(d[k])}
                </p>
              </div>
            ))}
          </div>

          {/* TOTAL AMOUNT — BLACK */}
          <div className="bg-stone-100 p-8 rounded-xl text-center">
            <p className="text-lg font-semibold text-stone-700">TOTAL AMOUNT</p>
            <p className="text-5xl font-bold text-black">
              {formatCurrency(d.total)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- PAGE 2: CALENDAR (WITH STICKY NAV) ---------------- */
  if (page === 'calendar') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-50">

        {/* STICKY TOP NAVIGATION */}
        <div className="sticky top-0 z-50 bg-white border-b-2 border-stone-200 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setPage('dashboard')}
              className="px-4 py-2 bg-stone-100 border-2 rounded-lg font-medium"
            >
              ← Back to Dashboard
            </button>

            <p className="font-semibold text-stone-700">
              {selectedOptician} · Calendar
            </p>
          </div>
        </div>

        {/* CALENDAR CONTENT */}
        <div className="p-4">
          {months.map(month => {
            const dailySales = generateDailySales(selectedOptician, month);

            return (
              <div key={month} className="bg-white rounded-xl p-6 mb-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">{month} 2026</h3>

                <div className="grid grid-cols-7 gap-2">
                  {dailySales.map(d => (
                    <div
                      key={d.day}
                      onClick={() => {
                        setSelectedDay({ ...d, month });
                        setPage('details');
                      }}
                      className="p-3 border rounded-lg cursor-pointer text-center"
                    >
                      <p className="text-xs text-gray-400">{d.day}</p>

                      {/* COLOR RULE */}
                      <p className={`font-bold ${d.total < 2600 ? 'text-red-600' : 'text-black'}`}>
                        {formatCurrency(d.total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------- PAGE 1: DASHBOARD ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50 p-4">
      {opticians.map(o => {
        const d = getTodayData(o);
        return (
          <div
            key={o}
            onClick={() => {
              setSelectedOptician(o);
              setPage('calendar');
            }}
            className="bg-white p-4 rounded-xl mb-4 cursor-pointer shadow-lg"
          >
            <h3 className="text-xl font-bold">{o}</h3>
            <p className="text-lg font-semibold">
              {formatCurrency(Math.round(d.total / 30))}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default OpticiansDashboard;
