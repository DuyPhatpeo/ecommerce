// src/components/home/MainHome.tsx
import Banner from "./Banner";
import Features from "./Features";
import Promo from "./Promo";
import HotDeal from "./HotDeal";
import BrandStrip from "./BrandStrip";
import ProductView from "./ProductView";
import { useAppConfig } from "../../hooks/useAppConfig";

const MainHome = () => {
  // 🧩 Giả lập config backend (test nhiều kiểu giá trị)
  const remoteConfig = {
    sectionOrder: {
      Features: { order: 1 },
      ProductView_1: {
        order: 2,
        props: { viewMode: true, status: "latest" },
      },
      ProductView_2: {
        order: 3,
        props: { viewMode: false, status: "latest" },
      },

      Promo: { order: 6 },
      HotDeal: { order: 7 },
      BrandStrip: { order: 8 },
    },
  };

  // ⚙️ Hook xử lý config (fallback viewMode)
  const { normalizeViewMode, viewModeDefault } = useAppConfig(remoteConfig);

  // 🧱 Map component
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

  // 🧮 Chuẩn hóa danh sách section
  const sortedSections = Object.entries(remoteConfig?.sectionOrder ?? {})
    .map(([key, cfg]) => ({
      key,
      baseKey: key.split("_")[0],
      order:
        typeof cfg === "object" && "order" in cfg ? cfg.order : Number(cfg),
      props: typeof cfg === "object" && "props" in cfg ? cfg.props : undefined,
    }))
    .sort((a, b) => Number(a.order) - Number(b.order))
    .filter(({ baseKey }) => baseKey in sectionMap);

  // 🎨 Render layout
  return (
    <>
      <Banner />
      {sortedSections.map(({ key, baseKey, props }) => {
        const Section = sectionMap[baseKey];
        return (
          <section key={key}>
            <Section {...props} />
          </section>
        );
      })}
    </>
  );
};

export default MainHome;
