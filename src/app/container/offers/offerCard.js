import { Card } from "../../components/surface";
import { Badge } from "../../components/badge";
import { Text } from "../../components/typography";
import { dateTime } from "../../utils";
import { useConfig } from "../../context";

const OfferCard = ({ offer }) => {
	if (!offer || !offer.reward) return null;

	const config = useConfig();

	const { offerCode, reward, offerEndDate } = offer;

	return (
		<Card className="p-4 d-flex flex-column align-items-stretch">
			<div className="d-flex align-items-center justify-content-between gap-3">
				<Badge color="primary">{
					reward?.amountOrPercentageOffDiscount?.entitledType === "PRODUCT" ?
						"SELECT PRODUCTS"
						: reward?.amountOrPercentageOffDiscount?.entitledType === "COLLECTION" ?
							"SELECT COLLECTIONS"
							: reward?.buyXGetYDiscount?.prerequisiteType === "PRODUCT" ?
								"SELECT PRODUCTS"
								: reward?.buyXGetYDiscount?.prerequisiteType === "COLLECTION" ?
									"SELECT COLLECTIONS"
									: "ALL ORDERS"
				}</Badge>
				<Text size="paragraph-xs" >{offerCode}</Text>
			</div>
			<Text className="pt-4">{reward?.title}</Text>
			<Text size="title-md" weight="bold" className="text-wrap text-uppercase">
				{
					reward?.rewardType === "BUY_X_GET_Y" ?
						`Buy ${reward?.rewardType?.buyXGetYDiscount?.prerequisiteQuantity ? reward.rewardType.buyXGetYDiscount.prerequisiteQuantity : "One"} Get ${reward?.rewardType?.buyXGetYDiscount?.entitledQuantity ? reward.rewardType.buyXGetYDiscount.entitledQuantity : "One"} for ${reward?.rewardType?.buyXGetYDiscount?.entitledItemDiscountPercent ? reward.rewardType.buyXGetYDiscount.entitledItemDiscountPercent : "free"}`
						:
						`${reward?.rewardType === "FIXED_AMOUNT_OFF" ? `${config?.ui?.currency} ` : ''}${reward?.amountOrPercentageOffDiscount?.discountValue ? Number(reward.amountOrPercentageOffDiscount.discountValue).toFixed(0) : ''}${reward?.rewardType === "PERCENTAGE_OFF" ? "%" : ""} OFF`
				}
			</Text>
			{
				reward?.orderType?.length ?
					<Text size="paragraph-sm" >Applicable on {reward.orderType.join(", ").toLowerCase()}</Text>
					:
					null
			}
			<div className="p-2 qb-br-8 qb-bg-light mt-3 h-100 qb-border-solid-grey">
				<ul className="qb-fs-paragraph-xs ps-3">
					{reward?.rewardType === "BUY_X_GET_Y" ? <li className="qb-offer-li">
						Buy {reward?.rewardType?.buyXGetYDiscount?.prerequisiteQuantity ? reward.rewardType.buyXGetYDiscount.prerequisiteQuantity : "One"} of {reward?.buyXGetYDiscount?.prerequisiteType === "PRODUCT" ? `${reward.buyXGetYDiscount.prerequisiteVariants.map((item) => (item.variantName)).join(`, `)}` : reward?.buyXGetYDiscount?.prerequisiteType === "COLLECTION" ? `${reward.buyXGetYDiscount.prerequisiteCollection.map((item) => (item.collectionName)).join(", ")}` : ''} and get {reward?.rewardType?.buyXGetYDiscount?.entitledQuantity ? reward.rewardType.buyXGetYDiscount.entitledQuantity : "One"} of {reward?.buyXGetYDiscount?.entitledType === "PRODUCT" ? `${reward.buyXGetYDiscount.entitledVariants.map((item) => (item.variantName)).join(", ")}` : reward?.buyXGetYDiscount?.entitledType === "COLLECTION" ? `${reward.buyXGetYDiscount.entitledCollection.map((item) => (item.collectionName)).join(", ")}` : ''} for {reward?.rewardType?.buyXGetYDiscount?.entitledItemDiscountPercent ? reward.rewardType.buyXGetYDiscount.entitledItemDiscountPercent : "free"}
					</li> : null}
					{offerEndDate ? <li className="qb-offer-li">Offer expiring on {dateTime.getDisplayDate(offerEndDate)}</li> : null}
					{reward?.amountOrPercentageOffDiscount?.minPurchaseAmount ? <li className="qb-offer-li"> Minimum order value should be {config?.ui?.currency} {reward.amountOrPercentageOffDiscount.minPurchaseAmount}</li> : null}
					{reward?.amountOrPercentageOffDiscount?.minPurchaseQuantity ? <li className="qb-offer-li"> Minimum order quantity should be {reward.amountOrPercentageOffDiscount.minPurchaseQuantity}.</li> : null}
					{reward?.amountOrPercentageOffDiscount?.entitledType && reward.amountOrPercentageOffDiscount.entitledType === "COLLECTION" && reward.amountOrPercentageOffDiscount.entitledCollection?.length ? <li className="qb-offer-li"> Coupon code can be applied only for selected collections, {reward.amountOrPercentageOffDiscount.entitledCollection.map((item) => (item.collectionName)).join(", ")?.toLowerCase()}.</li> : null}
					{reward?.amountOrPercentageOffDiscount?.entitledType && reward.amountOrPercentageOffDiscount.entitledType === "PRODUCT" && reward.amountOrPercentageOffDiscount.entitledVariants?.length ? <li className="qb-offer-li"> Coupon code can be applied only for selected products, {reward.amountOrPercentageOffDiscount.entitledVariants.map((item) => (item.parentProductName)).join(", ")?.toLowerCase()}.</li> : null}
					{reward?.amountOrPercentageOffDiscount?.isOncePerCustomer ? <li className="qb-offer-li"> Coupon code can be applied only once per user</li> : null}
					{reward?.amountOrPercentageOffDiscount?.usageLimit && !(reward.amountOrPercentageOffDiscount.isOncePerCustomer) ? <li className="qb-offer-li"> Coupon code can be used only {reward.amountOrPercentageOffDiscount.usageLimit} times per user</li> : null}
				</ul>
			</div>
		</Card>
	);
}

export default OfferCard;
