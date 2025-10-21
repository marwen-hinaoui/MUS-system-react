import "./searchComponent.css";
import { MdSearch } from "react-icons/md";
import { ICONSIZE } from "../../constant/FontSizes";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { set_data_searching, set_loading } from "../../redux/slices";
import { Input } from "antd";
import Search from "antd/es/transfer/search";
const SearchComponent = ({ placeholder, data, searchFor, table }) => {
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ padding: "5px" }}>
            <MdSearch size={ICONSIZE.PRIMARY} />
          </div>
          {!table ? (
            <Input
              placeholder={placeholder}
              className="searchInput"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          ) : (
            <input
              placeholder={placeholder}
              className="searchInput"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
