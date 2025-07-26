import { Drawer, Spin } from 'antd';

const DrawerComponent = ({ open, row, handleCloseDrawer }) => {


  return row && (
    <Drawer
      title="Détails demande"
      placement="right"
      closable={true}
      onClose={handleCloseDrawer}
      open={open}
    >
      <p>{row.id}</p>
    </Drawer>
  );
};

export default DrawerComponent;