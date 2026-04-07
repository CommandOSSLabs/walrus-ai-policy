import { Drawer, DrawerContent, DrawerTrigger } from "app/components/ui/drawer";
import ArrowExpandLine from "public/assets/line/arrow-expand.svg";
import ArtifactFileList from "../ArtifactFileList";
import type { ArtifactFilePreviewProps } from ".";
import { useEffect, useState } from "react";

export default ({
  files,
  rootId,
  suiObjectId,
  select,
  onRefetch,
}: ArtifactFilePreviewProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [select]);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger className="size-8 text-white/80 bg-white/14 rounded-sm min-[992px]:hidden">
        <ArrowExpandLine className="mx-auto size-3.5" />
      </DrawerTrigger>

      <DrawerContent className="px-0 bg-background border-[#352F2F]">
        <ArtifactFileList
          files={files}
          rootId={rootId}
          suiObjectId={suiObjectId}
          select={select}
          onRefetch={onRefetch}
          variant={{
            className: "overflow-y-auto border-none",
          }}
        />
      </DrawerContent>
    </Drawer>
  );
};
