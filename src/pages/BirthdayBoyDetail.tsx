
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, User, Phone, Trash2, Pencil, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
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
import { toast } from 'sonner';
import { BirthdayBoy, Birthday } from '@/types';
import BirthdayBoyForm from '@/components/birthday-boys/BirthdayBoyForm';
import { birthdayBoyApi } from '@/api/birthdayBoyApi';
import { birthdayApi } from '@/api/birthdayApi';
import { mapToBirthday, mapToBirthdayBoy } from '@/utils/mappers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BirthdayBoyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch birthday boy details
  const { 
    data: birthdayBoy, 
    isLoading: isLoadingBirthdayBoy, 
    error: birthdayBoyError 
  } = useQuery({
    queryKey: ['birthdayBoy', id],
    queryFn: async () => {
      if (id === 'new') return null;
      
      try {
        const slavljenik = await birthdayBoyApi.getById(parseInt(id!));
        return mapToBirthdayBoy(slavljenik);
      } catch (error) {
        console.error('Error fetching birthday boy:', error);
        toast.error('Failed to load birthday boy details');
        throw error;
      }
    },
    enabled: id !== 'new' && !!id
  });

  // Fetch birthdays for this birthday boy
  const { 
    data: birthdays = [], 
    isLoading: isLoadingBirthdays 
  } = useQuery({
    queryKey: ['birthdaysBirthdayBoy', id],
    queryFn: async () => {
      if (id === 'new' || !id) return [];
      
      try {
        const allRodjendani = await birthdayApi.getAll();
        // Filter by slavljenikSifra matching current id
        const filteredRodjendani = allRodjendani.filter(
          r => r.slavljenikSifra === parseInt(id)
        );
        return filteredRodjendani.map(mapToBirthday);
      } catch (error) {
        console.error('Error fetching birthdays:', error);
        return [];
      }
    },
    enabled: id !== 'new' && !!id
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await birthdayBoyApi.delete(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthdayBoys'] });
      toast.success('Birthday boy deleted successfully!');
      navigate('/birthday-boys');
    },
    onError: (error: any) => {
      console.error('Error deleting birthday boy:', error);
      toast.error('Failed to delete birthday boy. Please try again.');
    }
  });

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  const isLoading = isLoadingBirthdayBoy || isLoadingBirthdays;

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

  if (birthdayBoyError || !birthdayBoy) {
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
