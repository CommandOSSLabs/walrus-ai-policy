import Hstack from "app/components/Hstack";
import Typography from "app/components/Typography";
import OpenBookLine from "public/assets/line/open-book.svg";

export default () => {
  return (
    <div className="border border-[#352F2F] rounded-xl">
      <Hstack className="text-white justify-start h-10 px-3.5 border-b border-[#352F2F]">
        <OpenBookLine />

        <Typography className="text-sm">README</Typography>
      </Hstack>

      <div className="p-3.5">
        <Typography className="text-[#BACAC4]">
          This artifact contains the complete technical specification for a
          novel consensus algorithm designed for decentralized archival storage
          networks. The algorithm combines sharded binary tree structures with
          proof-of-storage validation to ensure data integrity and availability
          across distributed nodes. Key innovations include: • Parallel
          validation across shard boundaries • Adaptive difficulty adjustment
          based on network capacity • Byzantine fault tolerance up to 33%
          malicious nodes • Sub-second finality for storage commitments The
          specification includes formal proofs, reference implementations, and
          integration guidelines for existing blockchain infrastructures.
        </Typography>
      </div>
    </div>
  );
};
