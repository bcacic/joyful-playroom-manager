
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Plus, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { Birthday } from '@/types';

// Mock data for initial rendering
const mockBirthdays: Birthday[] = [
  {
    id: '1',
    birthdayBoyId: '1',
    date: '2023-12-15',
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
    date: '2023-11-10',
    startTime: '14:00',
    endTime: '17:00',
    packageType: 'standard',
    guestCount: 10,
    status: 'completed',
    price: 200,
    deposit: 50,
    depositPaid: true,
    createdAt: '2023-10-20T10:00:00Z',
    updatedAt: '2023-10-20T10:00:00Z',
  },
  {
    id: '3',
    birthdayBoyId: '3',
    date: '2023-11-20',
    startTime: '12:00',
    endTime: '15:00',
    packageType: 'basic',
    guestCount: 8,
    status: 'cancelled',
    price: 150,
    deposit: 50,
    depositPaid: false,
    notes: 'Cancelled due to illness',
    createdAt: '2023-10-25T10:00:00Z',
    updatedAt: '2023-11-05T10:00:00Z',
  },
];

const PackageBadge = ({ type }: { type: Birthday['packageType'] }) => {
  const config = {
    basic: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
    },
    standard: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
    },
    premium: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
    },
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[type].bg} ${config[type].text}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const BirthdayList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [birthdays, setBirthdays] = useState<Birthday[]>(mockBirthdays);

  // In a real app, you would fetch this data from an API
  // and implement proper search functionality

  const filteredBirthdays = birthdays.filter(birthday => 
    birthday.date.includes(searchTerm) || 
    birthday.status.includes(searchTerm) ||
    birthday.packageType.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search birthdays..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link to="/birthdays/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Birthday
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBirthdays.length === 0 ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No birthdays found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add a new birthday to get started.
              </p>
              <Button asChild className="mt-4">
                <Link to="/birthdays/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Birthday
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          filteredBirthdays.map((birthday) => (
            <Link key={birthday.id} to={`/birthdays/${birthday.id}`}>
              <Card hoverable className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={birthday.status} />
                      <PackageBadge type={birthday.packageType} />
                    </div>
                    <h3 className="text-lg font-medium">Birthday #{birthday.id}</h3>
                  </div>
                  <div className="text-lg font-medium">${birthday.price}</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(new Date(birthday.date), 'PPP')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {birthday.startTime} - {birthday.endTime}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {birthday.guestCount} guests
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Deposit: ${birthday.deposit}</p>
                    <p className="text-xs text-muted-foreground">
                      {birthday.depositPaid ? 'Deposit paid' : 'Deposit not paid'}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BirthdayList;
