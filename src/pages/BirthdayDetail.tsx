
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarDays, Clock, Users, CreditCard, Trash2, Pencil, ArrowLeft, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import PageTitle from '@/components/ui/PageTitle';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Birthday, BirthdayBoy } from '@/types';
import BirthdayForm from '@/components/birthdays/BirthdayForm';

// Mock data for initial rendering
const mockBirthday: Birthday = {
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
};

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
};

const BirthdayDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [birthday, setBirthday] = useState<Birthday | null>(null);
  const [birthdayBoy, setBirthdayBoy] = useState<BirthdayBoy | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (id === 'new') {
        setIsEditing(true);
        setIsLoading(false);
        return;
      }
      
      // For demo purposes, we're using mock data
      const foundBirthday = mockBirthday;
      setBirthday(foundBirthday);
      
      if (foundBirthday) {
        setBirthdayBoy(mockBirthdayBoys[foundBirthday.birthdayBoyId]);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      // In a real app, you would send a delete request to your API
      console.log('Deleting birthday:', id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Birthday deleted successfully!');
      navigate('/birthdays');
    } catch (error) {
      console.error('Error deleting birthday:', error);
      toast.error('An error occurred while deleting the birthday.');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Layout>
    );
  }

  if (id === 'new' || isEditing) {
    return (
      <Layout>
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => id === 'new' ? navigate('/birthdays') : setIsEditing(false)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {id === 'new' ? 'Back to Birthdays' : 'Back to Details'}
          </Button>
          <PageTitle 
            title={id === 'new' ? 'New Birthday' : 'Edit Birthday'} 
            subtitle={id === 'new' ? 'Schedule a new birthday party' : 'Update birthday party details'} 
          />
        </div>
        <BirthdayForm 
          birthday={birthday || undefined} 
          isEdit={id !== 'new'} 
        />
      </Layout>
    );
  }

  if (!birthday) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Birthday not found</h2>
          <p className="text-muted-foreground mb-6">
            The birthday you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/birthdays">Back to Birthdays</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/birthdays')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Birthdays
          </Button>
          <PageTitle title={`Birthday #${birthday.id}`} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this birthday party. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={birthday.status} />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {birthday.packageType.charAt(0).toUpperCase() + birthday.packageType.slice(1)} Package
                  </span>
                </div>
                <h3 className="text-xl font-semibold">
                  {birthdayBoy?.name}'s Birthday Party
                </h3>
              </div>
              <div className="text-2xl font-semibold">${birthday.price}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(new Date(birthday.date), 'PPPP')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{birthday.startTime} - {birthday.endTime}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guest Count</p>
                    <p className="font-medium">{birthday.guestCount} guests</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Deposit</p>
                    <p className="font-medium">
                      ${birthday.deposit} 
                      <span className="text-sm ml-1 text-muted-foreground">
                        ({birthday.depositPaid ? 'Paid' : 'Not Paid'})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {birthday.notes && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-muted-foreground">{birthday.notes}</p>
              </div>
            )}
          </Card>
        </div>

        {birthdayBoy && (
          <div>
            <Card>
              <h3 className="text-lg font-medium mb-4">Birthday Boy</h3>
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 rounded-full p-3 mr-3">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{birthdayBoy.name}</h4>
                  <p className="text-sm text-muted-foreground">{birthdayBoy.age} years old</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Parent/Guardian</p>
                  <p>{birthdayBoy.parentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Number</p>
                  <p>{birthdayBoy.parentPhone}</p>
                </div>
                {birthdayBoy.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p>{birthdayBoy.notes}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/birthday-boys/${birthdayBoy.id}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BirthdayDetail;
