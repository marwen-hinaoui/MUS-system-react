import { Button } from "antd";
import { TbRefresh } from "react-icons/tb";
import CardComponent from "../card/CardComponent";
import SearchComponent from "../searchComponent/searchComponent";
import { ICONSIZE } from "../../constant/FontSizes";

const RebuildHeader = ({ onRefresh, data }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "start",
        alignItems: "center",
        paddingBottom: "16px",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      <Button
        color="danger"
        variant="outlined"
        onClick={onRefresh}
        type="outlined"
        icon={<TbRefresh size={ICONSIZE.SMALL} />}
      >
        Actualiser
      </Button>

      <CardComponent>
        <SearchComponent
          searchFor="_pn"
          data={data}
          placeholder="Part Number"
        />
      </CardComponent>
    </div>
  );
};

export default RebuildHeader;
