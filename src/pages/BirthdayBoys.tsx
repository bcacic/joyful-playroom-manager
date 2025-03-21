
import React from 'react';
import Layout from '@/components/layout/Layout';
import BirthdayBoyList from '@/components/birthday-boys/BirthdayBoyList';
import PageTitle from '@/components/ui/PageTitle';

const BirthdayBoys = () => {
  return (
    <Layout>
      <PageTitle 
        title="Birthday Boys" 
        subtitle="Manage all your birthday boy profiles" 
      />
      <BirthdayBoyList />
    </Layout>
  );
};

export default BirthdayBoys;
