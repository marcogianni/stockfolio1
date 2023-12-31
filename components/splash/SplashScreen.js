import { RaceBy } from '@uiball/loaders'

export default function SplashScreen() {
  return (
    <div
      className="splash-screen top-0 bottom-0 fixed bg-black w-full min-h-screen flex justify-center items-center z-100"
      style={{ zIndex: 100, background: 'black', height: '100vh' }}
    >
      <div className="p-10 rounded-xl relative flex justify-center flex-col">
        <div className="flex justify-center flex-col items-center" style={{ width: 180 }}>
          <span className="hidden text-2xl font-bold sm:inline-block" style={{ color: 'white' }}>
            Stockfolio1
          </span>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 40 }}>
        <RaceBy size={150} lineWeight={5} speed={1.4} color="white" />
      </div>
    </div>
  )
}
