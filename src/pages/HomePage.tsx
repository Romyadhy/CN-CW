import { Link } from "react-router-dom";

type GameCardProps = {
  to: string;
  emoji: string;
  title: string;
  description: string;
  badgeColor: string;
};

function GameCard({
  to,
  emoji,
  title,
  description,
  badgeColor,
}: GameCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-center justify-between gap-4 sm:gap-6 rounded-3xl 2xl:rounded-[2.5rem] bg-white p-6 sm:p-8 lg:p-10 2xl:p-14 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-200"
    >
      <span className="text-6xl sm:text-7xl md:text-8xl 2xl:text-9xl transform group-hover:scale-110 transition-transform duration-300 select-none">
        {emoji}
      </span>
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl 2xl:text-5xl font-extrabold text-green-800">
          {title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg 2xl:text-2xl text-gray-600 leading-relaxed max-w-md 2xl:max-w-xl">
          {description}
        </p>
      </div>
      <span
        className={`mt-2 rounded-full ${badgeColor} px-6 sm:px-8 2xl:px-12 py-2.5 sm:py-3.5 2xl:py-5 text-white font-bold text-base sm:text-xl 2xl:text-2xl shadow-md group-hover:shadow-lg active:scale-95 transition-all`}
      >
        Mulai Main! →
      </span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center gap-6 sm:gap-10 2xl:gap-16 p-4 sm:p-8 2xl:p-16 transition-colors duration-300">
      <header className="text-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-black text-green-900 tracking-tight">
          CN-CL-CW
        </h1>
        <p className="mt-2 sm:mt-3 text-green-700 text-base sm:text-xl 2xl:text-3xl font-semibold">
          <span className="font-bold text-green-800">C</span>alculated{" "}
          <span className="font-bold text-green-800">N</span>umber{" "}
          <span className="italic">and</span>{" "}
          <span className="font-bold text-green-800">C</span>omplete{" "}
          <span className="font-bold text-green-800">L</span>etter{" "}
          <span className="italic">and</span>{" "}
          <span className="font-bold text-green-800">C</span>omplete{" "}
          <span className="font-bold text-green-800">W</span>ord
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 2xl:gap-12 w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl 2xl:max-w-6xl">
        <GameCard
          to="/counting"
          emoji="🔢"
          title="Hitung Angka"
          description="Hitung jumlah benda yang muncul dan pilih angka yang benar!"
          badgeColor="bg-green-500 hover:bg-green-600"
        />
        <GameCard
          to="/letters"
          emoji="🔤"
          title="Lengkapi Huruf"
          description="Temukan huruf yang hilang dalam kata Indonesia!"
          badgeColor="bg-rose-500 hover:bg-rose-600"
        />
        <GameCard
          to="/sentences"
          emoji="📖"
          title="Lengkapi Kata"
          description="Lengkapi kalimat rumpang dengan kata yang paling tepat!"
          badgeColor="bg-amber-500 hover:bg-amber-600"
        />
      </main>

      <footer className="text-xs sm:text-sm 2xl:text-lg text-green-600 font-medium">
        Dirancang khusus untuk anak usia PAUD/TK
      </footer>
    </div>
  );
}
