
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, User, Phone, Trash2, Pencil, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import PageTitle from '@/components/ui/PageTitle';
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
import { toast } from '@/components/ui/sonner';
import { BirthdayBoy, Birthday } from '@/types';
import BirthdayBoyForm from '@/components/birthday-boys/BirthdayBoyForm';

// Mock data for initial rendering
const mockBirthdayBoy: BirthdayBoy = {
  id: '1',
  name: 'Alex Johnson',
  age: 7,
  parentName: 'Sarah Johnson',
  parentPhone: '555-123-4567',
  notes: 'Likes superheroes and chocolate cake.',
  createdAt: '2023-10-15T10:00:00Z',
  updatedAt: '2023-10-15T10:00:00Z',
};

// Mock birthdays associated with this birthday boy
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
    createdAt: '2023-11-15T10:00:00Z',
    updatedAt: '2023-11-15T10:00:00Z',
  },
  {
    id: '3',
    birthdayBoyId: '1',
    date: '2022-12-20',
    startTime: '14:00',
    endTime: '17:00',
    packageType: 'standard',
    guestCount: 12,
    status: 'completed',
    price: 200,
    deposit: 50,
    depositPaid: true,
    createdAt: '2022-11-20T10:00:00Z',
    updatedAt: '2022-12-21T10:00:00Z',
  },
];

const BirthdayBoyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [birthdayBoy, setBirthdayBoy] = useState<BirthdayBoy | null>(null);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
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
      setBirthdayBoy(mockBirthdayBoy);
      setBirthdays(mockBirthdays);
      
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      // In a real app, you would send a delete request to your API
      console.log('Deleting birthday boy:', id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Birthday boy deleted successfully!');
      navigate('/birthday-boys');
    } catch (error) {
      console.error('Error deleting birthday boy:', error);
      toast.error('An error occurred while deleting the birthday boy.');
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
            onClick={() => id === 'new' ? navigate('/birthday-boys') : setIsEditing(false)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {id === 'new' ? 'Back to Birthday Boys' : 'Back to Details'}
          </Button>
          <PageTitle 
            title={id === 'new' ? 'New Birthday Boy' : 'Edit Birthday Boy'} 
            subtitle={id === 'new' ? 'Add a new birthday boy profile' : 'Update birthday boy details'} 
          />
        </div>
        <BirthdayBoyForm 
          birthdayBoy={birthdayBoy || undefined} 
          isEdit={id !== 'new'} 
        />
      </Layout>
    );
  }

  if (!birthdayBoy) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Birthday Boy not found</h2>
          <p className="text-muted-foreground mb-6">
            The birthday boy profile you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/birthday-boys">Back to Birthday Boys</Link>
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
            onClick={() => navigate('/birthday-boys')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Birthday Boys
          </Button>
          <PageTitle title={birthdayBoy.name} subtitle={`${birthdayBoy.age} years old`} />
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
                  This will permanently delete this birthday boy profile. This action cannot be undone.
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
        <Card className="lg:col-span-1">
          <div className="flex items-center mb-6">
            <div className="bg-primary/10 rounded-full p-4 mr-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{birthdayBoy.name}</h3>
              <p className="text-muted-foreground">{birthdayBoy.age} years old</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Parent/Guardian</p>
                <p className="font-medium">{birthdayBoy.parentName}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Contact Number</p>
                <p className="font-medium">{birthdayBoy.parentPhone}</p>
              </div>
            </div>
          </div>

          {birthdayBoy.notes && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-muted-foreground">{birthdayBoy.notes}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-1">Created on</p>
            <p>{format(new Date(birthdayBoy.createdAt), 'PPP')}</p>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Birthday History</h3>
              <Button asChild variant="outline" size="sm">
                <Link to="/birthdays/new">
                  Schedule New Birthday
                </Link>
              </Button>
            </div>

            {birthdays.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No birthdays scheduled yet</p>
                <Button asChild variant="link" size="sm" className="mt-2">
                  <Link to="/birthdays/new">Schedule a birthday</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {birthdays.map((birthday) => (
                  <Link 
                    key={birthday.id}
                    to={`/birthdays/${birthday.id}`}
                    className="block"
                  >
                    <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${
                            birthday.status === 'upcoming' ? 'bg-blue-500' : 
                            birthday.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <p className="text-sm font-medium">
                            {format(new Date(birthday.date), 'MMMM d, yyyy')}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {birthday.startTime} - {birthday.endTime} • {birthday.guestCount} guests •{' '}
                          {birthday.packageType.charAt(0).toUpperCase() + birthday.packageType.slice(1)} package
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${birthday.price}</p>
                        <p className="text-xs text-muted-foreground">
                          {birthday.status.charAt(0).toUpperCase() + birthday.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BirthdayBoyDetail;
