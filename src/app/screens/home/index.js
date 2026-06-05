import { useState } from "react";
import { Text } from "../../components/typography";
import { HeadingTabs } from "../../components/tab";
import CustomerDashboard from "../../container/home/customerDashboards";
import EmailSignupPages from "../../container/home/emailSignupPages";

const HomePage = () => {
  const [tabs, setTabs] = useState([
    { label: "Customer Dashboards", value: "dashboard", isActive: true },
    { label: "Email Signup Pages", value: "emailer", isActive: false },
  ]);

  const onTabClick = (index) => {
    const updatedTabs = tabs.map((tab, i) => {
      return {
        ...tab,
        isActive: i === index,
      }
    });
    setTabs(updatedTabs);

  }

  return (
    <div className="container py-5">
      <Text size="title-lg" weight="black">Customer Pages</Text>
      <Text className="pt-3" weight="bold">Select a page type.</Text>
      <Text className="pt-1 pb-4" size="paragraph-sm">We have loyalty and subscription dashboards under the customer dashboard and seperate email signup pages which don't offer a logged in dashboard.</Text>
      <HeadingTabs tabs={tabs} onTabClick={onTabClick} />
      <div className="pt-5">
        {
          tabs.map(tab => {
            if (tab.value === "dashboard" && tab.isActive) return <CustomerDashboard />
            else if (tab.value === "emailer" && tab.isActive) return <EmailSignupPages />
          })
        }
      </div>
    </div>
  )
}
export default HomePage;