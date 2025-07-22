import { Input } from "antd";
import "./searchComponent.css";
import { MdSearch } from "react-icons/md";
import { ICONSIZE } from "../../constant/FontSizes";
import CardComponent from "../card/cardComponent";
const SearchComponent = () => {
  return (
    <div>
      <CardComponent padding={'8px'}>
        <form action="#" method="GET" id="searchForm">
          <label class="searchLabelWrap">
            <span class="visually-hidden">Search</span>
            <MdSearch className="icon" size={ICONSIZE.PRIMARY} />
            <input
              type="search"
              placeholder="Recherche"
              className="searchInput"
              name="s"
            />
          </label>
        </form>
      </CardComponent>
    </div>
  );
};

export default SearchComponent;
