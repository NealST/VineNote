import { useSelectedRss } from "@/components/navigation-bar/controllers/selected-rss";
import { cn } from "@/lib/utils";
import ItemCard from "./item-card";
import styles from "./index.module.css";

const RssDetail = function () {
  const selectedRss = useSelectedRss((state) => state.rss);
  const rssItems = selectedRss.items || [];

  return (
    <div className={cn(styles.rss_detail, "space-y-4 p-4")}>
      {rssItems.map((article, index) => {
        const { title, description, pubDate, link, enclosure } = article;
        return (
          <ItemCard
            key={link}
            title={title}
            description={description}
            pubDate={pubDate}
            link={link}
            imageUrl={enclosure?.url} // 如果 RSS 包含封面图
          />
        );
      })}
    </div>
  );
};

export default RssDetail;
