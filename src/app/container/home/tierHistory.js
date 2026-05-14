import { Text } from "../../components/typography";
import { SkeltonBox } from "../../components/skelton";
import { dateTime } from "../../utils";

const TierHistoryCard = ({ data, loader }) => {

  return (
    <>
      {
        !loader ?
          <div className="qb-bg-card-grad p-4 qb-border-solid-grey qb-br-16 qb-shadow-sm w-100">
            <div className="mb-4">
              <Text size="title-sm" weight="bold">Tier History</Text>
            </div>

            <div className="w-100 d-flex flex-column gap-3">
              {data?.tierChangeStats?.map((item, index) => (
                <div key={index} className="d-flex position-relative w-100">
                  {index != 0 && (
                    <div className="position-absolute qb-tier-history-line qb-bg-grey h-100"></div>
                  )}

                  <div className={`position-relative qb-tier-history-circle ${item.upgrade ? "qb-bg-secondary" : "qb-bg-grey"}`}></div>

                  <div className="d-flex flex-column ps-3">
                    <Text size="paragraph-md">{item.upgrade ? "Promoted to" : "Moved to"} {item.toTier}</Text>
                    <Text size="paragraph-sm" color="muted">{dateTime.getDisplayDate(item.tierChangeDate)}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
          :
          <SkeltonBox className="w-100 qb-br-16" style={{ height: "300px" }} />
      }
    </>
  )
}

export default TierHistoryCard;