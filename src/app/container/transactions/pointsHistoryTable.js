import { Text } from "../../components/typography";
import { Pagination, Table } from "../../components/table";
import { utils, dateTime } from "../../utils";
import { SkeltonBox } from "../../components/skelton";
import { GhostBadge } from "../../components/badge";

const columns = [
  {
    header: 'DATE',
    accessor: 'applicableDateTime',
    render: (row) => dateTime.getDisplayDate(row.applicableDateTime)
  },
  {
    header: 'ACTIVITY DETAILS',
    render: (row) => (
      <div className="d-flex flex-column gap-1">
        <Text weight="bold">
          {
            row.events && row.events === "sign_up" ?
              "Sign up bonus"
              : row.earningSource && row.earningSource === "Order" ?
                "Points earned on Order"
                : row.earningSource && row.earningSource === "Redeemed" ?
                  "Points redeemed on Order"
                  :
                  row.earningSourceDesc || row.rule
          }
        </Text>
        <Text size="paragraph-xs">
          {
            row.earningSource && (row.earningSource === "Order" || row.earningSource === "Redeemed") ?
              `Order Id: ${row.earningSourceDesc || row.orderId || 'N/A'}`
              :
              `Ref: ${row.transactionId || row.orderId || 'N/A'}`
          }
        </Text>
      </div>
    )
  },
  {
    header: 'POINTS CHANGE',
    render: (row) => (
      <Text size="paragraph-lg">
        {utils.formatNumber(row.points)}
      </Text>
    )
  },
  {
    header: 'STATUS',
    align: 'center',
    render: (row) => (
      <div className="d-flex justify-content-center">
        <GhostBadge color={row.transactionType === "Credited" ? "success" : "error"}>{row.transactionType === "Credited" ? "EARNED" : "REDEEMED"}</GhostBadge>
      </div>
    )
  }
];

const PointsHistoryTable = ({ loader, data, page, onPageChange }) => {
  return (
    <>
      {
        loader ?
          <SkeltonBox className="w-100 qb-br-16" style={{ height: "800px" }} />
          : data?.transactions?.length ?
            <div className="w-100 qb-bg-card-grad qb-border-solid-grey qb-br-16 qb-shadow-sm overflow-hidden">
              <Table columns={columns} data={data?.transactions || []} />
              <div className="qb-pagination-wrapper py-3 px-4">
                <Pagination
                  page={page}
                  total={data?.totalEntries || 10}
                  pageSize={10}
                  onPageChange={onPageChange}
                />
              </div>
            </div>
            :
            <div className="py-6 h-100 d-flex flex-column w-100 align-items-center justify-content-center">
              <img className="qb-empty-illustration" src="/assets/empty-illustrations/wallet.webp" alt="No Orders Found" />
              <Text weight="bold" color="muted" className="pt-4 pb-2">No Transactions Found</Text>
              <Text size="paragraph-sm" color="muted">We were unable to find any transaction history for your account.</Text>
            </div>
      }
    </>
  )
}

export default PointsHistoryTable;
