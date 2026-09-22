import React from 'react';
import { format } from 'date-fns';

export type ActivityAction = "Created" | "Updated" | "StatusChanged";

interface ChangeDetail {
  from: any;
  to: any;
}

interface Activity {
  _id: string;
  action: ActivityAction;
  details: string;
  changes?: Record<string, ChangeDetail>;
  createdAt: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="flow-root w-full overflow-hidden">
      <ul role="list" className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity._id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div className="flex-shrink-0">
                  <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-slate-500">
                    <span className="text-white text-xs font-bold">
                      {activity.action === 'Created' ? 'C' : activity.action === 'Updated' ? 'U' : 'S'}
                    </span>
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 break-words">{activity.details}</p>
                    {activity.changes && (
                      <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        {Object.entries(activity.changes).map(([field, change]) => (
                          <div key={field} className="break-words">
                            <span className="font-semibold capitalize">{field}:</span> 
                            <span className="text-slate-400 mx-1">from</span>
                            <span className="text-slate-900">{change.from}</span>
                            <span className="text-slate-400 mx-1">to</span>
                            <span className="text-slate-900">{change.to}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-sm text-slate-500 sm:text-right">
                    <time dateTime={activity.createdAt}>
                      {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
