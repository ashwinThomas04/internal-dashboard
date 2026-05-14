import { Text } from "../../components/typography";
import { SkeltonBox } from "../../components/skelton";
import { utils } from "../../utils";

const BalanceCard = ({ data, loader }) => {
  return (
    <>
      {
        !loader ?
          <div className="qb-bg-card-grad p-4 qb-border-solid-grey qb-br-16 qb-shadow-sm">
            <div className="w-100 d-flex align-items-end justify-content-between gap-4">
              <div>
                <Text color="muted" size="paragraph-xs">Available Balance</Text>
                <Text size="display-sm">{utils.formatNumber(data?.stats?.availablePoints || 0)}</Text>
              </div>
              <div className="d-flex align-items-center gap-4 pb-2">
                <div>
                  <Text color="muted" size="paragraph-xs">Lifetime Earned</Text>
                  <Text size="title-sm" weight="bold">{utils.formatNumber(data?.stats?.totalEarnedRewardCoins || 0)}</Text>
                </div>
                <div>
                  <Text color="muted" size="paragraph-xs">Lifetime Redeemed</Text>
                  <Text size="title-sm" weight="bold">{utils.formatNumber(data?.stats?.totalRedeemedRewardPoints || 0)}</Text>
                </div>
              </div>
            </div>
          </div>
          :
          <SkeltonBox className="w-100 qb-br-16" style={{ height: "150px" }} />
      }
    </>
  )
}

export default BalanceCard;