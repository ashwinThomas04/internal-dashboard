import { Text } from "../../components/typography";
import { TextLink } from "../../components/cta";
import { SkeltonBox } from "../../components/skelton";
import { dateTime } from "../../utils";

const PointsHistory = ({ loader, data }) => {

  return (
    <>
      {
        !loader && data?.transactions?.length ?
          <div className="qb-bg-card-grad p-4 qb-border-solid-grey qb-br-16 qb-shadow-sm w-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <Text size="title-sm" weight="bold">Recent Activity</Text>
              <TextLink as="router" to="/app/points" size="sm" color="dark" weight="bold">View All</TextLink>
            </div>

            <div className="d-flex flex-column w-100 qb-content-column-wrapper">
              {data.transactions.map((item, index) => (
                <div
                  key={item.transactionId || index}
                  className="d-flex w-100 align-items-center justify-content-between py-3 qb-content-row-item"
                >
                  <div className="d-flex flex-column gap-1">
                    <Text>
                      {
                        item.events && item.events === "sign_up" ?
                          "Sign up bonus"
                          : item.earningSource && item.earningSource === "Order" ?
                            "Points earned on Order"
                            : item.earningSource && item.earningSource === "Redeemed" ?
                              "Points redeemed on Order"
                              :
                              item.earningSourceDesc || item.rule
                      }
                    </Text>
                    <Text size="paragraph-xs" color="muted">{dateTime.getDisplayDate(item.applicableDateTime)}</Text>
                  </div>
                  <Text
                    color={item.transactionType === "Debited" ? "error" : "dark"}
                  >
                    {item.transactionType === "Credited" ? "+" : "-"}{item.points.toLocaleString()}
                  </Text>
                </div>
              ))}
            </div>
          </div>
          :
          <SkeltonBox className="w-100 qb-br-16" style={{ height: "500px" }} />
      }
    </>
  )
}

export default PointsHistory;
