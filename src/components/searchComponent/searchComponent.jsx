import { Input } from "antd";
import "./searchComponent.css";
import { MdSearch } from "react-icons/md";
import { ICONSIZE } from "../../constant/FontSizes";
import CardComponent from "../card/cardComponent";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_data_searching } from "../../redux/slices";
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const demandeData = useSelector((state) => state.app.demandeData);

  useEffect(() => {
    if (demandeData) {
      const term = searchTerm.toLowerCase();
      const filtered = demandeData.filter((item) =>
        Object.values(item.numDemandeMUS).some((val) =>
          String(item.numDemandeMUS).toLowerCase().includes(term)
        )
      );
      dispatch(set_data_searching(filtered));
    }
  }, [searchTerm, demandeData, dispatch]);

  return (
    <div>
      <CardComponent padding={"6px"}>
        <label class="searchLabelWrap">
          <span class="visually-hidden">Search</span>
          <MdSearch  size={ICONSIZE.PRIMARY} />
          <input
            type="search"
            placeholder="Numéro demande"
            className="searchInput"
            name="s"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </label>
      </CardComponent>
    </div>
  );
};

export default SearchComponent;
