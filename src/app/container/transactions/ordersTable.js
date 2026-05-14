import { Text } from "../../components/typography";
import { Pagination, Table } from "../../components/table";
import { utils, dateTime } from "../../utils";
import { SkeltonBox } from "../../components/skelton";

const columns = [
  {
    header: 'DATE',
    accessor: 'date',
    render: (row) => dateTime.getDisplayDate(row.date)
  },
  {
    header: 'STORE',
    accessor: 'storeName',
  },
  {
    header: 'AMOUNT',
    render: (row) => (
      <Text>
        {row.totalPrice ? utils.formatNumber(row.totalPrice) : 0}{row.currency ? ` ${row.currency}` : ""}
      </Text>
    )
  },
  {
    header: 'ADDRESS',
    render: (row) => (
      <div className="w-100">
        <Text size="paragraph-sm">
          {row?.storeInfo?.address ? row.storeInfo.address : "--"}
        </Text>
      </div>
    )
  },
  {
    header: 'POINTS EARNED',
    render: (row) => (
      <Text>
        {row.pointsEarned ? utils.formatNumber(row.pointsEarned) : 0}
      </Text>
    )
  },
  {
    header: 'POINTS USED',
    render: (row) => (
      <Text>
        {row.pointsRedeemed ? utils.formatNumber(row.pointsRedeemed) : 0}
      </Text>
    )
  }
];

const OrdersTable = ({ loader, data, updatePage, page }) => {
  return (
    <>
      {
        loader ?
          <SkeltonBox className="w-100 qb-br-16" style={{ height: "800px" }} />
          : data?.data?.length > 0 ?
            <div className="w-100 qb-bg-card-grad qb-border-solid-grey qb-br-16 qb-shadow-sm overflow-hidden">
              <Table columns={columns} data={data?.data || []} />
              <div className="qb-pagination-wrapper py-3 px-4">
                <Pagination
                  page={page}
                  total={(data?.count || 10)}
                  pageSize={10}
                  onPageChange={updatePage}
                />
              </div>
            </div>
            :
            <div className="py-6 h-100 d-flex flex-column w-100 align-items-center justify-content-center">
              <img className="qb-empty-illustration" src="/assets/empty-illustrations/bag.webp" alt="No Orders Found" />
              <Text weight="bold" color="muted" className="pt-4 pb-2">No Orders Found</Text>
              <Text size="paragraph-sm" color="muted">Looks like you haven't placed any orders yet.</Text>
            </div>
      }
    </>
  )
}

export default OrdersTable;
