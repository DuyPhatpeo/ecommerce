// src/components/home/MainHome.tsx
import React from "react";
import Banner from "./Banner";
import Features from "./Features";
import Promo from "./Promo";
import HotDeal from "./HotDeal";
import BrandStrip from "./BrandStrip";
import ProductView from "./ProductView";
import { getAppConfig } from "../../lib/utils/appConfig";
import Loader from "../../components/layout/Loader";

const Home: React.FC = () => {
  // Config backend giả lập
  const remoteConfig = {
    sectionOrder: {
      Promo: { order: 1 },
      ProductView_1: {
        order: 2,
        props: {
          status: "latest",
          mode: "slider",
          maxProducts: 12,
          title: "Last Products",
        },
      },
      Features: { order: 3 },
      ProductView_2: {
        order: 4,
        props: {
          category: "running",
          mode: "grid",
          maxProducts: 8,
          title: "Running Products",
        },
      },
      ProductView_4: {
        order: 5,
        props: {
          category: "casual",
          mode: "grid",
          maxProducts: 8,
          title: "Casual Products",
        },
      },
      HotDeal: { order: 7 },
      BrandStrip: { order: 8 },
    },
  };

  const { normalizemode, modeDefault } = getAppConfig(remoteConfig);

  // Mapping section keys → component
  const sectionMap: Record<string, React.FC<any>> = {
    Banner,
    Features,
    Promo,
    HotDeal,
    BrandStrip,
    ProductView,
  };

  // Chuẩn hóa danh sách section theo order
  const displaySections = Object.entries(remoteConfig.sectionOrder ?? {})
    .map(([key, cfg]) => {
      const baseKey = key.split("_")[0];
      const order =
        typeof cfg === "object" && "order" in cfg ? cfg.order : Number(cfg);
      const props =
        typeof cfg === "object" && "props" in cfg ? cfg.props : undefined;
      return { key, baseKey, order, props };
    })
    .filter(({ baseKey }) => baseKey in sectionMap)
    .sort((a, b) => a.order - b.order);

  if (!displaySections.length) return <Loader />; // optional: fallback khi không có section

  return (
    <>
      {/* Banner luôn hiển thị đầu tiên */}
      <Banner />

      {displaySections.map(({ key, baseKey, props }) => {
        const Component = sectionMap[baseKey];
        const finalProps =
          baseKey === "ProductView"
            ? {
                ...props,
                mode: normalizemode(props?.mode ?? modeDefault),
              }
            : props;

        return (
          <section key={key}>
            <Component {...finalProps} />
          </section>
        );
      })}
    </>
  );
};

export default Home;
