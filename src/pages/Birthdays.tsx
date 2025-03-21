
import React from 'react';
import Layout from '@/components/layout/Layout';
import BirthdayList from '@/components/birthdays/BirthdayList';
import PageTitle from '@/components/ui/PageTitle';

const Birthdays = () => {
  return (
    <Layout>
      <PageTitle 
        title="Birthdays" 
        subtitle="Manage all your scheduled birthday parties" 
      />
      <BirthdayList />
    </Layout>
  );
};

export default Birthdays;
