import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Gauge,
  Thermometer,
  ShieldAlert,
  Flame,
  Info,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReactorSimulator: React.FC = () => {
  const { lang, t, setActiveTab } = useApp();

  // Reactor state controls
  const [controlRodInsertion, setControlRodInsertion] = useState<number>(45); // % inserted
  const [coolantFlow, setCoolantFlow] = useState<number>(75); // % pump flow
  const [boronPpm, setBoronPpm] = useState<number>(850); // Chemical shim PPM
  const [isScrammed, setIsScrammed] = useState<boolean>(false);
  const [simActive, setSimActive] = useState<boolean>(true);

  // Computed physical metrics
  const [thermalPower, setThermalPower] = useState<number>(2400); // MWt
  const [coreTemp, setCoreTemp] = useState<number>(315); // °C
  const [neutronFlux, setNeutronFlux] = useState<number>(2.8); // x 10^13
  const [reactivity, setReactivity] = useState<number>(0.0); // pcm

  // Simulation physics loop
  useEffect(() => {
    if (!simActive) return;

    const interval = setInterval(() => {
      if (isScrammed) {
        // Scrammed: power drops rapidly
        setThermalPower((p) => Math.max(12, Math.round(p * 0.85)));
        setCoreTemp((temp) => Math.max(65, Math.round(temp * 0.92)));
        setNeutronFlux((f) => Math.max(0.05, Number((f * 0.8).toFixed(2))));
        setReactivity(-2500);
        return;
      }

      // Physics approximation:
      // More insertion = more absorption = lower power & flux
      // Lower coolant flow = higher temp
      const rodFactor = (100 - controlRodInsertion) / 100;
      const boronFactor = Math.max(0.3, (1500 - boronPpm) / 1000);
      const targetPower = Math.round(3200 * rodFactor * boronFactor);

      // Temperature depends on power vs coolant
      const heatGeneration = targetPower;
      const heatRemoval = coolantFlow * 32;
      const tempDiff = (heatGeneration - heatRemoval) / 25;
      const targetTemp = Math.round(290 + tempDiff);

      setThermalPower((prev) => Math.round(prev + (targetPower - prev) * 0.2));
      setCoreTemp((prev) => Math.round(prev + (targetTemp - prev) * 0.15));
      setNeutronFlux(Number((rodFactor * 3.6).toFixed(2)));

      const reactPcm = Math.round((rodFactor - 0.55) * 600 - (boronPpm - 800) * 0.4);
      setReactivity(reactPcm);
    }, 400);

    return () => clearInterval(interval);
  }, [controlRodInsertion, coolantFlow, boronPpm, isScrammed, simActive]);

  // SCRAM trigger
  const triggerScram = () => {
    setIsScrammed(true);
    setControlRodInsertion(100);
  };

  // Reset nominal state
  const resetReactor = () => {
    setIsScrammed(false);
    setControlRodInsertion(45);
    setCoolantFlow(75);
    setBoronPpm(850);
  };

  // High temp warning state
  const isHighTemp = coreTemp > 380;
  const isCriticalTemp = coreTemp > 430;

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 text-xs font-semibold mb-3">
          <Zap className="size-4 animate-bounce" />
          <span>إشراف المهندس محمود إسماعيل شلتوت — خبير الكيمياء النووية</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t.reactor.title}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {t.reactor.subtitle}
        </p>
      </div>

      {/* Main Console Box */}
      <div className="k rounded-3xl border border-slate-200 dark:border-white/15 bg-white/95 dark:bg-[#090e1f] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span
              className={`size-3.5 rounded-full animate-ping ${
                isScrammed
                  ? 'bg-rose-500'
                  : isCriticalTemp
                  ? 'bg-rose-500'
                  : isHighTemp
                  ? 'bg-amber-500'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {isScrammed
                ? t.reactor.scramAlert
                : isCriticalTemp
                ? 'خطر وشيك: حرارة قلب المفاعل فوق الحد الحرج!'
                : isHighTemp
                ? t.reactor.warningStatus
                : t.reactor.normalStatus}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetReactor}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 transition"
            >
              <RotateCcw className="size-3.5" />
              <span>إعادة الضبط الاسمي</span>
            </button>

            <button
              onClick={triggerScram}
              className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
            >
              <ShieldAlert className="size-4" />
              <span>{t.reactor.scram}</span>
            </button>
          </div>
        </div>

        {/* Top Gauges Display Grid */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Gauge 1: Power */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-start">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{t.reactor.power}</span>
              <Zap className="size-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {thermalPower}{' '}
              <span className="text-xs font-semibold text-cyan-500">MWt</span>
            </div>
            <div className="mt-2 w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (thermalPower / 3200) * 100)}%` }}
              />
            </div>
          </div>

          {/* Gauge 2: Core Temperature */}
          <div
            className={`p-4 rounded-2xl border text-start transition ${
              isHighTemp
                ? 'bg-rose-500/10 border-rose-500/40'
                : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{t.reactor.temp}</span>
              <Thermometer
                className={`size-4 ${isHighTemp ? 'text-rose-500 animate-bounce' : 'text-amber-400'}`}
              />
            </div>
            <div
              className={`mt-2 text-2xl sm:text-3xl font-black ${
                isHighTemp ? 'text-rose-500' : 'text-slate-900 dark:text-white'
              }`}
            >
              {coreTemp} <span className="text-xs font-semibold">°C</span>
            </div>
            <div className="mt-2 w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isHighTemp ? 'bg-rose-500' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, (coreTemp / 500) * 100)}%` }}
              />
            </div>
          </div>

          {/* Gauge 3: Neutron Flux */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-start">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{t.reactor.flux}</span>
              <Gauge className="size-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {neutronFlux}{' '}
              <span className="text-[10px] font-semibold text-blue-400">×10¹³</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-400">نيوترون/سم²·ثانية</div>
          </div>

          {/* Gauge 4: Reactivity */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-start">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{t.reactor.reactivity}</span>
              <Gauge className="size-4 text-emerald-400" />
            </div>
            <div
              className={`mt-2 text-2xl sm:text-3xl font-black ${
                reactivity < 0
                  ? 'text-cyan-500'
                  : reactivity === 0
                  ? 'text-emerald-400'
                  : 'text-amber-500'
              }`}
            >
              {reactivity > 0 ? `+${reactivity}` : reactivity}{' '}
              <span className="text-xs font-semibold">pcm</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-400">
              {reactivity === 0 ? 'حرج (مستقر)' : reactivity > 0 ? 'فوق الحرج' : 'تحت الحرج'}
            </div>
          </div>
        </div>

        {/* Central Visual: Reactor Core & Controls */}
        <div className="mt-8 grid lg:grid-cols-12 gap-8 items-center">
          {/* Visual Reactor Vessel Illustration (Col 7) */}
          <div className="lg:col-span-7 relative flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl bg-slate-950 border border-cyan-500/30 overflow-hidden">
            {/* Cherenkov blue radiation glow pulsing behind fuel */}
            <div
              className="absolute size-72 sm:size-96 rounded-full bg-cyan-500/30 blur-3xl pointer-events-none transition-all duration-700"
              style={{
                opacity: isScrammed ? 0.05 : Math.max(0.2, thermalPower / 3200),
                transform: `scale(${0.8 + (thermalPower / 3200) * 0.4})`,
              }}
            />

            {/* Core Vessel Frame */}
            <div className="relative w-full max-w-md h-80 border-4 border-slate-700/80 rounded-b-full bg-slate-900/90 p-4 flex flex-col items-center justify-between shadow-inner">
              {/* Top Control Rod Drive Mechanism */}
              <div className="w-full flex justify-around items-center px-4">
                {[1, 2, 3, 4, 5].map((rod) => (
                  <div key={rod} className="flex flex-col items-center">
                    <div className="w-1.5 h-6 bg-slate-600 rounded-t" />
                    {/* Control Rod Body moving down */}
                    <div
                      className="w-3 bg-gradient-to-b from-slate-400 via-slate-300 to-amber-500/80 rounded-b transition-all duration-300 shadow-md"
                      style={{
                        height: `${Math.max(15, (controlRodInsertion / 100) * 140)}px`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Reactor Core Water & Fuel Assembly Matrix */}
              <div className="w-full h-44 rounded-2xl bg-gradient-to-b from-cyan-950/70 to-blue-950/90 border border-cyan-500/40 relative overflow-hidden flex items-center justify-around px-4">
                {/* Cherenkov animated waves */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400/25 via-blue-600/15 to-transparent animate-pulse" />

                {/* Fuel Assemblies (U-235) */}
                {[1, 2, 3, 4, 5, 6].map((fuel) => (
                  <div
                    key={fuel}
                    className={`w-4 h-32 rounded-lg border flex flex-col justify-around py-1 transition-all duration-500 ${
                      isScrammed
                        ? 'bg-slate-800 border-slate-700'
                        : isHighTemp
                        ? 'bg-rose-900/80 border-rose-500 shadow-lg shadow-rose-500/50'
                        : 'bg-gradient-to-b from-cyan-600 to-blue-700 border-cyan-400/60 shadow-lg shadow-cyan-500/40'
                    }`}
                  >
                    {[1, 2, 3, 4].map((dot) => (
                      <span
                        key={dot}
                        className={`size-1.5 rounded-full mx-auto ${
                          isScrammed ? 'bg-slate-600' : 'bg-cyan-200 animate-ping'
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Bottom Inlets */}
              <div className="w-full flex justify-between px-6 text-[11px] text-cyan-400/80 font-mono">
                <span className="flex items-center gap-1">← مدخل التبريد</span>
                <span className="flex items-center gap-1">مخرج البخار →</span>
              </div>
            </div>

            {/* Vessel Label */}
            <div className="mt-4 text-center">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                PWR Core: U-235 Fuel Assembly Matrix
              </span>
            </div>
          </div>

          {/* Sliders & Interactive Controls (Col 5) */}
          <div className="lg:col-span-5 space-y-6 text-start">
            {/* Control Rod Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-bold text-slate-800 dark:text-white">
                  {t.reactor.controlRods}
                </label>
                <span className="text-sm font-mono font-black text-cyan-500">
                  {controlRodInsertion}%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {t.reactor.controlRodsDesc}
              </p>
              <input
                type="range"
                min="0"
                max="100"
                value={controlRodInsertion}
                onChange={(e) => {
                  setControlRodInsertion(Number(e.target.value));
                  if (isScrammed) setIsScrammed(false);
                }}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>0% (خروج كامل - أقصى قدرة)</span>
                <span>100% (إدخال كامل)</span>
              </div>
            </div>

            {/* Coolant Flow Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-bold text-slate-800 dark:text-white">
                  {t.reactor.coolantFlow}
                </label>
                <span className="text-sm font-mono font-black text-blue-500">
                  {coolantFlow}%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {t.reactor.coolantDesc}
              </p>
              <input
                type="range"
                min="20"
                max="100"
                value={coolantFlow}
                onChange={(e) => setCoolantFlow(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>تدفق منخفض (سخونة)</span>
                <span>تدفق أقصى (تبريد تام)</span>
              </div>
            </div>

            {/* Chemical Boron Shim */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-bold text-slate-800 dark:text-white">
                  تركيز حمض البوريك (Chemical Shim)
                </label>
                <span className="text-sm font-mono font-black text-emerald-500">
                  {boronPpm} PPM
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                تحكم كيميائي لامتصاص النيوترونات الحرارية على المدى الطويل
              </p>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={boronPpm}
                onChange={(e) => setBoronPpm(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Scientific Tahsili Educational Notes */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900/40 to-cyan-950/30 border border-cyan-500/20 text-start">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-3">
            <Info className="size-4" />
            <span>{t.reactor.scientificNotes}</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              {t.reactor.note1}
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              {t.reactor.note2}
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              {t.reactor.note3}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
