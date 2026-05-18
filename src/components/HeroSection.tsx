import { Leaf, Microscope, Shield, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-teal-900 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-300 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 border border-emerald-500/30 rounded-full px-4 py-2 text-emerald-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            AI-Powered Plant Pathology
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6">
            <span className="block text-white">Crop Disease</span>
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Detection System
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-emerald-100/80 leading-relaxed">
            Upload a photo of your crop leaf and get instant AI-powered disease diagnosis with detailed treatment recommendations and prevention strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Microscope, label: 'AI Analysis', desc: 'Deep learning CNN model', color: 'emerald' },
            { icon: Leaf, label: '6 Diseases', desc: 'PlantVillage dataset trained', color: 'teal' },
            { icon: Zap, label: 'Instant Results', desc: 'Under 3 second diagnosis', color: 'green' },
            { icon: Shield, label: 'Treatment Plan', desc: 'Actionable recommendations', color: 'emerald' },
          ].map(({ icon: Icon, label, desc, color }) => (
            <div
              key={label}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-emerald-400/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 text-${color}-300`} />
              </div>
              <p className="font-semibold text-white text-sm">{label}</p>
              <p className="text-emerald-200/60 text-xs mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    </section>
  );
}
