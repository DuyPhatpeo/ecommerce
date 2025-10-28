// src/components/home/MainHome.tsx
import Banner from "./Banner";
import Features from "./Features";
import Promo from "./Promo";
import HotDeal from "./HotDeal";
import BrandStrip from "./BrandStrip";
import ProductView from "./ProductView";
import { useAppConfig } from "../../hooks/useAppConfig";

const MainHome = () => {
  // Config backend
  const remoteConfig = {
    sectionOrder: {
      Features: { order: 3 },
      ProductView_1: { order: 2, props: { viewMode: true, status: "latest" } },
      ProductView_2: { order: 4, props: { viewMode: false, status: "latest" } },
      Promo: { order: 1 },
      HotDeal: { order: 7 },
      BrandStrip: { order: 8 },
    },
  };

  const { normalizeViewMode, viewModeDefault } = useAppConfig(remoteConfig);

  // Map section name → component
  const sectionMap: Record<string, (props?: any) => JSX.Element> = {
    Features: () => <Features />,
    Promo: () => <Promo />,
    ProductView: (props) => {
      const resolvedMode = normalizeViewMode(
        props?.viewMode ?? viewModeDefault
      );
      return <ProductView {...props} viewMode={resolvedMode} />;
    },
    HotDeal: () => <HotDeal />,
    BrandStrip: () => <BrandStrip />,
  };

  // Chuẩn hóa, sắp xếp, filter section
  const displaySections = Object.entries(remoteConfig?.sectionOrder ?? {})
    .map(([key, cfg]) => ({
      key,
      baseKey: key.split("_")[0],
      order:
        typeof cfg === "object" && "order" in cfg ? cfg.order : Number(cfg),
      props: typeof cfg === "object" && "props" in cfg ? cfg.props : undefined,
    }))
    .sort((a, b) => a.order - b.order)
    .filter(({ baseKey }) => baseKey in sectionMap)
    .map(({ key, baseKey, props }) => ({
      key,
      Component: sectionMap[baseKey],
      props,
    }));

  return (
    <>
      <Banner />
      {displaySections.map(({ key, Component, props }) => (
        <section key={key}>
          <Component {...props} />
        </section>
      ))}
    </>
  );
};

export default MainHome;
