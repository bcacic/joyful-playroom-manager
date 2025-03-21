
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, CalendarDays, User, ArrowRight } from 'lucide-react';
import { format, addDays } from 'date-fns';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Birthday, BirthdayBoy, DashboardStats } from '@/types';

// Mock data for initial rendering
const mockBirthdays: Birthday[] = [
  {
    id: '1',
    birthdayBoyId: '1',
    date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    startTime: '13:00',
    endTime: '16:00',
    packageType: 'premium',
    guestCount: 15,
    status: 'upcoming',
    price: 300,
    deposit: 100,
    depositPaid: true,
    notes: 'Bring cake and decorations',
    createdAt: '2023-11-15T10:00:00Z',
    updatedAt: '2023-11-15T10:00:00Z',
  },
  {
    id: '2',
    birthdayBoyId: '2',
    date: format(addDays(new Date(), 12), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '17:00',
    packageType: 'standard',
    guestCount: 10,
    status: 'upcoming',
    price: 200,
    deposit: 50,
    depositPaid: true,
    createdAt: '2023-10-20T10:00:00Z',
    updatedAt: '2023-10-20T10:00:00Z',
  },
  {
    id: '3',
    birthdayBoyId: '3',
    date: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
    startTime: '12:00',
    endTime: '15:00',
    packageType: 'basic',
    guestCount: 8,
    status: 'completed',
    price: 150,
    deposit: 50,
    depositPaid: true,
    createdAt: '2023-10-25T10:00:00Z',
    updatedAt: '2023-11-05T10:00:00Z',
  },
];

const mockBirthdayBoys: Record<string, BirthdayBoy> = {
  '1': {
    id: '1',
    name: 'Alex Johnson',
    age: 7,
    parentName: 'Sarah Johnson',
    parentPhone: '555-123-4567',
    createdAt: '2023-10-15T10:00:00Z',
    updatedAt: '2023-10-15T10:00:00Z',
  },
  '2': {
    id: '2',
    name: 'Emily Smith',
    age: 6,
    parentName: 'John Smith',
    parentPhone: '555-987-6543',
    createdAt: '2023-10-18T10:00:00Z',
    updatedAt: '2023-10-18T10:00:00Z',
  },
  '3': {
    id: '3',
    name: 'Michael Brown',
    age: 8,
    parentName: 'Jessica Brown',
    parentPhone: '555-456-7890',
    notes: 'Allergic to nuts',
    createdAt: '2023-10-20T10:00:00Z',
    updatedAt: '2023-10-20T10:00:00Z',
  },
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBirthdays: 0,
    upcomingBirthdays: 0,
    completedBirthdays: 0,
    cancelledBirthdays: 0,
    totalBirthdayBoys: 0,
    totalRevenue: 0,
  });
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const fetchData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Calculate stats from mockBirthdays
      const totalBirthdays = mockBirthdays.length;
      const upcomingBirthdays = mockBirthdays.filter(b => b.status === 'upcoming').length;
      const completedBirthdays = mockBirthdays.filter(b => b.status === 'completed').length;
      const cancelledBirthdays = mockBirthdays.filter(b => b.status === 'cancelled').length;
      const totalBirthdayBoys = Object.keys(mockBirthdayBoys).length;
      const totalRevenue = mockBirthdays.reduce((acc, b) => acc + b.price, 0);
      
      setStats({
        totalBirthdays,
        upcomingBirthdays,
        completedBirthdays,
        cancelledBirthdays,
        totalBirthdayBoys,
        totalRevenue,
      });
      
      // Sort upcoming birthdays by date (most recent first)
      const upcomingBirthdaysList = mockBirthdays
        .filter(b => b.status === 'upcoming')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setBirthdays(upcomingBirthdaysList);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Skeleton loader for stats
  const StatsSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="animate-pulse">
          <div className="flex items-center">
            <div className="rounded-full bg-gray-200 h-10 w-10 mr-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  // Skeleton loader for upcoming birthdays
  const UpcomingBirthdaysSkeleton = () => (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Upcoming Birthdays</h3>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b last:border-0 animate-pulse">
            <div className="flex items-center">
              <div className="rounded-full bg-gray-200 h-8 w-8 mr-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-3">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Birthdays</p>
                <h3 className="text-2xl font-bold">{stats.totalBirthdays}</h3>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-3">
                <CalendarDays className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <h3 className="text-2xl font-bold">{stats.upcomingBirthdays}</h3>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3 mr-3">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Birthday Boys</p>
                <h3 className="text-2xl font-bold">{stats.totalBirthdayBoys}</h3>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="bg-amber-100 rounded-full p-3 mr-3">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">${stats.totalRevenue}</h3>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          <UpcomingBirthdaysSkeleton />
        ) : (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Upcoming Birthdays</h3>
              <Button asChild variant="link" size="sm" className="text-sm">
                <Link to="/birthdays">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {birthdays.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No upcoming birthdays</p>
                <Button asChild variant="link" size="sm" className="mt-2">
                  <Link to="/birthdays/new">Schedule a birthday</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-0">
                {birthdays.map((birthday) => (
                  <Link 
                    key={birthday.id}
                    to={`/birthdays/${birthday.id}`}
                    className="flex justify-between items-center py-3 border-b last:border-0 hover:bg-accent rounded-md px-2 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-primary/10 rounded-full p-2 mr-3">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {mockBirthdayBoys[birthday.birthdayBoyId]?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(birthday.date), 'MMM d, yyyy')} • {birthday.startTime} - {birthday.endTime}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={birthday.status} />
                  </Link>
                ))}
                
                <div className="pt-3 flex justify-center">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/birthdays/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule New Birthday
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        <Card className="md:row-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <Link to="/birthdays/new">
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <div className="bg-primary/10 rounded-full p-2 mr-3">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Schedule a Birthday</p>
                  <p className="text-sm text-muted-foreground">Create a new birthday event</p>
                </div>
              </Button>
            </Link>
            
            <Link to="/birthday-boys/new">
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <div className="bg-primary/10 rounded-full p-2 mr-3">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Add Birthday Boy</p>
                  <p className="text-sm text-muted-foreground">Register a new birthday boy</p>
                </div>
              </Button>
            </Link>
            
            <Link to="/birthdays">
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <div className="bg-primary/10 rounded-full p-2 mr-3">
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">View All Birthdays</p>
                  <p className="text-sm text-muted-foreground">See all scheduled birthdays</p>
                </div>
              </Button>
            </Link>
            
            <Link to="/birthday-boys">
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <div className="bg-primary/10 rounded-full p-2 mr-3">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">View All Birthday Boys</p>
                  <p className="text-sm text-muted-foreground">See all registered birthday boys</p>
                </div>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
