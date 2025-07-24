import { Drawer } from 'antd';

const DrawerComponent = ({ open, idRow, handleCloseDrawer }) => {
  return (
    <Drawer
      title="Détails demande"
      placement="right"
      closable={true}
      onClose={handleCloseDrawer}
      open={open}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
};

export default DrawerComponent;