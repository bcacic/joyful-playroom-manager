
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, User, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { BirthdayBoy, Slavljenik } from '@/types';
import { birthdayBoyApi } from '@/api/birthdayBoyApi';
import { mapToBirthdayBoy } from '@/utils/mappers';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const BirthdayBoyList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch birthday boys from API
  const { data: birthdayBoys = [], isLoading, error } = useQuery({
    queryKey: ['birthdayBoys'],
    queryFn: async () => {
      try {
        const slavljenici = await birthdayBoyApi.getAll();
        return slavljenici.map(mapToBirthdayBoy);
      } catch (error) {
        console.error('Error fetching birthday boys:', error);
        toast.error('Failed to load birthday boys. Please try again.');
        throw error;
      }
    }
  });

  // Filter birthday boys based on search term
  const filteredBirthdayBoys = birthdayBoys.filter(boy =>
    boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boy.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boy.parentPhone.includes(searchTerm)
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
        <div className="text-red-500 mb-4">Error loading birthday boys</div>
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
            placeholder="Search birthday boys..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link to="/birthday-boys/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Birthday Boy
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBirthdayBoys.length === 0 ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No birthday boys found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add a new birthday boy to get started.
              </p>
              <Button asChild className="mt-4">
                <Link to="/birthday-boys/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Birthday Boy
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          filteredBirthdayBoys.map((boy) => (
            <Link key={boy.id} to={`/birthday-boys/${boy.id}`}>
              <Card hoverable className="h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-3 mr-3">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{boy.name}</h3>
                      <p className="text-sm text-muted-foreground">{boy.age} years old</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Parent: </span>
                    <span className="ml-1">{boy.parentName}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone: </span>
                    <span className="ml-1">{boy.parentPhone}</span>
                  </div>
                </div>
                {boy.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Notes: </span>
                      {boy.notes}
                    </p>
                  </div>
                )}
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BirthdayBoyList;
