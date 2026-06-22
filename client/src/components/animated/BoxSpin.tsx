import './BoxSpin.css';

export const BoxSpin = () => {
  return (
    // <div className="relative justify-center items-center bg-slate-900 text-white overflow-hidden p-0.5 rounded-2xl">
    //   <div className="absolute top-[-25%] left-[-25%] before w-[150%] h-[150%] animate-border-spin"></div>
    //   <div className="absolute w-[98%] h-[98%] top-0 z-50  rounded-2xl flex justify-center items-center bg-gradient-to-b from-slate-900 to-slate-950">
    //     <div className=" ">Suscribete</div>
    //   </div>
    // </div>
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 p-[1px]">
      <div
        className="absolute bottom-[-220%] right-[-25%] h-[550%] w-[150%] animate-border-spin blur-sm"
        style={{
          background:
            'conic-gradient(rgb(244, 114 ,182, 0.6) 0deg, rgb(192, 132 ,252, 1) 0deg, transparent 100deg )',
        }}
      ></div>
      <div className="relative flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 px-3 py-1 text-white">
        <div className="text-xs">Suscribete</div>
      </div>
    </div>
  );
};
