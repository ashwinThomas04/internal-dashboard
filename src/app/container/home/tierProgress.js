import { Text } from "../../components/typography";
import { ProgressBar } from "../../components/progressBar";
import { SkeltonBox } from "../../components/skelton";
import { useMemo } from "react";

/*-----------------------------
  THESE COMPONENTS NEED TO
  BE UPDATED PROPERLY BEFORE
  GOING LIVE. PROGRESS NEEDS
  TO BE UPDATED FOR POINT 
  BASED TIER SYSTEM. NEXT
  TIER NAME ALSO NEEDS TO
  BE UPDATED PROPERLY.
-----------------------------*/

const TierProgress = ({ data, loader, tierMap }) => {

  const { progress, currentTier, nextTier, points } = useMemo(() => {
    if (!tierMap || !data?.stats) return { progress: 0, currentTier: null, nextTier: null, points: 0 };

    const sortedTiers = [...tierMap].sort((a, b) => a.level - b.level);
    const currentTierId = data.stats.tierId;
    const currentTierIndex = sortedTiers.findIndex(t => t.id === currentTierId);

    const currentTier = currentTierIndex !== -1 ? sortedTiers[currentTierIndex] : sortedTiers[0];
    const nextTier = currentTierIndex !== -1 && currentTierIndex < sortedTiers.length - 1 ? sortedTiers[currentTierIndex + 1] : null;

    const points = data.stats.totalEarnedRewardCoins || 0;

    let progress = 100;
    if (nextTier) {
      const min = currentTier.entryPoints || 0;
      const max = nextTier.entryPoints || 1;
      progress = ((points - min) / (max - min)) * 100;
      progress = Math.min(100, Math.max(0, progress));
    }

    return { progress, currentTier, nextTier, points };
  }, [data, tierMap]);

  return (
    <>
      {
        !loader && tierMap ?
          <div className="qb-bg-card-grad p-4 qb-border-solid-grey qb-br-16 qb-shadow-sm">
            <div className="w-100 d-flex flex-column gap-3">
              <div className="d-flex w-100 justify-content-between gap-3 flex-lg-row flex-column">
                <div className="d-flex flex-column">
                  <Text size="title-sm" weight="bold">Pathway to Excellence</Text>
                  <Text color="muted">
                    {nextTier
                      ? `You are ${Math.max(0, nextTier.entryPoints - points).toFixed(0)} points away from ${nextTier.name} tier. Keep earning to unlock more benefits!`
                      : `You are currently in the ${currentTier?.name || data?.stats?.tierName} tier. You've reached the highest tier!`
                    }
                  </Text>
                </div>
                <div className="d-flex flex-shrink-0 align-items-end">
                  <Text weight="bold">{(data?.stats?.availablePoints || 0).toLocaleString()} Points</Text>
                </div>
              </div>

              <ProgressBar progress={progress} />

              <div className="d-flex w-100 align-items-center justify-content-between">
                <Text size="paragraph-xs" weight="bold" className="text-uppercase">{currentTier?.name || data?.stats?.tierName} Status</Text>
                <Text size="paragraph-xs" weight="bold" color="muted" className="text-uppercase">{nextTier ? `${nextTier.name} Status` : 'Max Status'}</Text>
              </div>
            </div>
          </div>
          :
          <SkeltonBox className="w-100 qb-br-16" style={{ height: "150px" }} />
      }
    </>
  )
}

export default TierProgress;