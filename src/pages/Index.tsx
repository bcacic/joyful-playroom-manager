
import React from 'react';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/components/dashboard/Dashboard';
import PageTitle from '@/components/ui/PageTitle';

const Index = () => {
  return (
    <Layout>
      <PageTitle 
        title="Dashboard" 
        subtitle="Welcome to your Playroom Rental management dashboard" 
      />
      <Dashboard />
    </Layout>
  );
};

export default Index;
