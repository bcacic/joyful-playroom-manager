
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Plus, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { Birthday, Rodjendan } from '@/types';
import { birthdayApi } from '@/api/birthdayApi';
import { mapToBirthday } from '@/utils/mappers';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

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
  
  // Fetch birthdays from API
  const { data: birthdays = [], isLoading, error } = useQuery({
    queryKey: ['birthdays'],
    queryFn: async () => {
      try {
        const rodjendani = await birthdayApi.getAll();
        return rodjendani.map(mapToBirthday);
      } catch (error) {
        console.error('Error fetching birthdays:', error);
        toast.error('Failed to load birthdays. Please try again.');
        throw error;
      }
    }
  });

  // Filter birthdays based on search term
  const filteredBirthdays = birthdays.filter(birthday => 
    birthday.date.includes(searchTerm) || 
    birthday.status.includes(searchTerm) ||
    birthday.packageType.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="w-72 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-40 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="text-red-500 mb-4">Error loading birthdays</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

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
