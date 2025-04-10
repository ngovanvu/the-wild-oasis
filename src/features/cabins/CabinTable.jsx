import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabinTable } from "./useCabinTable";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";

// const Table = styled.div`
//   border: 1px solid var(--color-grey-200);
//   font-size: 1.4rem;
//   background-color: var(--color-grey-0);
//   border-radius: 7px;
//   overflow: hidden;
// `;

// const TableHeader = styled.header`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;

//   background-color: var(--color-grey-50);
//   border-bottom: 1px solid var(--color-grey-100);
//   text-transform: uppercase;
//   letter-spacing: 0.4px;
//   font-weight: 600;
//   color: var(--color-grey-600);
//   padding: 1.6rem 2.4rem;
// `;

function CabinTable() {
  const { isLoading, error, cabins } = useCabinTable();

  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (!cabins.length) return <Empty resourceName="cabins" />;

  //1. Filter
  const filterValue = searchParams.get("discount") || "all";

  let filterCabins;
  if (filterValue === "all") {
    filterCabins = cabins;
  }
  if (filterValue === "no-discount") {
    filterCabins = cabins.filter((cabin) => cabin.discount === 0);
  }
  if (filterValue === "with-discount") {
    filterCabins = cabins.filter((cabin) => cabin.discount > 0);
  }
  //2. sort
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  // Một giá trị âm (negative value), a sẽ đứng trước b. => từ bé đến lớn
  // Một giá trị dương (positive value), b sẽ đứng trước a => từ lớn đến bé
  const sortedCabins = filterCabins.sort((a, b) => {
    if (typeof a[field] === "number" && typeof b[field] === "number") {
      return (a[field] - b[field]) * modifier;
    } else if (typeof a[field] === "string" && typeof b[field] === "string") {
      return a[field].localeCompare(b[field]) * modifier;
    }
    return 0;
  });

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          //  data={cabins}
          // data={filterCabins}
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
        {/* {cabins.map((cabin) => (
        <CabinRow cabin={cabin} key={cabin.id} />
      ))} */}
      </Table>
    </Menus>
  );
}

export default CabinTable;
