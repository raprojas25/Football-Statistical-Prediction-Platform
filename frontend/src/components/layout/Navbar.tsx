import { Link } from 'react-router-dom'
import { Trophy, Settings, Info } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-betano-surface border-b border-betano-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-betano-primary" />
            <span className="text-xl font-bold text-gradient">
              Sports Predictions
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-betano-card rounded-lg transition-colors">
              <Info className="w-5 h-5 text-betano-muted" />
            </button>
            <button className="p-2 hover:bg-betano-card rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-betano-muted" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}