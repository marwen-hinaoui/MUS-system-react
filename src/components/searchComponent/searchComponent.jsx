import "./searchComponent.css";
import { MdSearch } from "react-icons/md";
import { ICONSIZE } from "../../constant/FontSizes";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { set_data_searching, set_loading } from "../../redux/slices";
const SearchComponent = ({ placeholder, data, searchFor }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    if (data && searchFor) {
      dispatch(set_loading(true));

      const term = searchTerm.toLowerCase();

      const filtered = data.filter((item) => {
        const value = item?.[searchFor];

        return value && String(value).toLowerCase().includes(term);
      });
      console.log(filtered);

      dispatch(set_data_searching(filtered));
      dispatch(set_loading(false));
    }
  }, [searchTerm, data, searchFor, dispatch]);

  return (
    <div>
      <div>
        <label class="searchLabelWrap">
          <MdSearch size={ICONSIZE.PRIMARY} />
          <input
            placeholder={placeholder}
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
