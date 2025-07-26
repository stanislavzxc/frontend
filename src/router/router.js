import { createRouter, createWebHistory } from "vue-router";
import AppVue from "../App.vue";
import App404 from "../components/App_404.vue";
import AppMarket from "../components/AppMarket.vue";
import AppCart from "../components/AppCart.vue";
import MyMiners from "../components/MyMiners.vue";
import BlockFaq from "../components/BlockFaq.vue";
import AppProfile from "../components/AppProfile.vue";
import AppMain from "../components/AppMain.vue";
import ControlReset from "../components/СontrolReset.vue";
import MyPayments from "@/components/MyPayments.vue";
import AppAccruals from "@/components/AppAccruals.vue";
import AppDashboard from "@/components/AppDashboard.vue";
import AppProduct from "../components/AppProduct.vue";
import AppPayment from "../components/AppPayment.vue";
import CreateTicket from "../components/CreateTicket.vue";
// import AppTicket from "../components/AppTicket.vue";
// import AppTickets from "../components/AppTickets.vue";
import BlockBusiness from "../components/BlockBusiness.vue";
import TopTwenty from "../components/TopTwenty.vue";
import MyStat from "../components/MyStat.vue";
import AppTech from "../components/FormFeedback.vue";
import AppMessages from "../components/AppMessages.vue";
import AppSupport from "../components/AppSupport.vue";
import AppInfo from "../components/AppInfo.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: AppVue,
    },
    {
      path: "/404",
      name: "404",
      component: App404,
    },
    {
      path: "/marketplace",
      name: "marketplace",
      component: AppMarket,
    },
    {
      path: "/cart",
      name: "cart",
      component: AppCart,
    },
    {
      path: "/myminers",
      name: "myminers",
      component: MyMiners,
    },
    // {
    //   path: "/support",
    //   name: "support",
    //   component: AppSupport,
    // },
    {
      path: "/faq",
      name: "faq",
      component: BlockFaq,
    },
    {
      path: "/profile",
      name: "profile",
      component: AppProfile,
    },
    {
      path: "/main",
      name: "main",
      component: AppMain,
    },
    {
      path: "/reset_password",
      name: "controlreset",
      component: ControlReset,
    },
    {
      path: "/mypayments",
      name: "mypayments",
      component: MyPayments,
    },
    {
      path: "/accruals",
      name: "accruals",
      component: AppAccruals,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: AppDashboard,
    },
    {
      path: "/product",
      name: "product",
      component: AppProduct,
    },
    {
      path: "/payment",
      name: "payment",
      component: AppPayment,
    },
    {
      path: "/create_ticket",
      name: "createTicket",
      component: CreateTicket,
    },
    {
      path: "/infoblock",
      name: "infoblock",
      component: AppInfo,
    },
    // {
    //   path: "/ticket",
    //   name: "ticket",
    //   component: AppTicket,
    // },
    // {
    //   path: "/tickets",
    //   name: "tickets",
    //   component: AppTickets,
    // },
    {
      path: "/ReadyBusiness",
      name: "business",
      component: BlockBusiness,
    },
    {
      path: "/top20",
      name: "top20",
      component: TopTwenty,
    },
    {
      path: "/stat",
      name: "stat",
      component: MyStat,
    },
    {
      path: "/info",
      name: "info",
      component: AppSupport,
    },
    {
      path: "/tech",
      name: "tech",
      component: AppTech,
    },
    {
      path:"/ticket",
      name:"ticket",
      component:AppMessages,
    }
  ],
});

export default router;
