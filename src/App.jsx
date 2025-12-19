import React, { useState } from 'react';
import { Calendar, ArrowRight, X } from 'lucide-react';

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

  const formatCurrency = (amount) => {
    return `€${amount.toLocaleString()}`;
  };

  const getTodayData = (optician) => {
    const data = salesData[optician];
    const total = data.lens + data.frame + data.fees;
    return { ...data, total };
  };

  const getTotalSales = () => {
    return Object.values(salesData).reduce((sum, data) => 
      sum + data.lens + data.frame + data.fees, 0
    );
  };

  const getOverallAverage = () => {
    return Math.round(getTotalSales() / opticians.length);
  };

  const getAverageBreakdown = () => {
    const totals = Object.values(salesData).reduce((acc, data) => ({
      fees: acc.fees + data.fees,
      frame: acc.frame + data.frame,
      lens: acc.lens + data.lens
    }), { fees: 0, frame: 0, lens: 0 });

    return {
      fees: Math.round(totals.fees / opticians.length),
      frame: Math.round(totals.frame / opticians.length),
      lens: Math.round(totals.lens / opticians.length)
    };
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month, year = 2026) => {
    const monthIndex = months.indexOf(month);
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const generateDailySales = (optician, month) => {
    const days = getDaysInMonth(month);
    const dailySales = [];
    const baseData = salesData[optician];
    
    for (let day = 1; day <= days; day++) {
      const variation = 0.7 + Math.random() * 0.6;
      const fees = Math.round(baseData.fees * variation);
      const frame = Math.round(baseData.frame * variation);
      const lens = Math.round(baseData.lens * variation);
      const dailyTotal = fees + frame + lens;
      
      dailySales.push({
        day,
        fees,
        frame,
        lens,
        total: dailyTotal
      });
    }
    return dailySales;
  };

  // Fixed Navigation Bar Component
  const NavigationBar = () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b-2 border-stone-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            if (page === 'details') {
              setPage('calendar');
              setSelectedDay(null);
            } else if (page === 'calendar') {
              setPage('dashboard');
            }
          }}
          disabled={page === 'dashboard'}
          className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition ${
            page === 'dashboard'
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          ← Back
        </button>
        
        <div className="text-center">
          <p className="text-xs sm:text-sm font-semibold text-stone-600">
            {page === 'dashboard' && 'Dashboard'}
            {page === 'calendar' && `${selectedOptician} Calendar`}
            {page === 'details' && `${selectedOptician} - Day Details`}
          </p>
        </div>
        
        <div className="w-20"></div>
      </div>
    </div>
  );

  // Page 1 - Dashboard
  if (page === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100">
        <NavigationBar />
        <div className="max-w-6xl mx-auto px-2 sm:px-4 pb-4 pt-20">
          {/* Header with Logo */}
          <div className="mb-4 sm:mb-6">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-stone-200">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                    <div className="h-px w-8 sm:w-16 bg-stone-300"></div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full border-2 border-stone-400"></div>
                      <div className="w-2 h-2 rounded-full border-2 border-stone-400"></div>
                    </div>
                    <div className="h-px w-8 sm:w-16 bg-stone-300"></div>
                  </div>
                  
                  <h1 className="text-2xl sm:text-4xl font-bold text-stone-800 tracking-wider mb-1">
                    CROWLEYS
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-600 tracking-widest font-light">Opticians</p>
                  
                  <div className="h-px w-32 sm:w-48 bg-stone-300 mx-auto mt-2 sm:mt-3"></div>
                </div>
              </div>
              
              {/* FIXED: Date and Diary Average - Now Stacked on Mobile */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-3 sm:mt-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs sm:text-sm text-stone-600 font-medium whitespace-nowrap">Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-2 sm:px-3 py-1 border-2 border-stone-300 rounded-lg text-xs sm:text-sm font-medium text-stone-700 hover:border-emerald-400 transition cursor-pointer flex-1 sm:flex-none"
                  />
                </div>
                <p className="text-emerald-700 font-semibold text-xs sm:text-sm w-full sm:w-auto text-left sm:text-center">
                  Diary Average So Far
                </p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-3 sm:mb-4">
            <div className="grid grid-cols-3 gap-1 sm:gap-2 max-w-full">
              <div className="bg-emerald-100 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg border border-emerald-200 flex items-center justify-center">
                <h2 className="text-base sm:text-2xl font-bold text-emerald-800 text-center">All Diary</h2>
              </div>
              
              <div className="bg-emerald-100 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg border border-emerald-200 flex items-center justify-center">
                <div className="w-full">
                  <p className="text-emerald-700 text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 text-center">Average Sale</p>
                  <h2 className="text-base sm:text-2xl font-bold text-emerald-800 text-center">{formatCurrency(getOverallAverage())}</h2>
                </div>
              </div>
              
              <div className="bg-emerald-100 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg border border-emerald-200">
                {(() => {
                  const avgBreakdown = getAverageBreakdown();
                  return (
                    <div className="flex flex-col justify-center h-full space-y-0.5 sm:space-y-1">
                      <div className="text-center">
                        <p className="text-emerald-700 text-[9px] sm:text-xs font-medium">
                          AVG FEES - {formatCurrency(avgBreakdown.fees)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-emerald-700 text-[9px] sm:text-xs font-medium">
                          AVG FRAME - {formatCurrency(avgBreakdown.frame)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-emerald-700 text-[9px] sm:text-xs font-medium">
                          AVG LENS - {formatCurrency(avgBreakdown.lens)}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Opticians Cards */}
          <div className="space-y-3 sm:space-y-4">
            {opticians.map(optician => {
              const data = getTodayData(optician);
              return (
                <div
                  key={optician}
                  onClick={() => {
                    setSelectedOptician(optician);
                    setPage('calendar');
                  }}
                  className="bg-white rounded-lg sm:rounded-xl shadow-lg border-2 border-stone-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer"
                >
                  <div className="grid grid-cols-3 gap-0">
                    <div className="bg-white p-2 sm:p-3 flex items-center justify-center border-r border-stone-300">
                      <h3 className="text-base sm:text-xl font-bold text-stone-800 tracking-wide">{optician}</h3>
                    </div>

                    <div 
                      className="bg-white p-2 sm:p-3 border-r border-stone-300 flex items-center justify-center cursor-pointer hover:bg-stone-50 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOptician(optician);
                        setPage('calendar');
                      }}
                    >
                      <div className="w-full">
                        <p className="text-lg sm:text-2xl font-bold text-stone-800 text-center">{formatCurrency(Math.round(data.total / 30))}</p>
                      </div>
                    </div>

                    <div className="bg-white p-2 sm:p-3">
                      <div className="space-y-1 sm:space-y-2">
                        <div className="w-full pb-1 sm:pb-2 border-b border-stone-300">
                          <p className="text-stone-700 text-[10px] sm:text-xs font-semibold mb-0.5 text-center">FEES</p>
                          <p className="text-sm sm:text-lg font-bold text-stone-800 text-center">{formatCurrency(data.fees)}</p>
                        </div>
                        <div className="w-full pb-1 sm:pb-2 border-b border-stone-300">
                          <p className="text-stone-700 text-[10px] sm:text-xs font-semibold mb-0.5 text-center">FRAME AMOUNT</p>
                          <p className="text-sm sm:text-lg font-bold text-stone-800 text-center">{formatCurrency(data.frame)}</p>
                        </div>
                        <div className="w-full pt-1 sm:pt-2">
                          <p className="text-stone-700 text-[10px] sm:text-xs font-semibold mb-0.5 text-center">LENS AMOUNT</p>
                          <p className="text-sm sm:text-lg font-bold text-stone-800 text-center">{formatCurrency(data.lens)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between border-t border-stone-200">
                    <span className="text-[10px] sm:text-xs text-emerald-700 font-medium">
                      No. of Diary: {numberOfDiary}
                    </span>
                    <span className="text-[10px] sm:text-xs text-emerald-700 font-medium flex items-center gap-1">
                      Click to view calendar
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-[10px] sm:text-xs text-stone-600 font-medium">
              {opticians.join(' • ')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Page 3 - Day Details
  if (page === 'details' && selectedDay) {
    const dayData = selectedDay;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100">
        <NavigationBar />
        <div className="max-w-4xl mx-auto px-2 sm:px-4 pb-4 pt-20">
          <div className="bg-stone-50 rounded-xl shadow-lg border-2 border-stone-200 p-4 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-2">
                {selectedOptician}
              </h2>
              <p className="text-lg sm:text-xl text-gray-500">
                {dayData.month} {dayData.day}, 2026
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="bg-stone-100 rounded-xl p-4 sm:p-6 border-2 border-stone-300 shadow-md">
                <p className="text-stone-700 text-xs sm:text-sm font-semibold mb-2 text-center">FEES</p>
                <p className="text-2xl sm:text-3xl font-bold text-stone-900 text-center">{formatCurrency(dayData.fees)}</p>
              </div>

              <div className="bg-stone-100 rounded-xl p-4 sm:p-6 border-2 border-stone-300 shadow-md">
                <p className="text-stone-700 text-xs sm:text-sm font-semibold mb-2 text-center">FRAME</p>
                <p className="text-2xl sm:text-3xl font-bold text-stone-900 text-center">{formatCurrency(dayData.frame)}</p>
              </div>

              <div className="bg-stone-100 rounded-xl p-4 sm:p-6 border-2 border-stone-300 shadow-md">
                <p className="text-stone-700 text-xs sm:text-sm font-semibold mb-2 text-center">LENS</p>
                <p className="text-2xl sm:text-3xl font-bold text-stone-900 text-center">{formatCurrency(dayData.lens)}</p>
              </div>

              <div className="bg-stone-100 rounded-xl p-4 sm:p-6 border-2 border-stone-300 shadow-md">
                <p className="text-stone-700 text-xs sm:text-sm font-semibold mb-2 text-center">LINK</p>
                <a 
                  href="https://docs.google.com/spreadsheets" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xl sm:text-2xl font-bold text-stone-900 text-center block hover:text-emerald-700 transition underline"
                >
                  View Sheet
                </a>
              </div>
            </div>

            <div className="bg-emerald-100 rounded-xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl">
              <p className="text-emerald-700 text-base sm:text-lg font-semibold mb-2 text-center">TOTAL AMOUNT</p>
              <p className="text-3xl sm:text-5xl font-bold text-emerald-800 text-center">{formatCurrency(dayData.total)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Page 2 - Calendar - FIXED: Smaller numbers that fit in boxes
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
      <NavigationBar />
      <div className="max-w-6xl mx-auto px-2 sm:px-4 pb-4 pt-20">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border-2 border-stone-200 p-3 sm:p-6 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-600" />
              <h2 className="text-lg sm:text-2xl font-bold text-stone-800">
                {selectedOptician} - Calendar 2026
              </h2>
            </div>
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 sm:px-4 py-2 border-2 border-stone-300 rounded-lg text-sm sm:text-base font-semibold text-stone-800 hover:border-emerald-400 transition cursor-pointer w-full sm:w-auto"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {months.map(month => {
            const dailySales = generateDailySales(selectedOptician, month);
            const monthTotal = dailySales.reduce((sum, day) => sum + day.total, 0);
            
            return (
              <div 
                key={month}
                id={month}
                className="bg-white rounded-lg sm:rounded-xl shadow-lg border-2 border-stone-200 p-3 sm:p-6"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-xl font-bold text-stone-800">{month} 2026</h3>
                  <div className="text-right">
                    <p className="text-[10px] sm:text-xs text-stone-600 font-semibold">Month Total</p>
                    <p className="text-sm sm:text-lg font-bold text-emerald-700">{formatCurrency(monthTotal)}</p>
                  </div>
                </div>

                {/* FIXED: Calendar Grid with Responsive Text Sizes */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  <div className="text-center font-bold text-[10px] sm:text-xs text-stone-600 py-1 sm:py-2">Sun</div>
                  <div className="text-center font-bold text-[10px] sm:text-xs text-stone-600 py-1 sm:py-2">Mon</div>
                  <div className="text-center font-bold text-[10px] sm:text-xs text-stone-600 py-1 sm:py-2">Tue</div>
                  <div className="text-center font-bold text-[10px] sm:text-xs text-stone-600 py-1 sm:py-2">Wed</div>
                  <div className="text-center font-bold text-[10px] sm:text-xs text-stone-600 py-1 sm:py-2">Thu</div>
                  <div className="text-center font-bold text-[10px] sm:text-xs text-stone-600 py-1 sm:py-2">Fri</div>
                  <div className="text-center font-bold text-[10px] sm:text-xs text-stone-600 py-1 sm:py-2">Sat</div>

                  {(() => {
                    const firstDay = new Date(2026, months.indexOf(month), 1).getDay();
                    const emptyCells = [];
                    for (let i = 0; i < firstDay; i++) {
                      emptyCells.push(
                        <div key={`empty-${i}`} className="bg-stone-50 rounded-md sm:rounded-lg p-1 sm:p-2 border border-stone-200"></div>
                      );
                    }
                    return emptyCells;
                  })()}

                  {/* FIXED: Day cells with smaller, responsive text */}
                  {dailySales.map(({ day, total, fees, frame, lens }) => (
                    <div
                      key={day}
                      onClick={() => {
                        setSelectedDay({ day, total, fees, frame, lens, month });
                        setPage('details');
                      }}
                      className="bg-gradient-to-br from-white to-emerald-50 rounded-md sm:rounded-lg p-1.5 sm:p-3 border-2 border-stone-200 hover:border-emerald-400 transition cursor-pointer min-h-[50px] sm:min-h-[70px] flex items-center justify-center"
                    >
                      <div className="text-center w-full">
                        <p className="text-[9px] sm:text-xs font-medium text-gray-400 mb-0.5 sm:mb-2">{day}</p>
                        <p className={`text-xs sm:text-base md:text-xl font-bold ${total < 2600 ? 'text-red-600' : 'text-black'} break-words`}>
                          {formatCurrency(total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OpticiansDashboard;