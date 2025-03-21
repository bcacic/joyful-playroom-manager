import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, User, DollarSign, CalendarDays, ChevronRight, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  // Mock data for dashboard statistics
  const dashboardData = {
    totalRevenue: 12500,
    newCustomers: 42,
    upcomingBirthdays: 7,
    completedBirthdays: 28,
    recentActivities: [
      { id: 1, type: 'new_booking', date: '2024-03-15T10:00:00Z', description: 'New birthday party scheduled for Alex Johnson' },
      { id: 2, type: 'payment', date: '2024-03-14T14:30:00Z', description: 'Deposit received from Sarah Johnson' },
      { id: 3, type: 'cancellation', date: '2024-03-13T09:15:00Z', description: 'Birthday party cancelled for Emily Smith' },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upcoming Birthdays</p>
            </div>
            <div className="text-2xl font-semibold">{dashboardData.upcomingBirthdays}</div>
          </div>
          <Link to="/birthdays" className="text-primary hover:underline text-sm mt-2 inline-block">
            View Birthdays <ChevronRight className="h-4 w-4 ml-1 inline-block align-middle" />
          </Link>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">New Customers</p>
            </div>
            <div className="text-2xl font-semibold">{dashboardData.newCustomers}</div>
          </div>
          <Link to="/birthday-boys" className="text-primary hover:underline text-sm mt-2 inline-block">
            View Birthday Boys <ChevronRight className="h-4 w-4 ml-1 inline-block align-middle" />
          </Link>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-2">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
            <div className="text-2xl font-semibold">${dashboardData.totalRevenue}</div>
          </div>
          <Link to="/birthdays" className="text-primary hover:underline text-sm mt-2 inline-block">
            View Bookings <ChevronRight className="h-4 w-4 ml-1 inline-block align-middle" />
          </Link>
        </Card>

         <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-2">
              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Completed Birthdays</p>
            </div>
            <div className="text-2xl font-semibold">{dashboardData.completedBirthdays}</div>
          </div>
          <Link to="/birthdays" className="text-primary hover:underline text-sm mt-2 inline-block">
            View Birthdays <ChevronRight className="h-4 w-4 ml-1 inline-block align-middle" />
          </Link>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Recent Activities</h3>
          <Button asChild variant="outline" size="sm">
            <Link to="/birthdays/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Schedule Birthday
            </Link>
          </Button>
        </div>
        <div className="divide-y divide-border">
          {dashboardData.recentActivities.map((activity) => (
            <div key={activity.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(activity.date), 'PPP p')}
                  </p>
                </div>
                {activity.type === 'new_booking' && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    New
                  </span>
                )}
                {activity.type === 'payment' && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    Payment
                  </span>
                )}
                {activity.type === 'cancellation' && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Cancelled
                  </span>
                )}
              </div>
            </div>
          ))}
          {dashboardData.recentActivities.length === 0 && (
            <div className="py-4 text-center text-muted-foreground">
              No recent activities
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
