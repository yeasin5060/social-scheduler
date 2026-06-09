import { CheckCircleIcon, ClockIcon, Share2Icon, TrendingUpIcon } from "lucide-react";
import { useState } from "react"


const Dashboard = () => {

  const [stats, setStats] = useState({scheduled: 0 , published : 0 , connectedAccounts : 0});
  const [activites , setActivites] = useState<any[]> ([]);

  const statCards = [
    {
      label : 'Scheduled Post',
      value : stats.scheduled,
      icon : ClockIcon,
      trend : '+2 day'
    },
    {
      label : 'Published Post',
      value : stats.published,
      icon : CheckCircleIcon,
      trend : 'All time'
    },
     {
      label : 'Connencted Accounts',
      value : stats.connectedAccounts,
      icon : Share2Icon,
      trend : 'Active'
    }
  ]
  return (
    <div className = "space-y-8">
      {/* welcom bar */ }
      <div>
        <h2 className="text-2xl text-slate-900">Good morning!</h2>
        <p className="text-sm text-slate-500 mt-0.5">Here's what's happeing with your social accounts today.</p>
      </div>
      {/* stats cards */ }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {
          statCards.map((card)=> (
            <div key={card.label} className="bg-white hover:bg-red-50 relative border border-slate-200 rounded-2xl p-5 hover:border-red-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl text-slate-800 font-medium tabular-nums">{card.value}</div>
                <div className="text-xs absolute right-4 top-4 text-red-500 flex items-center gap-1">
                  <TrendingUpIcon className="size-3"/>
                  {card.trend}
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-1">{card.label}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Dashboard