import { useEffect, useState } from 'react';
import { AttachMoneyOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { Grid, Typography } from "@mui/material";
import { SummaryTile } from "../../components/admin";
import { AdminLayout } from "../../components/layouts";
import useSWR from 'swr';
import { IDashboard } from '../../interfaces';


const AdminDashboardPage = () => {

  const { data, error } = useSWR<IDashboard>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000 // 30 seconds
  });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {

    const interval = setInterval(() => {
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 );
    }, 1000);
  
    return () => clearInterval(interval);

  }, []);
  

  if (!data && !error) { return <></> };

  if (error) {
    console.log(error);
    return <Typography>Could not load information</Typography>
  };

  return (
    <AdminLayout title='Dashboard' subTitle='Stats' icon={<DashboardOutlined />} >
      <Grid container spacing={2} >

        <SummaryTile
          title={data!.numberOfOrders}
          subTitle='Total Orders'
          icon={<CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data!.paidOrders}
          subTitle='Paid Orders'
          icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data!.notPaidOrders}
          subTitle='Pending Orders '
          icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}

        />
        <SummaryTile
          title={data!.numberOfClients}
          subTitle='Customers'
          icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data!.numberOfProducts}
          subTitle='Products'
          icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data!.productsWithNoInventory}
          subTitle='Out Of Stock'
          icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data!.lowInventory}
          subTitle='Low Inventory'
          icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={refreshIn}
          subTitle='Last Updated'
          icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
        
      </Grid>
    </AdminLayout>
  )
}

export default AdminDashboardPage;