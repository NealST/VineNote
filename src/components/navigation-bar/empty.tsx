interface IProps {
  tip: string;
}

const Empty = function ({ tip }: IProps) {
  return (
    <div className="flex flex-col items-center gap-4 mt-16">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">添加文件夹~</p>
      </div>
    </div>
  );
};

export default Empty;
