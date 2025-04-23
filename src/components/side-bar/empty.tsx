import styles from "./index.module.css";

interface IProps {
  tip: string;
}

const Empty = function ({ tip }: IProps) {
  return <div className={styles.empty}>{tip}</div>;
};

export default Empty;
