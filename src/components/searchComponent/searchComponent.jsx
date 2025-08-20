import "./searchComponent.css";
import { MdSearch } from "react-icons/md";
import { ICONSIZE } from "../../constant/FontSizes";
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
        Object.values(item.numDemande).some((val) =>
          String(item.numDemande).toLowerCase().includes(term)
        )
      );
      dispatch(set_data_searching(filtered));
    }
  }, [searchTerm, demandeData, dispatch]);

  return (
    <div>
      <div style={{ padding: "6px" }}>
        <label class="searchLabelWrap">
          <span class="visually-hidden">Search</span>
          <MdSearch size={ICONSIZE.PRIMARY} />
          <input
            type="search"
            placeholder="Numéro demande"
            className="searchInput"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </label>
      </div>
    </div>
  );
};

export default SearchComponent;
